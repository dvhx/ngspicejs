// Ignore 2 new lines introduced in ngspice 42
// linter: ngspicejs-lint --internal
// global: ngspice_error_parsers
"use strict";

ngspice_error_parsers.ignore_ngspice_42 = function (aLog, aHandledLines, aNetlist) {
    // Parser for 2 new lines introduced in ngspice 42
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.ignore_ngspice_42(log,handled_lines,netlist)');
    ignore(aNetlist);
    // stderr Warning: No job (tran, ac, op etc.) defined:
    // stderr run simulation not started
    var i, s;
    for (i = 0; i < aLog.length; i++) {
        s = aLog[i];
        if (s.includes("stderr Warning: No job (tran, ac, op etc.) defined:")) {
            aHandledLines[i] = true;
        }
        if (s.includes("stderr run simulation not started")) {
            aHandledLines[i] = true;
        }
        if (s.includes("stderr Using SPARSE 1.3 as Direct Linear Solver")) {
            aHandledLines[i] = true;
        }
        if (s.includes('dc value used for op instead of transient time')) {
            // I believe this is just saying that if you use DC 1 and and at time=0
            // it calculates the actual value to be 0.999999999 it will use 1 instead
            aHandledLines[i] = true;
        }
    }
};

globalThis.exports = {};

