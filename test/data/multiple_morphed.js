function foo() {
Enter({ name: 'foo', lineNumber: 1, range: [0, 17] });
Exit({ name: 'foo', lineNumber: 1, range: [0, 72] });
                                                      }

var bar = function() {
Enter({ name: 'bar', lineNumber: 3, range: [29, 170] });

    console.log('Hello');

    function baz() {
Enter({ name: 'baz', lineNumber: 7, range: [74, 115] });
      alert('baz')
    
Exit({ name: 'baz', lineNumber: 9, range: [186, 284] });
    }

    (function() {
Enter({ name: '[Anonymous]', lineNumber: 11, range: [122, 136] }); 
Exit({ name: '[Anonymous]', lineNumber: 14, range: [291, 372] });
                                                                   }());
    (function abc() {
Enter({ name: '[Anonymous]', lineNumber: 12, range: [146, 164] }); 
Exit({ name: '[Anonymous]', lineNumber: 16, range: [382, 467] });
                                                                   }());

Exit({ name: 'bar', lineNumber: 4, range: [84, 473] });
}
