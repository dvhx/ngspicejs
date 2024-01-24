// Error parser for "coupling to non-existant inductor"
// linter: ngspicejs-lint --internal
// global: ngspice_error_parsers, netlist_line_markers_find_device
"use strict";

ngspice_error_parsers.coupling_to_non_existant_inductor = function (aLog, aHandledLines, aNetlist) {
    // Error parser for "coupling to non-existant inductor"
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.coupling_to_non_existatnt_inductor(log,handled_lines,netlist)');
    ignore(aNetlist);
    // stderr Fatal error: kk1: coupling to non-existant inductor ll1a.
    // stderr doAnalyses: impossible error - can't occur
    // stderr run simulation(s) aborted
    var i, hints = [], s;
    for (i = 0; i < aLog.length; i++) {
        if (aLog[i].match('coupling to non-existant inductor')) {
            aHandledLines[i] = true;
            if (aLog[i + 1] === "stderr doAnalyses: impossible error - can't occur") {
                aHandledLines[i + 1] = true;
            }
            if (aLog[i + 2] === "stderr run simulation(s) aborted") {
                aHandledLines[i + 2] = true;
            }
            // Get inductor name
            s = aLog[i].split('coupling to non-existant inductor')[1].trim().replace(/\.$/, '');
            if (s.startsWith('l')) {
                s = s.substr(1);
            }
            s = s.toUpperCase();
            // Get all inductors
            hints.push('Available inductors are: ' + Inductor.inductors.map((a)=>a.attr.name).join(', '));
            hints.push('Note that you can only cuple ideal inductors (without rs or cp), if you need rs or cp you need to add them as stand alone components');
            return {
                confidence: 0.5,
                error: "Coupling to non-existant inductor " + s,
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
