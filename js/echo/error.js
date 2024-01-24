// Print error and any pending hints
// linter: ngspicejs-lint --internal
"use strict";

var prefix_error = terminal_colors() ? "\x1b[91merror:\x1b[0m " : "error: ";

function error(aMessage) {
    // Print error and any pending hints
    assert_arguments_length(arguments, 1, 1, 'error(message)');
    error.happened = true;
    echo_stream(2);
    echo(prefix_error + aMessage);
    echo_stream(1);
    echo_hints();
    if (exit_code() === 0) {
        exit_code(13); // unspecified js error
    }
}

globalThis.exports = {error};
globalThis.error = error;
