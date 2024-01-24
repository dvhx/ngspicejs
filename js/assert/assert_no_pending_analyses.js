// Assert that there are no analyses that were modified but not actually run, e.g.: tran().run().interval('1m');
// linter: ngspicejs-lint --internal
"use strict";

function assert_no_pending_analyses() {
    // Assert that there are no analyses that were modified but not actually run, e.g.: tran().run().interval('1m');
    assert_arguments_length(arguments, 0, 0, 'assert_no_pending_analyses()');
    Tran.tran.forEach((a) => {
        if (a.modified) {
            warn("Tran analysis " + JSON.stringify(a.attr) + " was modified but not run!");
        }
    });
    Ac.ac.forEach((a) => {
        if (a.modified) {
            warn("Ac analysis " + JSON.stringify(a.attr) + " was modified but not run!");
        }
    });
    Fft.fft.forEach((a) => {
        if (a.modified) {
            warn("Fft analysis " + JSON.stringify(a.attr) + " was modified but not run!");
        }
    });
    BatterySensitivity.battery_sensitivity.forEach((a) => {
        if (a.modified) {
            warn("BatterySensitivity analysis " + JSON.stringify(a.attr) + " was modified but not run!");
        }
    });
}

globalThis.exports = {assert_no_pending_analyses};
Internal.assert_no_pending_analyses = assert_no_pending_analyses;
