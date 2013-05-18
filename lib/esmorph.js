/*
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*jslint node:true browser:true plusplus:true */
/*global define:true,esmorph:true,esprima:true */

(function (root, factory) {
    'use strict';

    if (typeof exports === 'object') {
        // CommonJS
        factory(exports, require('esprima'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'esprima'], function (exports, esprima) {
            factory((root.esmorph = exports), esprima);
        });
    } else {
        // Browser globals
        factory((root.esmorph = {}), root.esprima);
    }
}(this, function (exports, esprima) {
    'use strict';

    // Executes visitor on the object and its children (recursively).

    function traverse(object, visitor, master) {
        var key, child, parent, path;

        parent = (typeof master === 'undefined') ? [] : master;

        visitor.call(null, object, parent);
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                child = object[key];
                path = [ object ];
                path.push(parent);
                if (typeof child === 'object' && child !== null) {
                    traverse(child, visitor, path);
                }
            }
        }
    }

    // Insert fragments into the string, return a new string.

    function insert(str, fragments) {
        var i, fragment;

        // Sort in descending order since a fragment needs to be
        // inserted from the last one, to prevent offsetting the others.
        fragments.sort(function (a, b) {
            return b.index - a.index;
        });

        for (i = 0; i < fragments.length; i += 1) {
            fragment = fragments[i];
            str = str.slice(0, fragment.index) + fragment.text +
                str.slice(fragment.index, str.length);
        }

        return str;
    }

    // Find every function expression and declaration, also deduce the name
    // on a best-effort basis.

    function collectFunction(code, tree) {
        var functionList = [];

        traverse(tree, function (node, path) {
            var parent;
            if (node.type === esprima.Syntax.FunctionDeclaration) {
                functionList.push({
                    name: node.id.name,
                    range: node.range,
                    loc: node.loc,
                    blockStart: node.body.range[0]
                });
            } else if (node.type === esprima.Syntax.FunctionExpression) {
                parent = path[0];
                if (parent.type === esprima.Syntax.AssignmentExpression) {
                    if (typeof parent.left.range !== 'undefined') {
                        functionList.push({
                            name: code.slice(parent.left.range[0],
                                      parent.left.range[1]).replace(/"/g, '\\"'),
                            range: node.range,
                            loc: node.loc,
                            blockStart: node.body.range[0]
                        });
                    }
                } else if (parent.type === esprima.Syntax.VariableDeclarator) {
                    functionList.push({
                        name: parent.id.name,
                        range: node.range,
                        loc: node.loc,
                        blockStart: node.body.range[0]
                    });
                } else if (parent.type === esprima.Syntax.CallExpression) {
                    functionList.push({
                        name: parent.id ? parent.id.name : '[Anonymous]',
                        range: node.range,
                        loc: node.loc,
                        blockStart: node.body.range[0]
                    });
                } else if (typeof parent.length === 'number') {
                    functionList.push({
                        name: parent.id ? parent.id.name : '[Anonymous]',
                        range: node.range,
                        loc: node.loc,
                        blockStart: node.body.range[0]
                    });
                } else if (typeof parent.key !== 'undefined') {
                    if (parent.key.type === 'Identifier') {
                        if (parent.value === node && parent.key.name) {
                            functionList.push({
                                name: parent.key.name,
                                range: node.range,
                                loc: node.loc,
                                blockStart: node.body.range[0]
                            });
                        }
                    }
                }
            }
        });

        return functionList;
    }

    // Insert a prolog in the body of every function.
    // It will be in the form of a function call:
    //
    //     traceName(object);
    //
    // where the object contains the following properties:
    //
    //    'name' holds the name of the function
    //    'lineNumber' holds the starting line number of the function block
    //    'range' contains the index-based range of the function
    //
    // The name of the function represents the associated reference for
    // the function (deduced on a best-effort basis if it is not
    // a function declaration).
    //
    // If traceName is a function instead of a string, it will be invoked and
    // the result will be used as the entire prolog. The arguments for the
    // invocation are the function name, range, and location info.

    function traceFunctionEntrance(traceName) {

        return function (code) {
            var tree,
                functionList,
                fragments,
                param,
                signature,
                pos,
                i;


            tree = esprima.parse(code, { range: true, loc: true });
            functionList = collectFunction(code, tree);

            // Populate the fragments to be inserted into the code.

            fragments = [];
            for (i = 0; i < functionList.length; i += 1) {
                param = {
                    name: functionList[i].name,
                    range: functionList[i].range,
                    loc: functionList[i].loc
                };
                if (typeof traceName === 'function') {
                    signature = traceName.call(null, param);
                } else {
                    signature = traceName + '({ ';
                    signature += 'name: \'' + functionList[i].name + '\', ';
                    if (typeof functionList[i].loc !== 'undefined') {
                        signature += 'lineNumber: ' + functionList[i].loc.start.line + ', ';
                    }
                    signature += 'range: [' + functionList[i].range[0] + ', ' +
                        functionList[i].range[1] + '] ';
                    signature += '});';
                }
                signature = '\n' + signature;
                fragments.push({
                    index: functionList[i].blockStart + 1,
                    text: signature
                });
            }

            return insert(code, fragments);
        };
    }

    function traceFunctionExit(traceName) {

        return function (code) {
            var tree, functionList, fragments, param, signature, i, j;


            tree = esprima.parse(code, { range: true, loc: true });
            functionList = collectFunction(code, tree);

            // Populate the fragments to be inserted into the code.

            fragments = [];
            for (i = 0; i < functionList.length; i += 1) {
                param = {
                    name: functionList[i].name,
                    range: functionList[i].range,
                    loc: functionList[i].loc
                };
                if (typeof traceName === 'function') {
                    signature = traceName.call(null, param);
                } else {
                    signature = traceName + '({ ';
                    signature += 'name: \'' + functionList[i].name + '\', ';
                    if (typeof functionList[i].loc !== 'undefined') {
                        signature += 'lineNumber: ' + functionList[i].loc.start.line + ', ';
                    }
                    signature += 'range: [' + functionList[i].range[0] + ', ' +
                        functionList[i].range[1] + '] ';
                    signature += '});';
                }
                signature = '\n' + signature + '\n';
                for (j = 1; j < param.loc.end.column; ++j) {
                    signature += ' ';
                }
                fragments.push({
                    index: functionList[i].range[1] - 1,
                    text: signature
                });
            }

            return insert(code, fragments);
        };
    }

    function modify(code, modifiers) {
        var i;

        if (Object.prototype.toString.call(modifiers) === '[object Array]') {
            for (i = 0; i < modifiers.length; i += 1) {
                code = modifiers[i].call(null, code);
            }
        } else if (typeof modifiers === 'function') {
            code = modifiers.call(null, code);
        } else {
            throw new Error('Wrong use of esmorph.modify() function');
        }

        return code;
    }

    // Sync with package.json.
    exports.version = '0.0.0-dev';

    exports.modify = modify;

    exports.Tracer = {
        FunctionEntrance: traceFunctionEntrance,
        FunctionExit: traceFunctionExit
    };

}));

