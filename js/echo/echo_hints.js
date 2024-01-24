// Print any pending hints stored in the hint buffer and clear hint buffer
// linter: ngspicejs-lint --internal
"use strict";

var prefix_hint = terminal_colors() ? "\x1b[94mhint:\x1b[0m " : "hint: ";

function echo_hints() {
    // Print any pending hints stored in the hint buffer and clear hint buffer
    assert_arguments_length(arguments, 0, 0, 'echo_hint()');
    var h = hint_buffer();
    h.forEach((s) => {
        echo(prefix_hint + s);
    });
}

globalThis.exports = {echo_hints};
globalThis.echo_hints = echo_hints;
