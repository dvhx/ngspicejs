// Electret microphone
// linter: ngspicejs-lint --internal
"use strict";

function ElectretMic(aName, aAnode, aCathode, aV, aF, aDamping, aPhase) {
    // Constructor
    assert_arguments_length(arguments, 0, 7, 'electret_mic(name,anode,cathode,v,f,damping,phase)');
    this.type = 'electret_mic';
    this.expected_prefix = ['V', 'U', 'MIC'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true;
    this.attr = {damping: 0, phase: -90};
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
    if (aAnode !== undefined) {
        this.anode(aAnode);
    }
    if (aCathode !== undefined) {
        this.cathode(aCathode);
    }
    if (aV !== undefined) {
        this.v(aV);
    }
    if (aF !== undefined) {
        this.f(aF);
    }
    if (aDamping !== undefined) {
        this.damping(aDamping);
    }
    if (aPhase !== undefined) {
        this.phase(aPhase);
    }
}

function electret_mic(aName, aAnode, aCathode, aV, aF, aDamping, aPhase) {
    // Add electret mic to netlist
    assert_arguments_length(arguments, 0, 7, 'electret_mic(name,anode,cathode,v,f,damping,phase)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new ElectretMic(aName);
    }
    return new ElectretMic(aName, aAnode, aCathode, aV, aF, aDamping, aPhase);
}

ElectretMic.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'electret_mic.name(name,allow_this_prefix)');
    assert_name(aName, 'electret_mic');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

ElectretMic.prototype.anode = function (aNet) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'electret_mic.anode(net)');
    assert_net(aNet, 'net', 'electret_mic.anode(net)');
    this.attr.anode = aNet;
    return this;
};

ElectretMic.prototype.cathode = function (aNet) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'electret_mic.cathode(net)');
    assert_net(aNet, 'net', 'electret_mic.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

ElectretMic.prototype.v = function (aValue) {
    // Set voltage amplitude
    assert_arguments_length(arguments, 1, 1, 'electret_mic.v(voltage)');
    this.attr.v = eng(aValue, 1, 'electret_mic.v(value)');
    return this;
};

ElectretMic.prototype.f = function (aValue) {
    // Set frequency
    assert_arguments_length(arguments, 1, 1, 'electret_mic.f(frequency)');
    this.attr.f = eng(aValue, 1, 'electret_mic.f(value)');
    return this;
};

ElectretMic.prototype.damping = function (aValue) {
    // Set amplitude damping factor
    assert_arguments_length(arguments, 1, 1, 'electret_mic.damping(value)');
    this.attr.damping = eng(aValue, 1, 'electret_mic.damping(value)');
    return this;
};

ElectretMic.prototype.halve = function (aSecondsToHalfVolume) {
    // Set time after which will amplitude drops to half
    assert_arguments_length(arguments, 1, 1, 'electret_mic.halve(seconds_to_half_volume)');
    var d = eng(aSecondsToHalfVolume, 1, 'electret_mic.halve(seconds_to_half_volume)');
    this.attr.damping = -Math.log(0.5) / d;
    return this;
};

ElectretMic.prototype.phase = function (aDegrees) {
    // Set phase angle
    assert_arguments_length(arguments, 1, 1, 'electret_mic.phase(degrees)');
    this.attr.phase = eng(aDegrees, 1, 'electret_mic.phase(degrees)');
    return this;
};

ElectretMic.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'electret_mic.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        v: {type: "number", min: 0, max: 1e9, eng: true, equation: true, required: true},
        f: {type: "number", min: 0, max: 1e12, eng: true, equation: true, required: true},
        damping: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        phase: {type: "number", min: -360, max: 360, eng: true, equation: true, required: true},
    });
    device_attr_assign(this, this.attr);
};

ElectretMic.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'electret_mic.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

ElectretMic.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'electret_mic.get_value()');
    this.validate();
    return this.attr.v + 'V ' + this.attr.f.toEng() + 'Hz';
};

ElectretMic.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'electret_mic.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

ElectretMic.prototype.render = function () {
    // Render spice netlist for this electret mic
    assert_arguments_length(arguments, 0, 0, 'electret_mic.render()');
    if (!ElectretMic.model) {
        ElectretMic.model = sub_model('ELECTRET_MIC', ['anode', 'cathode'], {v: 0.1, f: 196, damping: 0, phase: -90});
        ElectretMic.model.sinewave('V1', 'gate', 'cathode').v('{v}').f('{f}').damping('{damping}').phase('{phase}');
        ElectretMic.model.jfet_n('T1', 'anode', 'gate', 'cathode').model('J201');
        ElectretMic.model.end();
    }
    var spice = [];
    spice.push('* ' + device_summary(this));
    spice.push('x_ELECTRET_MIC__' + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' ELECTRET_MIC PARAMS: v=' + this.attr.v + ' f=' + this.attr.f + ' damping=' + (this.attr.damping || 0) + ' phase=' + this.attr.phase);
    return spice.join('\n');
};

globalThis.exports = {ElectretMic,electret_mic};
Internal.ElectretMic = ElectretMic;
globalThis.electret_mic = electret_mic;
Internal.device_constructor.electret_mic = electret_mic;
