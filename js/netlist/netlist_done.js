// Send current netlist to ngspice, compile it, check log
// linter: ngspicejs-lint --internal
"use strict";

function netlist_done() {
    // Send current netlist to ngspice, compile it, check log
    assert_arguments_length(arguments, 0, 0, 'netlist_done()');
    var r = {};
    r.netlist_devices = netlist_devices;
    r.netlist_line_markers = netlist_line_markers;
    r.netlist = netlist_render(netlist_devices, netlist_line_markers, true, false);
    r.netlist_result = ngspice_netlist(r.netlist);
    r.netlist_run = ngspice_command('run');
    r.log = ngspice_log();
    r.errors = ngspice_process_log(r.log, r.netlist);
    r.ok = (r.netlist_result === true) && (!r.errors || (r.errors.length === 0));
    return r;
}

globalThis.exports = {netlist_done};
globalThis.netlist_done = netlist_done;
