// Faster version of AC run only for few frequencies (1ms vs 30ms for standard AC)
// linter: ngspicejs-lint --internal
"use strict";

function ac_fast(aFStart, aFStop, aNetName, aFrequencies, aSkipChecks) {
    // Faster version of AC run only for few frequencies (1ms vs 30ms for standard AC)
    if (!aSkipChecks) {
        Internal.assert_arguments_length(arguments, 4, 5, 'ac_fast(fstart, fstop, net_name, frequencies, skip_checks)');
        Internal.assert_net(aNetName, 'net_name', 'ac_fast(fstart, fstop, net_name, frequencies, skip_checks)');
        var nets = netlist_nets(netlist_devices);
        if (!nets.includes(aNetName)) {
            hint('ac_fast() needs nets, e.g. 2, not vectors V(2)');
            hint('available nets: ' + nets.join(', '));
            throw new Exception('ac_fast(fstart, fstop, net_name, frequencies, skip_checks) - no such net "' + aNetName + '"');
        }
        Internal.assert_array(aFrequencies, 'frequencies', 'ac_fast(fstart, fstop, net_name, frequencies, skip_checks)');
    }

    // Equivalent ngspice command:
    // ac oct 10 16 20k
    // meas ac x2 FIND vm(load) AT=196

    // run AC
    Internal.ngspice_command(`destroy all`);
    Internal.ngspice_command(`ac oct 10 ${aFStart} ${aFStop}`);
    Internal.ngspice_log();
    // measure single value
    var i;
    for (i = 0; i < aFrequencies.length; i++) {
        Internal.ngspice_command('meas ac x' + i + ' FIND vm(' + aNetName + ') AT=' + aFrequencies[i]);
    }
    // extract single value from log
    var lg = Internal.ngspice_log();
    var ret = [];
    for (i = 0; i < aFrequencies.length; i++) {
        var s = lg.pop();
        var value = parseFloat(s.split(' = ')[1]);
        ret.unshift(value);
    }
    return ret;
}

globalThis.ac_fast = ac_fast;
globalThis.exports = ac_fast;

