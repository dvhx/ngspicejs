//  Handle "circuit not parsed." error
// linter: ngspicejs-lint --internal
// global: ngspice_error_parsers, netlist_line_markers_find_device
"use strict";

ngspice_error_parsers.circuit_not_parsed = function (aLog, aHandledLines, aNetlist) {
    //  Handle "circuit not parsed." error
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.circuit_not_parsed(log,handled_lines,netlist)');
    ignore(aNetlist);
    var i, a, hints = [];
    for (i = 0; i < aLog.length; i++) {
        a = aLog[i];
        //  Error: circuit not parsed.
        if (a.match('circuit not parsed')) {
            aHandledLines[i] = true;
            return {
                confidence: 0.3,
                error: "Circuit not parsed!",
                hints: hints,
                file: "",
                line: 0,
                character: 0,
                netlist_line: ""
            };
        }
    }
};

globalThis.exports = {};
