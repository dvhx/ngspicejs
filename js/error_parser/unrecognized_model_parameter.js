// Error parser for unrecognized model parameter
// linter: ngspicejs-lint --internal
// global: netlist_line_markers_find_device
"use strict";

ngspice_error_parsers.unrecognized_model_parameter = function (aLog, aHandledLines, aNetlist) {
    // Error parser for unrecognized model parameter
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.unrecognized_model_parameter(log,handled_lines,netlist)');
    ignore(aNetlist);
    // "stdout Warning: Model issue on line 14 :",
    // "stdout .model d1n5819 d(is=4.14809e-7 n=1.04287 rs=0.208896 bv=53.3 ibv=0.0006  ...",
    // "stdout unrecognized parameter (rg) - ignored",
    var i, a, b, am, bm, c, p, d, netlist_line, hints = [], dev;
    for (i = 0; i < aLog.length - 2; i++) {
        a = aLog[i];
        b = aLog[i + 1];
        c = aLog[i + 2];
        am = a.match('stdout Warning: Model issue on line');
        bm = b.match('stdout Warning: Model issue on line');
        if (
            (am || bm) &&
            c.match('stdout unrecognized parameter ')) {
            if (am) {
                aHandledLines[i] = true;
                netlist_line = parseInt(a.match(/[0-9]+/)[0]);
            }
            if (bm) {
                aHandledLines[i + 1] = true;
                netlist_line = parseInt(b.match(/[0-9]+/)[0]);
            }
            d = netlist_line_markers_find_device(netlist_line);
            dev = netlist_devices[d];
            p = c.substring(c.indexOf('(') + 1, c.lastIndexOf(')'));
            if (b.match('stdout .model')) {
                if ((netlist_line >= 0) && (!aNetlist[netlist_line].startsWith('**'))) {
                    hints.push('Netlist line that caused this error was: ' + aNetlist[netlist_line]);
                }
                hints.push('Netlist line that caused this error was: ' + b.substr(7));
            }
            hints.push('Device #' + d + ' that generated this netlist line was:');
            hints.push(JSON.stringify(dev.attr, undefined, 4));
            return {
                confidence: b.match('stdout .model') ? 0.8 : 0.5,
                error: "Model in device #" + d + " has unrecognized parameter '" + p + "'",
                hints: hints,
                file: "",
                line: 0,
                character: 0,
                netlist_line: netlist_line
            };
        }
    }
    // "stdout unrecognized parameter (rg) - ignored",
    for (i = 0; i < aLog.length - 3; i++) {
        a = aLog[i];
        if (a.match('stdout unrecognized parameter ')) {
            p = c.substring(c.indexOf('(') + 1, c.lastIndexOf(')'));
            return {
                confidence: 0.3,
                error: "Unrecognized parameter '" + p + "' somewhere in the netlist",
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
