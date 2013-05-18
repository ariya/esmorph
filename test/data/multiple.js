function foo() {}

var bar = function() {

    console.log('Hello');

    function baz() {
      alert('baz')
    }

    (function() { }());
    (function abc() { }());
}
