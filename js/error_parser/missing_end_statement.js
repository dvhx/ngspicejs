// Parser for missing .end statement, often error is before so this is low confidence error
// linter: ngspicejs-lint --internal
"use strict";

ngspice_error_parsers.missing_end_statement = function (aLog, aHandledLines, aNetlist) {
    // Parser for missing .end statement, often error is before so this is low confidence error
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.missing_end_statement(log,handled_lines,netlist)');
    ignore(aNetlist);
    // "stderr Error: .end statement is missing in netlist"
    var i, a, n = aNetlist;
    for (i = 0; i < aLog.length; i++) {
        a = aLog[i];
        if (a.match('stderr Error: .end statement is missing in netlist')) {
            aHandledLines[i] = true;
            return {
                confidence: 0.2,
                error: "Missing .end statement in the netlist",
                hints: [],
                file: "",
                line: n.length - 1,
                character: 0,
                netlist_line: n[n.length - 1]
            };
        }
    }
};

globalThis.exports = {};
