(function hello() {
Exit({ name: 'hello', lineNumber: 1, range: [1, 20] });
                   
Enter({ name: 'hello', lineNumber: 1, range: [1, 20] });}());

(function () {
Exit({ name: '[Anonymous]', lineNumber: 3, range: [27, 41] });
              
Enter({ name: '[Anonymous]', lineNumber: 3, range: [27, 41] });})();
