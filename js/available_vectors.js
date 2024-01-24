// Return array of available vectors for tran/ac/fft
// linter: ngspicejs-lint --internal
"use strict";

function available_vectors(aUgly) {
    // Return array of available vectors for tran/ac/fft
    assert_arguments_length(arguments, 0, 1, 'available_vectors(ugly)');
    ngspice_command('destroy all');
    var a = Internal.netlist_done();
    ngspice_command('ac dec 1 10 20');
    var l = Internal.ngspice_log();
    ngspice_process_log(l, a.netlist);
    var vn = ngspice_vectors();
    ngspice_command('destroy all');
    vn.splice(vn.indexOf('frequency'), 1);
    if (aUgly) {
        return vn;
    }
    vn = vn.map((v) => human_vector_name(v));
    // dummy data for .process_data(data)
    var d = {};
    vn.forEach((k) => {d[k] = [0]; return;});
    // devices may perform further data processing
    netlist_devices.filter((a) => a.process_data).forEach((a) => a.process_data(d));
    return Object.keys(d).sort();
}

globalThis.available_vectors = available_vectors;
globalThis.exports = {available_vectors};


