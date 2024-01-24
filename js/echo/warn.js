// Print warning
// linter: ngspicejs-lint --internal
"use strict";

var prefix_warn = terminal_colors() ? "\x1b[95mwarn:\x1b[0m " : "warn: ";

function warn(aMessage) {
    // Print warning
    assert_arguments_length(arguments, 1, 1, 'warn(message)');
    echo_stream(2);
    echo(prefix_warn + aMessage);
    echo_stream(1);
}

globalThis.exports = {warn};
globalThis.warn = warn;
