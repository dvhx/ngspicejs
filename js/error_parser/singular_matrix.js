// Parser for singular matrix, typically no path to ground from capacitor
// linter: ngspicejs-lint --internal
"use strict";

ngspice_error_parsers.singular_matrix = function (aLog, aHandledLines, aNetlist) {
    // Parser for singular matrix, typically no path to ground from capacitor
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.singular_matrix(log,handled_lines,netlist)');
    ignore(aNetlist);
    // stderr Warning: singular matrix:  check nodes out2 and out
    var i, s, n, bad = {}, err = false, hints = [];
    for (i = 0; i < aLog.length; i++) {
        s = aLog[i];
        if (s.match('stderr Warning: singular matrix:  check nodes')) {
            err = true;
            aHandledLines[i] = true;
            n = s.replace('stderr Warning: singular matrix:  check nodes', '').trim().split(' and ');
            bad[n] = 1;
        }
        if (s === 'stderr Warning: Further gmin increment') {
            aHandledLines[i] = true;
        }
    }
    if (err) {
        var seen = {}, o;
        Object.keys(bad).sort().forEach((nn) => {
            nn.split(',').forEach((n) => {
                if (!seen[n]) {
                    o = hint_devices_on_net(netlist_devices, n);
                    hints.push(o.hint);
                    if (o.only_caps) {
                        hints.push("If 2 capacitors are in series, their common pin must have path to ground, use e.g. 10G resistor to ground");
                        hints.push("Unconnected pins of capacitors must be connected to ground, use e.g. 10G resistor to ground");
                    }
                }
                seen[n] = 1;
            });
        });
        return {
            confidence: 0.5,
            error: "Problem with nets " + Object.keys(bad).sort() + " (check if capacitors have path to ground)",
            hints: hints,
            file: "",
            line: 0,
            character: 0,
            netlist_line: ""
        };
    }
};

globalThis.exports = {};
