// Error parser transient analysis timestep too small
// linter: ngspicejs-lint --internal
"use strict";

ngspice_error_parsers.tran_timestep_too_small = function (aLog, aHandledLines, aNetlist) {
    // Error parser transient analysis timestep too small
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.tran_timestep_too_small(log,handled_lines,netlist)');
    ignore(aNetlist);
    // stderr doAnalyses: TRAN:  Timestep too small; time = 0.00222644, timestep = 1.25e-16: trouble with qstuck-instance j_t1
    // stderr tran simulation(s) aborted
    var i, hints = [];
    for (i = 0; i < aLog.length; i++) {
        if (aLog[i].match('TRAN:  Timestep too small')) {
            aHandledLines[i] = true;
            if (aLog[i + 1].indexOf('tran simulation(s) aborted') > 0) {
                aHandledLines[i + 1] = true;
            }
            hints.push(aLog[i]);
            if (!Internal.ignore_timestep_too_small) {
                return {
                    confidence: 0.5,
                    error: "Transient analysis timestep too small",
                    hints: hints,
                    file: "",
                    line: 0,
                    character: 0,
                    netlist_line: ''
                };
            }
        }
    }
};

globalThis.exports = {};

