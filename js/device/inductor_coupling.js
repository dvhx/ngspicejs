// InductorCoupling device
// linter: ngspicejs-lint --internal
"use strict";

function InductorCoupling(aName, aL1, aL2, aRatio) {
    // Constructor
    assert_arguments_length(arguments, 0, 4, 'inductor_coupling(name,l1,l2,ratio)');
    this.type = 'inductor_coupling';
    this.expected_prefix = ['K'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = false;
    this.is_voltage_source = false;
    this.attr = {};
    // all attr as object in first argument
    if (arguments.length === 1 && typeof aName === 'object') {
        object_merge(this.attr, aName);
        this.validate();
        return;
    }
    // individual arguments
    if (aName !== undefined) {
        this.name(aName);
    }
    if (aL1 !== undefined) {
        this.l1(aL1);
    }
    if (aL2 !== undefined) {
        this.l2(aL2);
    }
    if (aRatio !== undefined) {
        this.ratio(aRatio);
    }
}

function inductor_coupling(aName, aL1, aL2, aRatio) {
    // Add inductor_coupling to netlist
    assert_arguments_length(arguments, 0, 4, 'inductor_coupling(name,l1,l2,ratio)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new InductorCoupling(aName);
    }
    return new InductorCoupling(aName, aL1, aL2, aRatio);
}

InductorCoupling.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'inductor_coupling.name(name,allow_this_prefix)');
    assert_name(aName, 'inductor_coupling');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

InductorCoupling.prototype.l1 = function (aName) {
    // Set name of first inductor
    assert_arguments_length(arguments, 1, 1, 'inductor_coupling.l1(name)');
    assert_name(aName.replace(/\./g, '_'), 'inductor_coupling');
    this.attr.l1 = aName;
    return this;
};

InductorCoupling.prototype.l2 = function (aName) {
    // Set name of second inductor
    assert_arguments_length(arguments, 1, 1, 'inductor_coupling.l2(name)');
    assert_name(aName.replace(/\./g, '_'), 'inductor_coupling');
    this.attr.l2 = aName;
    return this;
};

InductorCoupling.prototype.ratio = function (aValue) {
    // Set coupling ratio
    assert_arguments_length(arguments, 1, 1, 'inductor_coupling.ratio(value)');
    this.attr.ratio = eng(aValue, 1, 'inductor_coupling.ratio(value)');
    return this;
};

InductorCoupling.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'inductor_coupling.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        l1: {type: "string", required: true, min: 1, max: 100, alphanumericdot: true, startalpha: true, allow_two_underscores: true},
        l2: {type: "string", required: true, min: 1, max: 100, alphanumericdot: true, startalpha: true, allow_two_underscores: true},
        ratio: {type: "number", required: true, min: 0, max: 1, eng: true, equation: true}
    });
    device_attr_assign(this, this.attr);
};

InductorCoupling.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'inductor_coupling.get_value()');
    this.validate();
    return this.attr.l1 + ' ' + this.attr.l2 + ' ' + this.attr.ratio;
};

InductorCoupling.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'inductor_coupling.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

InductorCoupling.prototype.render = function () {
    // Render spice netlist for this inductor_coupling
    assert_arguments_length(arguments, 0, 0, 'inductor_coupling.render()');
    var spice = ["* inductor_coupling " + this.attr.name];
    var l1u = this.attr.l1;
    var l2u = this.attr.l2;
    // find inductor (via devices with .coupling_name set
    var l1 = netlist_devices.find((d) => d.attr.name === this.attr.l1);
    if (l1 && l1.coupling_name) {
        l1u = l1.coupling_name;
    }
    var l2 = netlist_devices.find((d) => d.attr.name === this.attr.l2);
    if (l2 && l2.coupling_name) {
        l2u = l2.coupling_name;
    }
    spice.push('K_' + this.attr.name + ' ' + l1u + ' ' + l2u + ' ' + this.attr.ratio);
    return spice.join('\n');
};

globalThis.exports = {InductorCoupling, inductor_coupling};
Internal.InductorCoupling = InductorCoupling;
globalThis.inductor_coupling = inductor_coupling;
Internal.device_constructor.inductor_coupling = inductor_coupling;
