// Sine wave voltage source
// linter: ngspicejs-lint --internal
"use strict";

function Sinewave(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aDamping, aPhaseDeg, aDcValue, aAcMag, aAcPhase) {
    // Constructor
    assert_arguments_length(arguments, 0, 12, 'sinewave(name,anode,cathode,offset,v,f,delay,damping,phase,dc_value,ac_mag,ac_phase)');
    this.type = 'sinewave';
    this.expected_prefix = ['U', 'V'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true;
    this.attr = {delay: 0, offset: 0, damping: 0, phase: 0, dc_value: 0, ac_mag: 1, ac_phase: 0};
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
    if (aOffset !== undefined) {
        this.offset(aOffset);
    }
    if (aV !== undefined) {
        this.v(aV);
    }
    if (aF !== undefined) {
        this.f(aF);
    }
    if (aDelay !== undefined) {
        this.phase(aDelay);
    }
    if (aDamping !== undefined) {
        this.damping(aDamping);
    }
    if (aPhaseDeg !== undefined) {
        this.phase(aPhaseDeg);
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

function sinewave(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aDamping, aPhaseDeg, aDcValue, aAcMag, aAcPhase) {
    // Add sinewave voltage source to netlist
    assert_arguments_length(arguments, 0, 12, 'sinewave(name,anode,cathode,offset,v,f,delay,damping,phase,dc_value,ac_mag,ac_phase)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Sinewave(aName);
    }
    var d = new Sinewave(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aDamping, aPhaseDeg, aDcValue, aAcMag, aAcPhase);
    warn_source_arguments_length(arguments, d);
    return d;
}

Sinewave.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 1, 'sinewave.name(name,allow_this_prefix)');
    assert_name(aName, 'sinewave');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Sinewave.prototype.anode = function (aAnode) {
    // Set anode net
    assert_arguments_length(arguments, 1, 1, 'sinewave.anode(net)');
    assert_net(aAnode, 'net', 'sinewave.anode(net)');
    this.attr.anode = aAnode;
    return this;
};

Sinewave.prototype.cathode = function (aCathode) {
    // Set cathode net
    assert_arguments_length(arguments, 1, 1, 'sinewave.cathode(net)');
    assert_net(aCathode, 'net', 'sinewave.cathode(net)');
    this.attr.cathode = aCathode;
    return this;
};

Sinewave.prototype.offset = function (aValue) {
    // Set offset voltage
    assert_arguments_length(arguments, 1, 1, 'sinewave.offset(value)');
    this.attr.offset = eng(aValue, 1, 'sinewave.offset(value)');
    return this;
};

Sinewave.prototype.v = function (aValue) {
    // Set amplitude
    assert_arguments_length(arguments, 1, 1, 'sinewave.v(value)');
    this.attr.v = eng(aValue, 1, 'sinewave.v(value)');
    return this;
};

Sinewave.prototype.f = function (aValue) {
    // Set frequency
    assert_arguments_length(arguments, 1, 1, 'sinewave.f(value)');
    this.attr.f = eng(aValue, 1, 'sinewave.f(value)');
    return this;
};

Sinewave.prototype.delay = function (aValue) {
    // Set delay
    assert_arguments_length(arguments, 1, 1, 'sinewave.delay(value)');
    this.attr.delay = eng(aValue, 1, 'sinewave.delay(value)');
    return this;
};

Sinewave.prototype.damping = function (aValue) {
    // Set amplitude damping factor (theta)
    assert_arguments_length(arguments, 1, 1, 'sinewave.damping(value)');
    this.attr.damping = eng(aValue, 1, 'sinewave.damping(value)');
    return this;
};

Sinewave.prototype.halve = function (aSecondsToHalfVolume) {
    // Set time after which will amplitude drops to half
    assert_arguments_length(arguments, 1, 1, 'sinewave.halve(seconds_to_half_volume)');
    var d = eng(aSecondsToHalfVolume, 1, 'sinewave.halve(seconds_to_half_volume)');
    this.attr.damping = -Math.log(0.5) / d;
    return this;
};

Sinewave.prototype.phase = function (aDegrees) {
    // Set phase angle
    assert_arguments_length(arguments, 1, 1, 'sinewave.phase(degrees)');
    this.attr.phase = eng(aDegrees, 1, 'sinewave.phase(degrees)');
    return this;
};

Sinewave.prototype.dc_value = function (aValue) {
    // Set simulation's DC value
    assert_arguments_length(arguments, 1, 1, 'sinewave.dc_value(value)');
    this.attr.dc_value = eng(aValue, 1, 'sinewave.dc_value(value)');
    return this;
};

Sinewave.prototype.ac_mag = function (aValue) {
    // Set simulations's AC magnitude
    assert_arguments_length(arguments, 1, 1, 'sinewave.ac_mag(value)');
    this.attr.ac_mag = eng(aValue, 1, 'sinewave.ac_mag(value)');
    return this;
};

Sinewave.prototype.ac_phase = function (aValue) {
    // Set simulations's AC phase angle
    assert_arguments_length(arguments, 1, 1, 'sinewave.ac_phase(value)');
    this.attr.ac_phase = eng(aValue, 1, 'sinewave.ac_phase(value)');
    return this;
};

Sinewave.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'sinewave.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        offset: {type: "number", min: -1e9, max: 1e9, eng: true, equation: true},
        v: {type: "number", min: 0, max: 1e9, required: true, eng: true, equation: true},
        f: {type: "number", min: 0, max: 1e12, required: true, eng: true, equation: true},
        delay: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        damping: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        phase: {type: "number", min: -360, max: 360, eng: true, equation: true},
        dc_value: {type: "number", min: 0, max: 1e6, eng: true, equation: true},
        ac_mag: {type: "number", min: 0, max: 1e6, eng: true, equation: true},
        ac_phase: {type: "number", min: -360, max: 360, eng: true, equation: true},
    });
    device_attr_assign(this, this.attr);
};

Sinewave.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'sinewave.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Sinewave.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'sinewave.get_value()');
    this.validate();
    return this.attr.v.toEng() + 'V ' + this.attr.f.toEng() + 'Hz';
};

Sinewave.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'sinewave.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Sinewave.prototype.render = function () {
    // Render spice netlist
    assert_arguments_length(arguments, 0, 0, 'sinewave.render()');
    // SIN (VO VA FREQ TD THETA PHASE )
    var spice = [];
    spice.push("* sinewave " + this.attr.name + '                 O A F Del Damp Ph');
    spice.push(
        "V_" + this.attr.name + " " + this.attr.anode + " " + this.attr.cathode +
        " DC " + this.attr.dc_value +
        " AC " + this.attr.ac_mag + " " + this.attr.ac_phase + " " +
        " SIN (" +
        (this.attr.offset || 0) + " " +
        this.attr.v + " " +
        this.attr.f + " " +
        (this.attr.delay || 0) + " " +
        (this.attr.damping || 0) + " " +
        (this.attr.phase || 0) + ")"
    );
    return spice.join('\n');
};

globalThis.sinewave = sinewave;
Internal.Sinewave = Sinewave;
globalThis.exports = {Sinewave,sinewave};
Internal.device_constructor.sinewave = sinewave;
