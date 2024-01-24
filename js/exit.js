// Stop script execution with given exit code
// linter: ngspicejs-lint --internal
"use strict";

function exit(aCode) {
    // Stop script execution with given exit code
    if (assert_arguments_length) {
        assert_arguments_length(arguments, 1, 1, 'exit(code)');
    }
    if (assert_integer) {
        assert_integer(aCode, 'code', 'exit(code)');
    }
    exit_code(aCode);
    throw "NGSPICEJS_SOFT_EXIT";
}

globalThis.exit = exit;
globalThis.exports = {exit};
