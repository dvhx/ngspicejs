// Performant way to check if tran will fail on "timestep too small" error, returns true if it will pass
// linter: ngspicejs-lint --internal
"use strict";

function tran_ok(aStep, aInterval, aStart) {
    // Performant way to check if tran will fail on "timestep too small" error, returns true if it will pass
    // tran_check() takes ~8ms
    // singular_matrix() takes ~2ms (but cannot detect "timestepping too small" error)
    // tran().run() takes ~30ms
    aStep = aStep || '100u';
    aInterval = aInterval || '20m';
    aStart = aStart || 0;
    var netlist = Internal.netlist_render(netlist_devices, Internal.netlist_line_markers, true, false);
    Internal.ngspice_command('destroy all');
    Internal.ngspice_netlist(netlist);
    Internal.ngspice_command('tran ' + aStep.fromEng() + ' ' + aInterval.fromEng() + ' ' + aStart.fromEng());
    var l = Internal.ngspice_log();
    if (l.at(-1) === 'stderr tran simulation(s) aborted') {
        return false;
    }
    l = l.toString();
    if (l.indexOf('Warning: singular matrix') >= 0) {
        return false;
    }
    if (l.indexOf('stderr') >= 0) {
        return false;
    }
    return true;
}

globalThis.tran_ok = tran_ok;
globalThis.exports = {tran_ok};

