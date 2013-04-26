/*
  Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>

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

/*global require:true, console:true, process:true */

var fs = require('fs'),
    path = require('path'),
    esmorph = require('../lib/esmorph'),
    args = process.argv.splice(2),
    total = 0,
    failures = 0;

function test(name, source, expected) {
    console.log('Checking', name, '...');
}

function processFile(filename) {
    var name, source, expected;

    if (filename.match('_morphed.js')) {
        return;
    }

    name = path.basename(filename);
    source = fs.readFileSync(filename, 'utf-8');
    expected = fs.readFileSync(filename.replace('.js', '_morphed.js'), 'utf-8');
    test(name, source, expected);
}

// http://stackoverflow.com/q/5827612/
function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) {
            return done(err);
        }
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) {
                return done(null, results);
            }
            file = dir + '/' + file;
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        }());
    });
}

function processDir(dirname) {

    walk(path.resolve(__dirname, dirname), function (err, results) {
        if (err) {
            console.log('Error', err);
            return;
        }

        results.forEach(processFile);

        console.log();
        console.log('Tests:', total, '  Failures:', failures);
        process.exit(failures === 0 ? 0 : 1);
    });
}

if (args.length === 0) {
    processDir('data');
} else {
    args.forEach(processFile);
}

