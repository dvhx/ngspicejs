// Parser for generic error in AC command
// linter: ngspicejs-lint --internal
// global: ngspice_error_parsers, netlist_line_markers_find_device
"use strict";

ngspice_error_parsers.ac_error = function (aLog, aHandledLines, aNetlist) {
    // Parser for generic error in AC command
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.ac_error(log,handled_lines,netlist)');
    ignore(aNetlist);
    // "stdout Error on line 26 :",
    // "stdout ac dec 10 16 20000",
    var i, a, b, d, dev, netlist_line, hints = [];
    for (i = 0; i < aLog.length - 1; i++) {
        a = aLog[i];
        b = aLog[i + 1];
        if (a.match('stdout Error on line ') &&
            b.match('stdout ac ')) {
            netlist_line = parseInt(a.match(/[0-9]+/)[0]);
            d = netlist_line_markers_find_device(netlist_line);
            dev = netlist_devices[d];
            hints.push('Device #' + d + ' that generated this netlist line was:');
            hints.push('Netlist line that caused this error was: ' + b);
            hints.push(JSON.stringify(dev, undefined, 4));
            aHandledLines[i] = true;
            aHandledLines[i + 1] = true;
            return {
                confidence: 0.5,
                error: "Invalid argument of AC analysis",
                hints: hints,
                file: "",
                line: 0,
                character: 0,
                netlist_line: netlist_line
            };
        }
    }
};

globalThis.exports = {};
