/* ____________________________________________
                        1
*/
/*
 globalEnvironment
 outer: null don`t have parent environment

 environmentRecord: { mainVariable: undefined; worker: function worker() {...}}

 BUT: console.log(mainVariable) // Uncaught ReferenceError: mainVariable is not defined (Temporal Dead Zone (TDZ) error).
 Only they cannot be accessed for reading or writing until a string declaring this variable at the context execution step is executed
 */
let mainVariable = 100;
// environmentRecord: { mainVariable: 100; worker: function worker() {...}}

function worker() {
    /*
     environmentRecord: { mainVariable: function mainVariable() {}; worker: function worker() {...}}
     even though you have return, function expression will be recorded during compilation when context will be created
     */
    mainVariable = 10;
    // environmentRecord: {mainValue: 10}
    // IMPORTANT: it will not rewrite global variable mainVariable,
    // because search of the variable is going by the chain of lexical environment
    return;
    function mainVariable() {}
}

worker();
console.log(mainVariable); // 100

/* ____________________________________________
                        2
*/
/*
1. on initialization phase JS engine creates object environmentRecord with names of variables,
only allocated for them  a cell in memory

{ globalEnvironment,
  outer: null,
  environmentRecord = {
      value: undefined,
      inner: function() {...},
      outer: function () {...}
  }
}
 */
var value = 1;

/*
code execution begins from row var value = 1; and change environmentRecord
  environmentRecord = {
      value: 1,
      inner: function() {...},
      outer: function () {...}
  }
 */

function inner() {
    var value;
    console.log(value);
}

function outer() {
    var value = 2;
    console.log(value);
    inner();
}

console.log(value);
outer();
console.log(value);
// 1
// 2
// undefined
// 1
/* ____________________________________________
                        3
*/

function outer() {
    /*
    environmentRecord: {function inner() {return: 3}}
    rewrite
    environmentRecord: {function inner() {return: 8}}
     */
    function inner() {
        return 3;
    }

    return inner();

    function inner() {
        return 8;
    }
}

let result = outer();
console.log(result); // 8

/* ____________________________________________
                        4
*/

function parent() {
    // environmentRecord: { hoisted: undefined} on a compilation step

    var hoisted = "i am variable!";

    // environmentRecord: { hoisted: "i am variable!" } on a compilation step

    function hoisted() {
        return "i am function";
    }

    return hoisted(); // TypeError: hoisted is not a function
}

let result = parent();
console.log(result); // > Uncaught TypeError: hoisted is not a function

/* ____________________________________________
                        5
*/

function parent() {
    let hoisted = "I'm a variable";

    function hoisted() {
        return "I'm a function";
    }

    return hoisted();
}

let result = parent();
console.log(result); // Uncaught SyntaxError: Identifier 'hoisted' has already been declared

/* ____________________________________________
                        6
*/

let result = outer()

console.log(result) // 3

function outer() {
    // { environmentRecord: { inner: undefined }} pop up 2 times with value undefined at compiler at the context creation step
    // { enviromentRecord: { inner: function() { return 3 }}} on the step of implementation value it will change to function
    var inner = function() {
        return 3;
    }

    return inner(); // because of the return will not go down

    var inner = function() {
        return 8;
    }
}

/* ____________________________________________
                        7
*/

var value = 10;

let worker = function() {
    console.log('First value is:', value)
    var value = 20;
    console.log('Second value is:', value)
}

worker()
console.log('Third value is:', value)
// > First value is: undefined
// > Second value is: 20
// > Third value is: 10
