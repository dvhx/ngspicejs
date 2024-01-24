// Convert array of real or complex values to decibels
// linter: ngspicejs-lint --internal
"use strict";

function array_db(aArray) {
    // Convert array of real or complex values to decibels
    assert_arguments_length(arguments, 1, 1, 'array_db(array)');
    assert_array(aArray, 'arr', 'array_db(arr)');
    var a = aArray;
    if (Array.isArray(aArray[0])) {
        if (aArray[0].length !== 2) {
            throw new Exception('array_db(arr) argument should be real or complex, but contains array of size ' + aArray[0].length);
        }
        a = array_modulus(aArray);
    }
    return a.map((a) => (20 * Math.LOG10E * Math.log(a)));
}

globalThis.exports = {array_db};
globalThis.array_db = array_db;
