// Single pulse voltage supply
// linter: ngspicejs-lint --internal
"use strict";

function Pulse(aName, aAnode, aCathode, aOffset, aV, aPulseWidth, aDelay, aRaise, aFall, aDcValue, aAcMag, aAcPhase) {
    // Constructor
    assert_arguments_length(arguments, 0, 12, 'pulse(name,anode,cathode,offset,v,pulse_width,delay,raise,fall,dc_value,ac_mag,ac_phase)');
    this.type = 'pulse';
    this.expected_prefix = ['U', 'V'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true;
    this.attr = {v: 1, pulse_width: 0.01, offset: 0, delay: 0, dc_value: 0, ac_mag: 1, ac_phase: 0};
    // single attr value, e.g. device({name: 'U1', anode: 1, cathode: 0, ...});
    if (arguments.length === 1 && typeof aName === 'object') {
        object_merge(this.attr, aName);
        this.validate();
        return;
    }
    // individual arguments
    if (aName !== undefined && typeof aName === 'string') {
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
    if (aOffset !== undefined) {
        this.offset(aOffset);
    }
    if (aDelay !== undefined) {
        this.delay(aDelay);
    }
    if (aPulseWidth !== undefined) {
        this.pulse_width(aPulseWidth);
    }
    if (aRaise !== undefined) {
        this.raise(aRaise);
    }
    if (aFall !== undefined) {
        this.fall(aFall);
    }
    if (aDcValue !== undefined) {
        this.dc_value(aDcValue);
    }
    if (aAcMag !== undefined) {
        this.ac_mag(aAcMag);
    }
    if (aAcPhase !== undefined) {
        this.ac_phase(aAcPhase);
    }
}

function pulse(aName, aAnode, aCathode, aOffset, aV, aPulseWidth, aDelay, aRaise, aFall, aDcValue, aAcMag, aAcPhase) {
    // Add pulse voltage source to netlist
    assert_arguments_length(arguments, 0, 12, 'pulse(name,anode,cathode,offset,v,pulse_width,delay,raise,fall,dc_value,ac_mag,ac_phase)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Pulse(aName);
    }
    var d = new Pulse(aName, aAnode, aCathode, aOffset, aV, aPulseWidth, aDelay, aRaise, aFall, aDcValue, aAcMag, aAcPhase);
    warn_source_arguments_length(arguments, d);
    return d;
}

Pulse.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'pulse.name(name,allow_this_prefix)');
    assert_name(aName, 'pulse');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Pulse.prototype.anode = function (aAnode) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'pulse.anode(net)');
    assert_net(aAnode, 'net', 'pulse.anode(net)');
    this.attr.anode = aAnode;
    return this;
};

Pulse.prototype.cathode = function (aCathode) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'pulse.cathode(net)');
    assert_net(aCathode, 'net', 'pulse.cathode(net)');
    this.attr.cathode = aCathode;
    return this;
};

Pulse.prototype.v = function (aValue) {
    // Set amplitude
    assert_arguments_length(arguments, 1, 1, 'pulse.v(voltage)');
    this.attr.v = eng(aValue, 1, 'pulse.v(voltage)');
    return this;
};

Pulse.prototype.offset = function (aValue) {
    // Set voltage offset
    assert_arguments_length(arguments, 1, 1, 'pulse.offset(voltage)');
    this.attr.offset = eng(aValue, 1, 'pulse.offset(voltage)');
    return this;
};

Pulse.prototype.delay = function (aValue) {
    // Set delay
    assert_arguments_length(arguments, 1, 1, 'pulse.delay(value)');
    this.attr.delay = eng(aValue, 1, 'pulse.delay(value)');
    return this;
};

Pulse.prototype.raise = function (aValue) {
    // Set raise time
    assert_arguments_length(arguments, 1, 1, 'pulse.raise(value)');
    this.attr.raise = eng(aValue, 1, 'pulse.raise(value)');
    return this;
};

Pulse.prototype.fall = function (aValue) {
    // Set fall time
    assert_arguments_length(arguments, 1, 1, 'pulse.fall(value)');
    this.attr.fall = eng(aValue, 1, 'pulse.fall(value)');
    return this;
};

Pulse.prototype.pulse_width = function (aValue) {
    // Set pulse width
    assert_arguments_length(arguments, 1, 1, 'pulse.pulse_width(value)');
    this.attr.pulse_width = eng(aValue, 1, 'pulse.pulse_width(value)');
    return this;
};

Pulse.prototype.dc_value = function (aValue) {
    // Set simulation's DC value
    assert_arguments_length(arguments, 1, 1, 'pulse.dc_value(value)');
    this.attr.dc_value = eng(aValue, 1, 'pulse.dc_value(value)');
    return this;
};

Pulse.prototype.ac_mag = function (aValue) {
    // Set simulations's AC magnitude
    assert_arguments_length(arguments, 1, 1, 'pulse.ac_mag(value)');
    this.attr.ac_mag = eng(aValue, 1, 'pulse.ac_mag(value)');
    return this;
};

Pulse.prototype.ac_phase = function (aValue) {
    // Set simulations's AC phase angle
    assert_arguments_length(arguments, 1, 1, 'pulse.ac_phase(value)');
    this.attr.ac_phase = eng(aValue, 1, 'pulse.ac_phase(value)');
    return this;
};

Pulse.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'pulse.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        v: {type: "number", min: -1e6, max: 1e6, eng: true, equation: true},
        offset: {type: "number", min: -1e6, max: 1e6, eng: true, equation: false},
        delay: {type: "number", min: -1000, max: 1000, eng: true, equation: true},
        raise: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        fall: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        pulse_width: {type: "number", min: 0, max: 2000, eng: true, equation: true},
        dc_value: {type: "number", min: 0, max: 1e6, eng: true, equation: true},
        ac_mag: {type: "number", min: 0, max: 1e6, eng: true, equation: true},
        ac_phase: {type: "number", min: -360, max: 360, eng: true, equation: true},
    });
    device_attr_assign(this, this.attr);
};

Pulse.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'pulse.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Pulse.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'pulse.get_value()');
    this.validate();
    return this.attr.v + 'V ' + this.attr.pulse_width + 's';
};

Pulse.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'pulse.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Pulse.prototype.render = function () {
    assert_arguments_length(arguments, 0, 0, 'pulse.render()');
    // Render spice netlist for this pickup
    // ngspice-36 PULSE ( V1 V2 TD TR TF PW PER PHASE)
    // ngspice-40 PULSE ( V1 V2 TD TR TF PW PER NP)
    var spice = [];
    spice.push("* pulse " + this.attr.name + '                 V1 2 D R       F       W     P    C');
    var r = '1p';
    spice.push("V_" + this.attr.name + " " + this.attr.anode + " " + this.attr.cathode +
        " DC " + this.attr.dc_value +
        " AC " + this.attr.ac_mag + " " + this.attr.ac_phase + " " +
        " PULSE (" +
        (this.attr.offset) + " " +
        equation_combine(this.attr.offset,'+',this.attr.v) + " " +
        (this.attr.delay) + " " +
        (this.attr.raise || r) + " " +
        (this.attr.fall || r) + " " +
        (this.attr.pulse_width || 0) + ")");
    return spice.join('\n');
};

globalThis.exports = {Pulse,pulse};
Internal.Pulse = Pulse;
globalThis.pulse = pulse;
Internal.device_constructor.pulse = pulse;
