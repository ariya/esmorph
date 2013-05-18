(function hello() {
Enter({ name: 'hello', lineNumber: 1, range: [1, 20] });
Exit({ name: 'hello', lineNumber: 1, range: [1, 20] });
                   }());

(function () {
Enter({ name: '[Anonymous]', lineNumber: 3, range: [27, 41] });
Exit({ name: '[Anonymous]', lineNumber: 3, range: [27, 41] });
              })();
