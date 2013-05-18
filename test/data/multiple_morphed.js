function foo() {
Exit({ name: 'foo', lineNumber: 1, range: [0, 17] });
                
Enter({ name: 'foo', lineNumber: 1, range: [0, 17] });}

var bar = function() {
Enter({ name: 'bar', lineNumber: 3, range: [29, 170] });

    console.log('Hello');

    function baz() {
Enter({ name: 'baz', lineNumber: 7, range: [74, 115] });
      alert('baz')
    
Exit({ name: 'baz', lineNumber: 7, range: [74, 115] });
    }

    (function() {
Enter({ name: '[Anonymous]', lineNumber: 11, range: [122, 136] }); 
Exit({ name: '[Anonymous]', lineNumber: 11, range: [122, 136] });
                  }());
    (function abc() {
Enter({ name: 'abc', lineNumber: 12, range: [146, 164] }); 
Exit({ name: 'abc', lineNumber: 12, range: [146, 164] });
                      }());

Exit({ name: 'bar', lineNumber: 3, range: [29, 170] });
}
