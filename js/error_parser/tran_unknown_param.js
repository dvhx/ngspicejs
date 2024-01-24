// Error parser transient analysis bad param
// linter: ngspicejs-lint --internal
"use strict";

ngspice_error_parsers.tran_unknown_param = function (aLog, aHandledLines, aNetlist) {
// Error parser transient analysis bad param
    assert_arguments_length(arguments, 3, 3, 'ngspice_error_parsers.tran_unknown_param(log,handled_lines,netlist)');
    ignore(aNetlist);
    // stdout Error on line 29 :
    // stdout .tran 0.00009999999999999999 0.01 zebra
    // stdout Error: unknown parameter on .tran - ignored
    var i, hints = [], line, code, d, dev;
    for (i = 0; i < aLog.length; i++) {
        if (aLog[i].match('Error: unknown parameter on .tran')) {
            aHandledLines[i] = true;
            line = parseInt(aLog[i - 2].match(/[0-9]+/)[0], 10);
            code = aLog[i - 1].substr(8);
            echo('line=', line);
            echo('code=', code);
            d = netlist_line_markers_find_device(line);
            echo_json(d, 4);
            hints.push('Message provided by ngspice was too generic to determine which parameter is wrong');
            hints.push('Netlist line that caused this error was: ' + code);
            hints.push('Device #' + d + ' that generated this netlist line was:');
            dev = netlist_devices[d];
            hints.push(JSON.stringify(dev, undefined, 4));
            return {
                confidence: 0.5,
                error: "Transient analysis in device #" + d + " has unrecognized parameter",
                hints: hints,
                file: "",
                line: 0,
                character: 0,
                netlist_line: code
            };
        }
    }
};

globalThis.exports = {};
