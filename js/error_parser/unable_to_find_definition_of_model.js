// Error parser for some kind of missing model error uncaught elsewhere
// linter: ngspicejs-lint --internal
// global: netlist_line_markers_find_device
"use strict";

ngspice_error_parsers.unable_to_find_definition_of_model = function (aLog, aHandledLines, aNetlist) {
    // Error parser for some kind of missing model error uncaught elsewhere
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.unable_to_find_definition_of_model(log,handled_lines,netlist)');
    ignore(aNetlist);
    // "stdout MIF-ERROR - unable to find definition of model 20000",
    var i, a, hints = [], m;
    for (i = 0; i < aLog.length; i++) {
        a = aLog[i];
        if (a.match('unable to find definition of model')) {
            aHandledLines[i] = true;
            m = a.substr(a.indexOf('unable to find definition of model') + 'unable to find definition of model'.length + 1);
            // I could theoretically tell it is after line 26 of netlist
            hints.push('No details for this error');
            return {
                confidence: 0.3,
                error: "Unable to find definition of model '" + m + "'",
                hints: hints,
                file: "",
                line: 0,
                character: 0,
                netlist_line: 0
            };
        }
    }
};

globalThis.exports = {};
