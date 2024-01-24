// Show hints for given function arguments
// linter: ngspicejs-lint --internal
"use strict";

function hint_args(aFunctionName, aArguments) {
    // Show hints for given function arguments
    assert_arguments_length(arguments, 2, 2, 'hint_args(function_name,arguments)');
    hint("function '" + aFunctionName + "' was called with " + aArguments.length + " arguments");
    var i, t;
    for (i = 0; i < aArguments.length; i++) {
        t = typeof aArguments[i];
        if (Array.isArray(aArguments[i])) {
            t = 'array';
        }
        hint("argument #" + i + " was " + aArguments[i] + " (" + t + ")");
    }
}

globalThis.exports = {hint_args};
Internal.hint_args = hint_args;
