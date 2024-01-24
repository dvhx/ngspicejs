// Parser for "stderr Note: can't find init file."
// linter: ngspicejs-lint --internal
// global: ngspice_error_parsers
"use strict";

ngspice_error_parsers.cant_find_init_file = function (aLog, aHandledLines, aNetlist) {
    // Parser for "stderr Note: can't find init file."
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.cant_find_init_file(log,handled_lines,netlist)');
    ignore(aNetlist);
    // stderr Note: can't find init file.
    var i, s;
    for (i = 0; i < aLog.length; i++) {
        s = aLog[i];
        if (s.match("stderr Note: can't find init file")) {
            aHandledLines[i] = true;
            // Sometimes ngspice cannot find spinit.in but there is nothing
            // important in that file so we can ignore it
        }
    }
};

globalThis.exports = {};
