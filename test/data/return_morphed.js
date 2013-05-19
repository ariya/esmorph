function answer() {
Enter({ name: 'answer', lineNumber: 1, range: [0, 214] });

  if (true) {
      
Exit({ name: 'answer', lineNumber: 4, range: [0, 214], return: true });
     return 42;
  }

  function one() {
Enter({ name: 'one', lineNumber: 7, range: [59, 212] });

    function two() {
Enter({ name: 'two', lineNumber: 9, range: [81, 185] });
      alert('Panic');
      console.log('Where is my towel?');
      
Exit({ name: 'two', lineNumber: 12, range: [81, 185], return: true });
     return true;
    
Exit({ name: 'two', lineNumber: 9, range: [81, 185] });
    }

    
Exit({ name: 'one', lineNumber: 15, range: [59, 212], return: true });
   return [1, 2, 3];
  
Exit({ name: 'one', lineNumber: 7, range: [59, 212] });
  }

Exit({ name: 'answer', lineNumber: 1, range: [0, 214] });
}
