// This function is called just after script finishes and before ngspicejs exits normally (not via exit(number))
// linter: ngspicejs-lint --internal
"use strict";

function before_exit() {
// This function is called just after script finishes and before ngspicejs exits normally (not via exit(number))
    assert_arguments_length(arguments, 0, 0, 'before_exit()');

    // make sure it is only called once
    if (before_exit.called) {
        return;
    }
    before_exit.called = true;

    try {
        // In case of error, try to find similarly named keyword
        // ReferenceError: sinwave is not defined
        var e = Internal.last_exception_string(),
            m;
        if (e) {
            m = e.match(/ReferenceError: (\w+) is not defined/);
            //echo_json(m[1]);
            var glob = Object.keys(globalThis).sort();
            if (m) {
                var s = similar_strings(m[1], glob, 5, true);
                hint("Similar identifiers: " + s.join(', '));
            }
            echo_hints();
        }
        // extra checks but only if exit code is non-zero
        if (Internal.exit_code() === 0) {
            assert_no_pending_analyses();
            assert_netlist_snapshot_unchanged();
            SubModel.assert_all_sub_models_ended();
        }
    } catch (ex) {
        error("before_exit() failed: " + ex);
    }
}

Internal.before_exit = before_exit;
globalThis.exports = {before_exit};
