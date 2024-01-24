// Dynamic microphone
// linter: ngspicejs-lint --internal
"use strict";

function DynamicMic(aName, aAnode, aCathode, aV, aF, aDamping) {
    // Constructor
    assert_arguments_length(arguments, 0, 6, 'dynamic_mic(name,anode,cathode,v,f,damping)');
    this.type = 'dynamic_mic';
    this.expected_prefix = ['U', 'V', 'MIC'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true;
    // attributes definitions
    this.def = {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        v: {type: "number", min: 0, max: 1e9, undefined: false, eng: true, equation: true, required: true},
        f: {type: "number", min: 0, max: 1e12, undefined: false, eng: true, equation: true, required: true},
        damping: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
    };
    // attributes
    this.attr = {damping: 0};
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
}

function dynamic_mic(aName, aAnode, aCathode, aV, aF, aDamping) {
    // Add dynamic_mic to netlist
    assert_arguments_length(arguments, 0, 6, 'dynamic_mic(name,anode,cathode,v,f,damping)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new DynamicMic(aName);
    }
    return new DynamicMic(aName, aAnode, aCathode, aV, aF, aDamping);
}

DynamicMic.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'dynamic_mic.name(name,allow_this_prefix)');
    assert_name(aName, 'dynamic_mic');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

DynamicMic.prototype.anode = function (aNet) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'dynamic_mic.anode(net)');
    assert_net(aNet, 'net', 'dynamic_mic.anode(net)');
    this.attr.anode = aNet;
    return this;
};

DynamicMic.prototype.cathode = function (aNet) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'dynamic_mic.cathode(net)');
    assert_net(aNet, 'net', 'dynamic_mic.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

DynamicMic.prototype.v = function (aValue) {
    // Set voltage amplitude
    assert_arguments_length(arguments, 1, 1, 'dynamic_mic.v(voltage)');
    this.attr.v = eng(aValue, 1, 'dynamic_mic.v(value)');
    return this;
};

DynamicMic.prototype.f = function (aValue) {
    // Set frequency
    assert_arguments_length(arguments, 1, 1, 'dynamic_mic.f(frequency)');
    this.attr.f = eng(aValue, 1, 'dynamic_mic.f(frequency)');
    return this;
};

DynamicMic.prototype.damping = function (aValue) {
    // Set amplitude damping factor (theta)
    assert_arguments_length(arguments, 1, 1, 'dynamic_mic.damping(value)');
    this.attr.damping = eng(aValue, 1, 'dynamic_mic.damping(value)');
    return this;
};

DynamicMic.prototype.halve = function (aSecondsToHalfVolume) {
    // Set time after which will amplitude drops to half
    assert_arguments_length(arguments, 1, 1, 'dynamic_mic.halve(seconds_to_half_volume)');
    var d = eng(aSecondsToHalfVolume, 1, 'dynamic_mic.halve(seconds_to_half_volume)');
    this.attr.damping = -Math.log(0.5) / d;
    return this;
};

DynamicMic.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'dynamic_mic.validata()');
    device_attr_check(this, this.attr, this.def);
    device_attr_assign(this, this.attr);
};

DynamicMic.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'dynamic_mic.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

DynamicMic.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'dynamic_mic.get_value()');
    this.validate();
    return this.attr.v + 'V ' + this.attr.f.toEng() + 'Hz';
};

DynamicMic.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'dynamic_mic.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

DynamicMic.prototype.render = function () {
    // Render spice netlist for this dynamic_mic
    //request_model('MIC', 'ELECTRET_MIC');
    assert_arguments_length(arguments, 0, 0, 'dynamic_mic.render()');
    if (!DynamicMic.model) {
        DynamicMic.model = sub_model('DYNAMIC_MIC', ['anode', 'cathode'], {v: 0.2, f: 200, damping: 0});
        DynamicMic.model.sinewave('V1', 'anode', 1).v('{v}').f('{f}').damping('{damping}');
        DynamicMic.model.inductor('LS', 1, 2, '2m');
        DynamicMic.model.resistor('RS', 2, 3, 300);
        DynamicMic.model.inductor('LP', 3, 'cathode', '600m');
        DynamicMic.model.capacitor('CP', 3, 'cathode', '2u');
        DynamicMic.model.resistor('RP', 3, 'cathode', 650);
        DynamicMic.model.end();
    }
    var d = this.attr.damping || 0;
    var spice = [];
    spice.push('* ' + device_summary(this));
    spice.push(
        'x_DYNAMIC_MIC__' + this.attr.name + ' ' +
        this.attr.anode + ' ' +
        this.attr.cathode + ' ' +
        'DYNAMIC_MIC PARAMS: ' +
        (this.attr.v ? ' v=' + this.attr.v : '') +
        (this.attr.f ? ' f=' + this.attr.f : '') +
        (d ? ' damping=' + d : '')
    );
    return spice.join('\n');
};

globalThis.exports = {DynamicMic,dynamic_mic};
Internal.DynamicMic = DynamicMic;
globalThis.dynamic_mic = dynamic_mic;
Internal.device_constructor.dynamic_mic = dynamic_mic;
