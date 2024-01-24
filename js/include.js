// Wrapper for include_globap (because I don't know how to return it in cpp)
// linter: ngspicejs-lint --internal
"use strict";

function include(aFileName) {
    // Include external JS file and return only exports
    // Example: var Animals = include('animals.js'); Animals.dog();
    assert_arguments_length(arguments, 1, 1, 'include(filename)');
    assert_string(aFileName, 'filename', 'include(filename)');
    include_global(aFileName);
    return globalThis.exports;
}

globalThis.exports = {include};
globalThis.include = include;
