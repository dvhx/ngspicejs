// Error parser for gmin stepping
// linter: ngspicejs-lint --internal
"use strict";

ngspice_error_parsers.gmin = function (aLog, aHandledLines, aNetlist) {
    // Error parser for gmin stepping
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.gmin(log,handled_lines,netlist)');
    ignore(aNetlist);
    // stderr Error: no such vector v(2)
    // stderr Error: no such vector 2
    // stderr in term: v(2)
    var i, s;
    for (i = 0; i < aLog.length; i++) {
        s = aLog[i];
        if ((s.match('Trying gmin =') ||
            s.match('Note: Starting dynamic gmin stepping') ||
            s.match('Warning: Dynamic gmin stepping failed') ||
            s.match('Note: Starting true gmin stepping') ||
            s.match('Warning: True gmin stepping failed') ||
            s.match('Note: Starting source stepping') ||
            s.match('Note: Dynamic gmin stepping completed') ||
            s.match('Note: Transient op started') ||
            s.match('Note: Transient op finished successfully') ||
            (s.match('Supplies reduced to') && (s.match('Warning: source stepping failed'))) ||
            (s.match('Supplies reduced to') && (s.match('Note: One successful source step'))) ||
            s.match('Note: True gmin stepping completed'))) {
            aHandledLines[i] = true;
        }
    }
};

globalThis.exports = {};
