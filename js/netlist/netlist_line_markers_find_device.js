// Finding what device caused what error in netlist
// linter: ngspicejs-lint --internal
"use strict";

/* jshint -W079 */
var netlist_line_markers = [];
/* jshint +W079 */

function netlist_line_markers_find_device(aLine) {
    // Find which device is responsible for offending line
    assert_arguments_length(arguments, 1, 1, 'netlist_line_markers_find_device(line)');
    var i;
    for (i = 0; i < netlist_line_markers.length; i++) {
        if (netlist_line_markers[i].line >= aLine) {
            return netlist_line_markers[i > 0 ? i - 1 : i].device;
        }
    }
}

globalThis.exports = {netlist_line_markers, netlist_line_markers_find_device};
globalThis.netlist_line_markers = netlist_line_markers;
globalThis.netlist_line_markers_find_device = netlist_line_markers_find_device;
