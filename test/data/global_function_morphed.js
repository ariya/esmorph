
function add(x, y) {
Enter({ name: 'add', lineNumber: 2, range: [1, 41] });
    
Exit({ name: 'add', lineNumber: 3, range: [1, 41], return: true });
   return x + y;

Exit({ name: 'add', lineNumber: 2, range: [1, 41] });
}

