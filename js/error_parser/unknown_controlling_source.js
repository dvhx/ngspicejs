// Error parser for wrong controlling source
// linter: ngspicejs-lint --internal
"use strict";

ngspice_error_parsers.unknown_controlling_source = function (aLog, aHandledLines, aNetlist) {
    // Error parser for wrong controlling source
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.unknown_controlling_source(log,handled_lines,netlist)');
    ignore(aNetlist);
    // stderr Fatal error: fx1: unknown controlling source vu1b
    // stderr doAnalyses: no such parameter on this device
    // stderr run simulation(s) aborted
    var i, hints = [], line;
    for (i = 0; i < aLog.length; i++) {
        if (aLog[i].match('unknown controlling source')) {
            aHandledLines[i] = true;
            if (aLog[i + 1].match('doAnalyses: no such parameter on this device')) {
                aHandledLines[i + 1] = true;
            }
            if (aLog[i + 2].match('run simulation\\(s\\) aborted')) {
                aHandledLines[i + 2] = true;
            }
            line = aLog[i].replace('stderr Fatal error: ', '').replace(': unknown controlling source ', ',').split(',');
            hints.push('Device that caused error is cccs "' + line[0] + '"');
            hints.push('Controlling source (typically ammeter) that could not be found is "' + line[1] + '"');
            if (Ammeter.ammeters.length > 0) {
                hints.push('Available ammeters are: ' + Ammeter.ammeters.map((a) => a.attr.name).join(', '));
            } else {
                hints.push("There are no available ammeters, use: ammeter('A1', anode, cathode)");
            }
            hints.push('You can also use any voltage source, available are: ' + netlist_devices.filter((a) => a.is_voltage_source).map((a) => a.attr.name).join(', '));
            return {
                confidence: 0.5,
                error: "Current controlled current source '" + line[0] + "' could not find ammeter '" + line[1] + "'",
                hints: hints,
                file: "",
                line: 0,
                character: 0,
                netlist_line: ""
            };
        }
    }
};

globalThis.exports = {};
