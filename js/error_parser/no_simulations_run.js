// Error parser for "no simulations run"
// linter: ngspicejs-lint --internal
"use strict";

ngspice_error_parsers.no_simulations_run = function (aLog, aHandledLines, aNetlist) {
    // Error parser for "no simulations run"
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.no_simulations_run(log,handled_lines,netlist)');
    ignore(aNetlist);
    // Note: No ".plot", ".print", or ".fourier" lines; no simulations run
    var i, a;
    for (i = 0; i < aLog.length; i++) {
        a = aLog[i];
        if (a.match('no simulations run')) {
            aHandledLines[i] = true;
            return {
                confidence: 0.3,
                error: "No simulations run!",
                hints: [],
                file: "",
                line: 0,
                character: 0,
                netlist_line: ""
            };
        }
    }
};

globalThis.exports = {};
