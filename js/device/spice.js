// Piece of arbitrary spice code (as a device in netlist)
// linter: ngspicejs-lint --internal
"use strict";

function Spice(aCode) {
    // Constructor
    assert_arguments_length(arguments, 0, 1, 'spice(code)');
    this.type = 'spice';
    this.expected_prefix = [];
    netlist_devices.push(this);
    this.is_net_device = false;
    this.is_voltage_source = false;
    Spice.counter = Spice.counter || 0;
    this.attr = {name: 'SPICE_' + Spice.counter, code: aCode};
    Spice.counter++;
    // single attr value, e.g. device({name: 'U1', anode: 1, cathode: 0, ...});
    if (arguments.length === 1 && typeof aCode === 'object') {
        object_merge(this.attr, aCode);
        this.validate();
        return;
    }
    // individual arguments
    if (aCode !== undefined) {
        this.code(aCode);
    }
}

function spice(aCode) {
    // Add spice code to netlist
    assert_arguments_length(arguments, 0, 1, 'spice(code)');
    return new Spice(aCode);
}

Spice.prototype.code = function (aCode) {
    // Set spice code
    assert_arguments_length(arguments, 1, 1, 'spice.code(code)');
    this.attr.code = aCode;
    return this;
};

Spice.prototype.validate = function () {
    // Validate parameters
    assert_arguments_length(arguments, 0, 0, 'spice.validate()');
};

Spice.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'spice.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Spice.prototype.render = function () {
    // Render spice code
    assert_arguments_length(arguments, 0, 0, 'spice.render()');
    return this.attr.code;
};

globalThis.exports = {Spice,spice};
Internal.Spice = Spice;
globalThis.spice = spice;
Internal.device_constructor.spice = spice;
