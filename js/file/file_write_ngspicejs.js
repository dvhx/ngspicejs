// Write current netlist as ngspicejs script
// linter: ngspicejs-lint --internal
"use strict";

function file_write_ngspicejs(aFileName) {
    // Write netlist to ngspicejs script
    assert_arguments_length(arguments, 1, 1, 'file_write_ngspicejs(filename)');
    assert_string(aFileName, 'filename', 'file_write_ngspicejs(filename)');
    var a = netlist_to_script();
    file_write(aFileName, a.join('\n'));
}

globalThis.exports = {file_write_ngspicejs};
globalThis.file_write_ngspicejs = file_write_ngspicejs;


