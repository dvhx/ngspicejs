// Voltage Controlled Voltage Source (EXXX)
// linter: ngspicejs-lint --internal
"use strict";

function VCVS(aName, aOutAnode, aOutCathode, aInAnode, aInCathode, aGain) {
    // Constructor
    assert_arguments_length(arguments, 0, 6, 'vcvs(name,out_anode,out_cathode,in_anode,in_cathode,gain)');
    this.type = 'vcvs';
    this.expected_prefix = ['E'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true;
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
    if (aOutAnode !== undefined) {
        this.out_anode(aOutAnode);
    }
    if (aOutCathode !== undefined) {
        this.out_cathode(aOutCathode);
    }
    if (aInAnode !== undefined) {
        this.in_anode(aInAnode);
    }
    if (aInCathode !== undefined) {
        this.in_cathode(aInCathode);
    }
    if (aGain !== undefined) {
        this.gain(aGain);
    }
}

function vcvs(aName, aOutAnode, aOutCathode, aInAnode, aInCathode, aGain) {
    // Add vcvs to netlist
    assert_arguments_length(arguments, 0, 6, 'vcvs(name,out_anode,out_cathode,in_anode,in_cathode,gain)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new VCVS(aName);
    }
    return new VCVS(aName, aOutAnode, aOutCathode, aInAnode, aInCathode, aGain);
}

VCVS.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'vcvs.name(name,allow_this_prefix)');
    assert_name(aName, 'vcvs');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

VCVS.prototype.in_anode = function (aNet) {
    // Set input anode net name
    assert_arguments_length(arguments, 1, 1, 'vcvs.in_anode(net)');
    assert_net(aNet, 'net', 'vcvs.in_anode(net)');
    this.attr.in_anode = aNet;
    return this;
};

VCVS.prototype.in_cathode = function (aNet) {
    // Set input cathode net name
    assert_arguments_length(arguments, 1, 1, 'vcvs.in_cathode(net)');
    assert_net(aNet, 'net', 'vcvs.in_cathode(net)');
    this.attr.in_cathode = aNet;
    return this;
};

VCVS.prototype.out_anode = function (aNet) {
    // Set output anode net name
    assert_arguments_length(arguments, 1, 1, 'vcvs.out_anode(net)');
    assert_net(aNet, 'net', 'vcvs.out_anode(net)');
    this.attr.out_anode = aNet;
    return this;
};

VCVS.prototype.out_cathode = function (aNet) {
    // Set output cathode net name
    assert_arguments_length(arguments, 1, 1, 'vcvs.out_cathode(net)');
    assert_net(aNet, 'net', 'vcvs.out_cathode(net)');
    this.attr.out_cathode = aNet;
    return this;
};

VCVS.prototype.gain = function (aValue) {
    // Set gain
    assert_arguments_length(arguments, 1, 1, 'vcvs.gain(value)');
    this.attr.gain = eng(aValue, 1, 'vcvs.gain(value)');
    return this;
};

VCVS.prototype.poly = function (aVoltageSourceNames, aCoef) {
    // Set poly
    assert_arguments_length(arguments, 1, 2, 'vcvs.poly(vnames,coef)');
    if (arguments.length === 1 && typeof aVoltageSourceNames === 'object' && aVoltageSourceNames.type === 'poly') {
        assert_poly(aVoltageSourceNames);
        this.attr.poly = aVoltageSourceNames;
        return this;
    }
    assert_arguments_length(arguments, 2, 2, 'vcvs.poly(vnames,coef)');
    assert_array_of_strings_or_numbers(aVoltageSourceNames, 'vnames', 'vcvs.poly(vnames,coef)');
    assert_array_of_numbers(aCoef, 'coef', 'vcvs.poly(vnames,coef)', true);
    this.attr.poly = this.attr.poly || {};
    this.attr.poly.type = 'poly';
    this.attr.poly.dimension = aVoltageSourceNames.length / 2;
    this.attr.poly.names = aVoltageSourceNames;
    this.attr.poly.coef = aCoef;
    this.attr.poly.code = 'POLY(' + this.attr.poly.dimension + ') ' + aVoltageSourceNames.join(' ') + ' ' + aCoef.join(' ');
    return this;
};

VCVS.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'vcvs.validate()');
    if (this.attr.poly) {
        device_attr_check(this, this.attr, {
            name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
            out_anode: {type: "net", required: true},
            out_cathode: {type: "net", required: true},
            poly: {type: "poly"}
        });
    } else {
        device_attr_check(this, this.attr, {
            name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
            in_anode: {type: "net", required: true},
            in_cathode: {type: "net", required: true},
            out_anode: {type: "net", required: true},
            out_cathode: {type: "net", required: true},
            gain: {type: "number", min: -Infinity, max: Infinity, required: true, eng: true, equation: true}
        });
    }
    device_attr_assign(this, this.attr);
};

VCVS.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'vcvs.get_nets()');
    if (this.attr.poly) {
        var o = {
            out_anode: this.attr.out_anode,
            out_cathode: this.attr.out_cathode
        };
        Object.keys(this.attr.poly.names).forEach((a, i) => o['poly_net_' + i] = this.attr.poly.names[a]);
        return o;
    }
    return {
        out_anode: this.attr.out_anode,
        out_cathode: this.attr.out_cathode,
        in_anode: this.attr.in_anode,
        in_cathode: this.attr.in_cathode
    };
};

VCVS.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'vcvs.get_value()');
    this.validate();
    return this.attr.poly ? 'POLY' : 'nets ' + Object.values(this.get_nets()).join(' ') + (this.attr.gain ? ' gain ' + this.attr.gain : '');
};

VCVS.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'vcvs.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

VCVS.prototype.render = function () {
    // Render spice netlist for this vcvs
    assert_arguments_length(arguments, 0, 0, 'vcvs.render()');
    var spice = [];
    spice.push("* vcvs " + this.attr.name);
    if (this.attr.poly) {
        spice.push("E_" + this.attr.name + ' ' + this.attr.out_anode + ' ' + this.attr.out_cathode + ' ' + this.attr.poly.code);
    } else {
        var g = this.attr.gain;
        spice.push("E_" + this.attr.name + ' ' + this.attr.out_anode + ' ' + this.attr.out_cathode + ' ' + this.attr.in_anode + ' ' + this.attr.in_cathode + ' ' + g);
    }
    return spice.join('\n');
};

globalThis.exports = {VCVS,vcvs};
Internal.VCVS = VCVS;
globalThis.vcvs = vcvs;
Internal.device_constructor.vcvs = vcvs;
