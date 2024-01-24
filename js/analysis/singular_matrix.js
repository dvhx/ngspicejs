// Return true if netlist forms singular matrix (e.g. caps has no path to ground)
// linter: ngspicejs-lint --internal
"use strict";

function singular_matrix() {
    // Return true if netlist forms singular matrix (e.g. caps has no path to ground)
    assert_arguments_length(arguments, 0, 0, 'singular_matrix()');
    var netlist = Internal.netlist_render(netlist_devices, Internal.netlist_line_markers, true, false);
    Internal.ngspice_netlist(netlist);
    Internal.ngspice_command('op');
    var l = Internal.ngspice_log();
    return l.toString().indexOf('Warning: singular matrix') >= 0 ? true : false;
}

globalThis.exports = {singular_matrix};
globalThis.singular_matrix = singular_matrix;

