// Clear netlist
// linter: ngspicejs-lint --internal
"use strict";

/*jshint -W079 */
var netlist_devices = [];
/*jshint +W079 */

function netlist_clear() {
    // Clear netlist
    assert_arguments_length(arguments, 0, 0, 'netlist_clear()');
    netlist_devices.length = 0;
    // ngspice_command("destroy all");
    find_model_clear_cache();
    // clear various arrays using .length instead of = [] as to not loose reference
    DiodeModel.models.length = 0;
    SubModel.models.length = 0;
    BjtModel.models.length = 0;
    JfetModel.models.length = 0;
    VdmosModel.models.length = 0;
    Ammeter.ammeters.length = 0;
    Voltmeter.voltmeters.length = 0;
    Inductor.inductors.length = 0;
    Battery.batteries.length = 0;
    delete Internal.DynamicMic.model;
    delete Internal.ElectretMic.model;
    assert_net_case.nets = {};
    netlist_render.used_nets = {};
    // analyses
    assert_no_pending_analyses();
    Internal.Tran.tran.length = 0;
    Internal.Ac.ac.length = 0;
    Internal.Fft.fft.length = 0;
    Internal.BatterySensitivity.battery_sensitivity.length = 0;
    // spice counter
    Internal.Spice.counter = 0;
}

globalThis.exports = {netlist_devices, netlist_clear};
globalThis.netlist_devices = netlist_devices;
globalThis.netlist_clear = netlist_clear;
