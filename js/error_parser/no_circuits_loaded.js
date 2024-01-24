// Error parser for "stderr Error: there aren't any circuits loaded."
// linter: ngspicejs-lint --internal
"use strict";

ngspice_error_parsers.no_circuits_loaded = function (aLog, aHandledLines, aNetlist) {
    // Error parser for "stderr Error: there aren't any circuits loaded."
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.no_circuits_loaded(log,handled_lines,netlist)');
    ignore(aNetlist);
    // stderr Error: there aren't any circuits loaded.
    var i, hints = [];
    for (i = 0; i < aLog.length; i++) {
        if (aLog[i].match('stderr Error: there aren\'t any circuits loaded')) {
            aHandledLines[i] = true;
            return {
                confidence: 0.5,
                error: "There aren't any circuits loaded",
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
