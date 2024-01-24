// Sum 2 numbers
// linter: ngspicejs-lint
"use strict";

function sum(a, b, ex) {
    if (ex === 'throw') {
        throw "sum(a,b) some custom exception thrown a=" + a + " b=" + b;
    }
    if (ex === 'throw2') {
        throw Exception("sum(a,b) some custom exception thrown a=" + a + " b=" + b);
    }
    if (ex === 'throw2new') {
        throw new Exception("sum(a,b) some custom exception thrown a=" + a + " b=" + b);
    }
    if (ex === 'bug') {
        return a / globalThis.z;
    }
    return a + b;
}

globalThis.exports = sum;
