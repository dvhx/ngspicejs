// Show help to ngspicejs related question in plain sentence, e.g. help("How to change diode model")
// linter: ngspicejs-lint --internal
"use strict";

var color_help = terminal_colors() ? "\x1b[96m" : "";
var color_reset = terminal_colors() ? "\x1b[0m" : "";
var color_bold = terminal_colors() ? "\x1b[93m" : "";

function help(aQuery, oCount, oContinueExecution) {
    // Show help to ngspicejs related question in plain sentence, e.g. help("How to change diode model")
    assert_arguments_length(arguments, 1, 3, 'help(query,count,continue_execution)');
    if (typeof aQuery === 'function' || typeof aQuery === 'object') {
        return api(aQuery);
    }
    // make sure config_path exists
    if (!file_exists(config_path())) {
        dir_create(config_path());
    }
    // save question to ~/.config/ngspicejs/help.log
    var lfn = config_path() + 'help.log';
    var log = {};
    if (file_exists(lfn)) {
        log = file_read_json(lfn);
    }
    // show question
    echo(color_help + 'help:' + color_reset + ' ' + aQuery);
    echo();
    // read index
    var path = file_path(script_shell_full()) + '/';
    var doc = file_read_json(path + 'help/help_documents.json');
    var idx = file_read_json(path + 'help/help_index.json');
    // perform search
    var s = search(doc, aQuery, idx);
    // show results
    var shown = {};
    s.candidates.slice(0, oCount || 3).forEach((c,i) => {
        if (shown[c.doc.a]) {
            return;
        }
        echo(color_help + (i + 1) + '. ' + c.doc.q + color_reset);
        echo();
        var lines = file_read(path + c.doc.a).split('\n');
        lines = lines.filter((a) => a !== '' && a.charAt(0) !== '#' && a !== '"use strict";' && !a.startsWith('// linter'));
        lines = lines.forEach((a) => {
            var important = a.match(/\/\/\!$/);
            var l = a.replace(/\/\/\!$/, '');
            if (important) {
                echo('    ' + color_bold + l.trim() + color_reset);
            } else {
                echo('    ' + l.trim());
            }
        });
        echo();
        shown[c.doc.a] = 1;
    });
    // save help.log
    log[aQuery] = (s.candidates[0] && s.candidates[0].doc.q) || "";
    file_write_json(config_path() + 'help.log', log, 1);
    if (!oContinueExecution) {
        exit(1);
    }
}

globalThis.exports = {help};
globalThis.help = help;
