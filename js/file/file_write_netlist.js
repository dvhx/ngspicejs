// Write current netlist as ngspice netlist to file
// linter: ngspicejs-lint --internal
"use strict";

function file_write_netlist(aFileName) {
    // Write current netlist as ngspice netlist to file
    assert_arguments_length(arguments, 1, 1, 'file_write_netlist(filename)');
    assert_string(aFileName, 'filename', 'file_write_ngspicejs(filename)');
    file_write(aFileName, netlist_render(netlist_devices, netlist_line_markers, true, false));
}

globalThis.exports = {file_write_ngspicejs};
globalThis.file_write_netlist = file_write_netlist;

