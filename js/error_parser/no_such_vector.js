// Parser for bad net names
// linter: ngspicejs-lint --internal
"use strict";

ngspice_error_parsers.no_such_vector = function (aLog, aHandledLines, aNetlist) {
    // Parser for bad net names
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.no_such_vector(log,handled_lines,netlist)');
    ignore(aNetlist);
    // stderr Error: no such vector v(2)
    // stderr Error: no such vector 2
    // stderr in term: v(2)
    var i, s, n;
    for (i = 0; i < aLog.length; i++) {
        s = aLog[i];
        if (s.match('stderr Error: no such vector')) {
            aHandledLines[i] = true;
            n = s.replace('stderr Error: no such vector ', '');
            return {
                confidence: 0.5,
                error: "Invalid net name: " + n,
                hints: [], // TODO: hint at all similar nets?
                file: "",
                line: 0,
                character: 0,
                netlist_line: ""
            };
        }
    }
};

globalThis.exports = {};
