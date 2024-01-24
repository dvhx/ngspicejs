// Using e.g. diode without defining model
// linter: ngspicejs-lint --internal
// global: ngspice_error_parsers, netlist_line_markers_find_device
"use strict";

ngspice_error_parsers.could_not_find_modelname = function (aLog, aHandledLines, aNetlist) {
    // Using e.g. diode without defining model
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.could_not_find_modelname(log,handled_lines,netlist)');
    ignore(aNetlist);
    // Error on line 14 :
    //    dd1 1 0 d1n4148
    //  could not find a valid modelname
    var i, a, hints = [], netlist_line, d;
    for (i = 0; i < aLog.length; i++) {
        a = aLog[i];
        if (a.match('could not find a valid modelname')) {
            aHandledLines[i] = true;
            // n-2 line may have netlist line, find device from it
            if (aLog[i - 2] && aLog[i - 2].match('Error on line ')) {
                aHandledLines[i - 2] = true;
                netlist_line = parseInt(aLog[i - 2].match(/[0-9]+/)[0]);
                if (netlist_line >= 0) {
                    d = netlist_line_markers_find_device(netlist_line);
                    if (d) {
                        hints.push('Device that caused this error was #' + d + ' - ' + netlist_devices[d].type + ' ' + netlist_devices[d].attr.name);
                        // circular hints.push(JSON.stringify(netlist_devices[d], undefined, 4));
                    } else {
                        hints.push('Cannot tell which device caused this error');
                    }
                    aHandledLines[i - 1] = true;
                    hints.push('Netlist line #' + netlist_line + ' that caused error is: ' + aLog[i - 1].trim().replace(/^stdout /, ''));
                }
            }
            return {
                confidence: netlist_line > 0 ? 0.6 : 0.5,
                error: "Unable to find definition of a model",
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
