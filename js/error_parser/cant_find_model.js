// Using e.g. diode without defining model
// linter: ngspicejs-lint --internal
// global: ngspice_error_parsers, netlist_line_markers_find_device
"use strict";

ngspice_error_parsers.cant_find_model = function (aLog, aHandledLines, aNetlist) {
    // Using e.g. diode without defining model
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.cant_find_model(log,handled_lines,netlist)');
    ignore(aNetlist);
    // warning, can't find model 'd1n4148' from line
    //    dd1 1 0 d1n4148
    var i, a, hints = [], m, netlist_line, netlist_line_str, d;
    for (i = 0; i < aLog.length; i++) {
        a = aLog[i];
        if (a.match("warning, can't find model")) {
            // extract model name
            m = a.replace("stderr warning, can't find model '", "").replace("' from line", "");
            if (all_models().map((z) => z.toUpperCase()).includes(m.toUpperCase())) {
                hints.push('If you are using raw spice code (e.g. spice() or raw spice models), you need to prefix diode model with "D", e.g. D' + m.toUpperCase() + ', prefix Q for transistors, X for subcircuits, R for resistor models, ');
            }
            hints.push('Similar models: ' + similar_strings(m.toUpperCase(), all_models(), 5, true));
            // n+1 line contains netlist line
            netlist_line_str = aLog[i + 1] && aLog[i + 1].replace('stderr ', '').trim();
            if (netlist_line_str) {
                aHandledLines[i + 1] = true;
                netlist_line = aNetlist.map((z) => z.toLowerCase().trim()).indexOf(netlist_line_str);
                //hints.push('Netlist line #' + netlist_line + ' that caused ');
                //hints.push('Netlist line ' + aLog[i + 1]);
                if (netlist_line >= 0) {
                    d = netlist_line_markers_find_device(netlist_line);
                    if (d) {
                        hints.push('Device that caused this error was #' + d + ' - ' + netlist_devices[d].type + ' ' + netlist_devices[d].attr.name);
                        // circular: hints.push(JSON.stringify(netlist_devices[d], undefined, 4));
                    } else {
                        hints.push('Cannot tell which device caused this error');
                    }
                    hints.push('Netlist line #' + netlist_line + ' that caused error was: ' + netlist_line_str);
                } else {
                    hints.push('Netlist line that caused error was: ' + netlist_line_str);
                }
            }
            aHandledLines[i] = true;
            //hints.push('All models: ' + all_models, 5));
            return {
                confidence: netlist_line > 0 ? 0.8 : 0.7,
                error: "Unknown model '" + m + "'",
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
