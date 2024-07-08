// Get the ngspice output log and find any errors in it using error parsers
// linter: ngspicejs-lint --internal
"use strict";

function ngspice_process_log(aLog, aNetlist) {
    // Get the ngspice output log and find any errors in it using error parsers
    assert_arguments_length(arguments, 2, 2, 'ngspice_process_log(log, netlist)');
    assert_array_of_strings(aLog, 'log', 'ngspice_process_log(log, netlist) argument #1');
    assert_string(aNetlist, 'netlist', 'ngspice_process_log(log, netlist) argument #2');

    var log = aLog, nl = aNetlist.split('\n'), errors = [], handled_lines = [];
    handled_lines.length = log.length;

    // all parsers
    var parser;
    for (parser in ngspice_error_parsers) {
        if (ngspice_error_parsers.hasOwnProperty(parser)) {
            var o = ngspice_error_parsers[parser](log, handled_lines, nl);
            if (o) {
                errors.push(o);
            }
        }
    }

    // convert unhandled log lines with errors as unknown errors
    var i, h;
    for (i = 0; i < log.length; i++) {
        if (!handled_lines[i]) {
            if (log[i].match(/error|warning|fatal|stderr|failed|cannot|invalid/i)) {
                errors.push({
                    confidence: 0.1,
                    error: "Unhandled error in the output of ngspice: " + log[i],
                    hints: [],
                    file: "",
                    line: 0,
                    character: 0,
                    netlist_line: ''
                });
            }
        }
    }

    // sort errors by confidence
    errors = errors.sort(function (a, b) { return b.confidence - a.confidence; });
    //echo_json(errors);

    // show errors
    if (!ngspice_process_log.hide_errors) {
        var prefix = terminal_colors() ? "\x1b[94mhint:\x1b[0m " : "hint: ";
        for (i = 0; i < errors.length; i++) {
            error(errors[i].error);
            for (h = 0; h < errors[i].hints.length; h++) {
                echo(prefix + errors[i].hints[h]);
            }
        }

        // show netlist and log
        if (errors.length > 0) {
            echo_raw('netlist ');
            echo_json(aNetlist);
            echo_raw('log\n');
            // do not print consecutive repeating log lines
            var old = '';
            for (i = 0; i < log.length; i++) {
                if (old !== log[i]) {
                    echo('  [' + i + ']: ' + log[i]);
                    old = log[i];
                }
            }
            //error('ngspice_process_log() found ' + errors.length + ' errors');
            throw new Exception('ngspice_process_log() found ' + errors.length + ' errors');
        }
    }
    return errors.length === 0 ? null : errors;
}

globalThis.exports = {ngspice_process_log};
globalThis.ngspice_process_log = ngspice_process_log;
