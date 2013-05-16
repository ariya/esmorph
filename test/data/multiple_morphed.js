function foo() {
Enter({ name: 'foo', lineNumber: 1, range: [0, 17] });}

var bar = function() {
Enter({ name: 'bar', lineNumber: 3, range: [29, 160] });

    console.log('Hello');

    function baz() {
Enter({ name: 'baz', lineNumber: 7, range: [74, 105] }); alert('baz') }

    (function() {
Enter({ name: '[Anonymous]', lineNumber: 9, range: [112, 126] }); }());
    (function abc() {
Enter({ name: '[Anonymous]', lineNumber: 10, range: [136, 154] }); }());
}
