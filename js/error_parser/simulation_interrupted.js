// Error parser for "Simulation interrupted due to error!"
// linter: ngspicejs-lint --internal
"use strict";

ngspice_error_parsers.simulation_interrupted = function (aLog, aHandledLines, aNetlist) {
    // Error parser for "Simulation interrupted due to error!"
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.simulation_interrupted(log,handled_lines,netlist)');
    ignore(aNetlist);
    // Simulation interrupted due to error!
    var i, a;
    for (i = 0; i < aLog.length; i++) {
        a = aLog[i];
        if (a.match('Simulation interrupted due to error!')) {
            aHandledLines[i] = true;
            return {
                confidence: 0.3,
                error: "Simulation interrupted due to error!",
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
