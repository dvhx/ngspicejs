// Print internal error message
// linter: ngspicejs-lint --internal
"use strict";

var prefix_internal_error = terminal_colors() ? "\x1b[93minternal error:\x1b[0m " : "internal error: ";

function internal_error(aMessage) {
    // Print internal error message
    assert_arguments_length(arguments, 1, 1, 'internal_error(message)');
    error.happened = true;
    echo(prefix_internal_error + aMessage + ' (this is not your fault, please report this bug at http://???)');
}

globalThis.exports = {internal_error};
globalThis.internal_error = internal_error;
