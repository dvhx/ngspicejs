// Print example code
// linter: ngspicejs-lint --internal
"use strict";

var prefix_example = terminal_colors() ? "\x1b[92mexample:\x1b[0m " : "example: ";

function example(aSampleCode) {
    // Print example code
    assert_arguments_length(arguments, 1, 1, 'example(sample_code)');
    echo(prefix_example + aSampleCode);
}

globalThis.exports = {example};
Internal.example = example;
