// Error parser for "device already exists"
// linter: ngspicejs-lint --internal
// global: ngspice_error_parsers, netlist_line_markers_find_device
"use strict";

ngspice_error_parsers.device_already_exists = function (aLog, aHandledLines, aNetlist) {
    // Error parser for "device already exists"
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.device_already_exists(log,handled_lines,netlist)');
    ignore(aNetlist);
    // stdout Error on line 13 :
    // stdout dd1 0 1 d1n5819
    // stdout device already exists, existing one being used
    var i, hints = [], netlist_line, netlist_line_no, d, dn = '';
    for (i = 0; i < aLog.length; i++) {
        if (aLog[i].match('device already exists, existing one being used')) {
            aHandledLines[i] = true;
            if (aLog[i - 2].match('Error on line ')) {
                aHandledLines[i - 2] = true;
                netlist_line = aLog[i - 1].replace(/^stdout /, '').trim();
                netlist_line_no = parseInt(aLog[i - 2].match(/[0-9]+/)[0]);
                if (netlist_line_no >= 0) {
                    d = netlist_line_markers_find_device(netlist_line_no);
                    if (d) {
                        hints.push('Device that caused this error was #' + d + ' - ' + netlist_devices[d].type + ' ' + netlist_devices[d].attr.name);
                        hints.push(JSON.stringify(netlist_devices[d], undefined, 4));
                        dn = netlist_devices[d] && netlist_devices[d].params && netlist_devices[d].params.name;
                    } else {
                        hints.push('Cannot tell which device caused this error');
                    }
                    aHandledLines[i - 1] = true;
                    hints.push('Netlist line #' + netlist_line + ' that caused error is: ' + aLog[i - 1].trim().replace(/^stdout /, ''));
                }
            }
            return {
                confidence: 0.5,
                error: "Duplicate device name " + dn,
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
