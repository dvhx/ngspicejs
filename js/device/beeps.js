// Beeping voltage source (base frequency multiplied by square wave)
// linter: ngspicejs-lint --internal
"use strict";

function Beeps(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aPulseWidth, aPeriod, aDcValue, aAcMag, aAcPhase) {
    // Constructor
    assert_arguments_length(arguments, 0, 12, 'beeps(name,anode,cathode,offset,v,f,delay,pulse_width,period,dc_value,ac_mag,ac_phase)');
    this.type = 'beeps';
    this.expected_prefix = ['V', 'U'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true;
    this.attr = {offset: 0, pulse_width: 0.005, period: 0.010, delay: 0, dc_value: 1, ac_mag: 1, ac_phase: 0};
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
    if (aPulseWidth !== undefined) {
        this.pulse_width(aPulseWidth);
    }
    if (aPeriod !== undefined) {
        this.period(aPeriod);
    }
    if (aDelay !== undefined) {
        this.phase(aDelay);
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

function beeps(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aPulseWidth, aPeriod, aDcValue, aAcMag, aAcPhase) {
    // Add sinewave voltage source that is on/off for given time
    assert_arguments_length(arguments, 0, 12, 'beeps(name,anode,cathode,offset,v,f,delay,pulse_width,period,dc_value,ac_mag,ac_phase)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Beeps(aName);
    }
    var d = new Beeps(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aPulseWidth, aPeriod, aDcValue, aAcMag, aAcPhase);
    warn_source_arguments_length(arguments, d);
    return d;
}

Beeps.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'beeps.name(name,allow_this_prefix)');
    assert_name(aName, 'beeps');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Beeps.prototype.anode = function (aAnode) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'beeps.anode(net)');
    assert_net(aAnode, 'net', 'beeps.anode(net)');
    this.attr.anode = aAnode;
    return this;
};

Beeps.prototype.cathode = function (aCathode) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'beeps.cathode(net)');
    assert_net(aCathode, 'net', 'beeps.cathode(net)');
    this.attr.cathode = aCathode;
    return this;
};

Beeps.prototype.offset = function (aValue) {
    // Set offset
    assert_arguments_length(arguments, 1, 1, 'beeps.offset(voltage)');
    this.attr.offset = eng(aValue, 1, 'beeps.offset(voltage)');
    return this;
};

Beeps.prototype.v = function (aValue) {
    // Set amplitude
    assert_arguments_length(arguments, 1, 1, 'beeps.v(voltage)');
    this.attr.v = eng(aValue, 1, 'beeps.v(voltage)');
    return this;
};

Beeps.prototype.f = function (aValue) {
    // Set frequency
    assert_arguments_length(arguments, 1, 1, 'beeps.f(frequency)');
    this.attr.f = eng(aValue, 1, 'beeps.f(frequency)');
    return this;
};

Beeps.prototype.pulse_width = function (aSeconds) {
    // Set pulse width in seconds
    assert_arguments_length(arguments, 1, 1, 'beeps.pulse_width(seconds)');
    this.attr.pulse_width = eng(aSeconds, 1, 'beeps.pulse_width(seconds)');
    return this;
};

Beeps.prototype.period = function (aSeconds) {
    // Set beeping period in seconds
    assert_arguments_length(arguments, 1, 1, 'beeps.period(seconds)');
    this.attr.period = eng(aSeconds, 1, 'beeps.period(seconds)');
    return this;
};

Beeps.prototype.delay = function (aSeconds) {
    // Set delay
    assert_arguments_length(arguments, 1, 1, 'beeps.delay(seconds)');
    this.attr.delay = eng(aSeconds, 1, 'beeps.delay(seconds)');
    return this;
};

Beeps.prototype.dc_value = function (aValue) {
    // Set simulation DC value
    assert_arguments_length(arguments, 1, 1, 'beeps.dc_value(volrage)');
    this.attr.dc_value = eng(aValue, 1, 'beeps.dc_value(voltage)');
    return this;
};

Beeps.prototype.ac_mag = function (aValue) {
    // Set simulation AC magnitude
    assert_arguments_length(arguments, 1, 1, 'beeps.ac_mag(value)');
    this.attr.ac_mag = eng(aValue, 1, 'beeps.ac_mag(value)');
    return this;
};

Beeps.prototype.ac_phase = function (aDegrees) {
    // Set simulation AC phase
    assert_arguments_length(arguments, 1, 1, 'beeps.ac_phase(degrees)');
    this.attr.ac_phase = eng(aDegrees, 1, 'beeps.ac_phase(degrees)');
    return this;
};

Beeps.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'beeps.validate()');
    var ver = ngspice_version();
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        offset: {type: "number", min: -1e9, max: 1e9, eng: true, equation: true},
        v: {type: "number", min: 0, max: 1e9, eng: true, equation: true, required: true},
        f: {type: "number", min: 0.1, max: 1e12, eng: true, equation: true, required: true},
        pulse_width: {type: "number", min: 1e-15, max: 2000, eng: true, equation: true},
        period: {type: "number", min: 1e-15, max: 2000, eng: true, equation: true},
        delay: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        // equations in ngspice-40 only!
        dc_value: {type: "number", min: 0, max: 1e9, eng: true, equation: ver >= 40},
        ac_mag: {type: "number", min: 0, max: 1e9, eng: true, equation: ver >= 40},
        ac_phase: {type: "number", min: -360, max: 360, eng: true, equation: ver >= 40},
    });
    if (typeof this.attr.pulse_width === 'number' && typeof this.attr.period === 'number') {
        if (this.attr.pulse_width > this.attr.period) {
            throw new Exception('Pulse width ' + this.attr.pulse_width + ' is larger then period ' + this.attr.period);
        }
    }
    device_attr_assign(this, this.attr);
};

Beeps.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'beeps.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Beeps.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'beeps.get_value(value)');
    this.validate();
    return this.attr.v + 'V ' + this.attr.f.toEng() + 'Hz';
};

Beeps.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'beeps.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Beeps.prototype.process_data = function (aData) {
    // In data make current "I(U1.B1)" accessible also as "I(U1)"
    assert_arguments_length(arguments, 1, 1, 'beeps.process_data(data)');
    assert_object(aData, 'data', 'beeps.process_data(data)');
    var bn = 'I(' + this.attr.name + '.B1)';
    if (Object.hasOwn(aData, bn)) {
        aData['I(' + this.attr.name + ')'] = aData[bn];
    }
};

Beeps.prototype.render = function () {
    // Render spice netlist
    assert_arguments_length(arguments, 0, 0, 'beeps.render()');
    // SIN (VO VA FREQ TD THETA PHASE )
    var spice = [];
    //var eq = render_equations(this, ['f', 'v', 'offset', 'period', 'pulse_width', 'delay', 'dc_value', 'ac_mag', 'ac_phase']);
    var r = '1p';
    spice.push("* beeps " + this.attr.name + ' ' + JSON.stringify(this.attr));
    spice.push('.subckt sub_beeps_' + this.attr.name + ' POS NEG');
    // PULSE (V1 V2 TD TR TF PW PER PHASE)
    spice.push('V_V1 A NEG DC 0 AC 0 0 PULSE(0 1 ' + this.attr.delay + ' ' + r + ' ' + r + ' ' + this.attr.pulse_width + ' ' + this.attr.period + ' 0)');
    // SIN (VO VA FR TD THETA PHASE)
    spice.push('V_V2 B NEG DC ' + this.attr.dc_value + ' AC ' + this.attr.ac_mag + ' ' + this.attr.ac_phase + ' SIN(0 ' + this.attr.v + ' ' + this.attr.f + ' 0 0 0)');
    spice.push('B_B1 POS NEG V = V(A,NEG) * V(B,NEG) + ' + this.attr.offset);
    spice.push('.ends sub_beeps_' + this.attr.name);
    spice.push('x_' + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' sub_beeps_' + this.attr.name);
    return spice.join('\n');
};

globalThis.exports = {Beeps,beeps};
Internal.Beeps = Beeps;
globalThis.beeps = beeps;
Internal.device_constructor.beeps = beeps;
