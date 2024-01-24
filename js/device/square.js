// Square wave voltage source
// linter: ngspicejs-lint --internal
"use strict";

function Square(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aDuty, aRaise, aFall, aDcValue, aAcMag, aAcPhase) {
    // Constructor
    assert_arguments_length(arguments, 0, 13, 'square(name,anode,cathode,offset,v,f,delay,duty,raise,fall,dc_value,ac_mag,ac_phase)');
    this.type = 'square';
    this.expected_prefix = ['V', 'U'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true;
    this.attr = {offset: 0, duty: 50, dc_value: 0, ac_phase: 0};
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
    if (aF !== undefined) {
        this.f(aF);
    }
    if (aDelay !== undefined) {
        this.delay(aDelay);
    }
    if (aDuty !== undefined) {
        this.duty(aDuty);
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

function square(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aDuty, aRaise, aFall, aDcValue, aAcMag, aAcPhase) {
    // Add square wave periodic signal to netlist
    assert_arguments_length(arguments, 0, 13, 'square(name,anode,cathode,offset,v,f,delay,duty,raise,fall,dc_value,ac_mag,ac_phase)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Square(aName);
    }
    var d = new Square(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aDuty, aRaise, aFall, aDcValue, aAcMag, aAcPhase);
    warn_source_arguments_length(arguments, d);
    return d;
}

Square.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'square.name(name,allow_this_prefix)');
    assert_name(aName, 'square');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Square.prototype.anode = function (aAnode) {
    // Set anode net
    assert_arguments_length(arguments, 1, 1, 'square.anode(net)');
    assert_net(aAnode, 'net', 'square.anode(net)');
    this.attr.anode = aAnode;
    return this;
};

Square.prototype.cathode = function (aCathode) {
    // Set cathode net
    assert_arguments_length(arguments, 1, 1, 'square.cathode(net)');
    assert_net(aCathode, 'net', 'square.cathode(net)');
    this.attr.cathode = aCathode;
    return this;
};

Square.prototype.v = function (aValue) {
    // Set amplitude
    assert_arguments_length(arguments, 1, 1, 'square.v(value)');
    this.attr.v = eng(aValue, 1, 'square.v(value)');
    return this;
};

Square.prototype.offset = function (aValue) {
    // Set offset voltage
    assert_arguments_length(arguments, 1, 1, 'square.offset(value)');
    this.attr.offset = eng(aValue, 1, 'square.offset(value)');
    return this;
};

Square.prototype.f = function (aValue) {
    // Set frequency
    assert_arguments_length(arguments, 1, 1, 'square.f(value)');
    this.attr.f = eng(aValue, 1, 'square.f(value)');
    return this;
};

Square.prototype.delay = function (aValue) {
    // Set delay
    assert_arguments_length(arguments, 1, 1, 'square.delay(value)');
    this.attr.delay = eng(aValue, 1, 'square.delay(value)');
    return this;
};

Square.prototype.raise = function (aValue) {
    // Set raise time
    assert_arguments_length(arguments, 1, 1, 'square.raise(value)');
    this.attr.raise = eng(aValue, 1, 'square.raise(value)');
    return this;
};

Square.prototype.fall = function (aValue) {
    // Set fall time
    assert_arguments_length(arguments, 1, 1, 'square.fall(value)');
    this.attr.fall = eng(aValue, 1, 'square.fall(value)');
    return this;
};

Square.prototype.duty = function (aPercent) {
    // Set duty cycle in percents
    assert_arguments_length(arguments, 1, 1, 'square.duty(value)');
    this.attr.duty = eng(aPercent, 1, 'square.duty(percent)');
    return this;
};

Square.prototype.dc_value = function (aValue) {
    // Set simulation's DC value
    assert_arguments_length(arguments, 1, 1, 'square.dc_value(value)');
    this.attr.dc_value = eng(aValue, 1, 'square.dc_value(value)');
    return this;
};

Square.prototype.ac_mag = function (aValue) {
    // Set simulation's AC magnitude value
    assert_arguments_length(arguments, 1, 1, 'square.ac_mag(value)');
    this.attr.ac_mag = eng(aValue, 1, 'square.ac_mag(value)');
    return this;
};

Square.prototype.ac_phase = function (aValue) {
    // Set simulation's AC phase angle value
    assert_arguments_length(arguments, 1, 1, 'square.ac_phase(value)');
    this.attr.ac_phase = eng(aValue, 1, 'square.ac_phase(value)');
    return this;
};

Square.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'square.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        v: {type: "number", min: 0, max: 1e9, eng: true, equation: true, required: true},
        f: {type: "number", min: 0, max: 1e15, eng: true, equation: true, required: true},
        offset: {type: "number", min: -1e9, max: 1e9, eng: true, equation: true},
        delay: {type: "number", min: -1000, max: 1000, eng: true, equation: true},
        raise: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        fall: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        duty: {type: "number", min: 0, max: 100, eng: true, equation: true},
        dc_value: {type: "number", min: 0, max: 1e9, eng: true, equation: true},
        ac_mag: {type: "number", min: 0, max: 1e9, eng: true, equation: true},
        ac_phase: {type: "number", min: -360, max: 360, eng: true, equation: true},
    });
    device_attr_assign(this, this.attr);
};

Square.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'square.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Square.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'square.get_value()');
    this.validate();
    return this.attr.v + 'V ' + this.attr.f.toEng() + 'Hz ' + this.attr.duty + '% duty';
};

Square.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'square.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Square.prototype.render = function () {
    // Render spice netlist for this pickup
    assert_arguments_length(arguments, 0, 0, 'square.render()');
    // ngspice-36 PULSE ( V1 V2 TD TR TF PW PER PHASE)
    // ngspice-40 PULSE ( V1 V2 TD TR TF PW PER NP)
    var spice = [];
    spice.push("* square " + this.attr.name + '                 V1 2 D R       F       W     P');
    var per = equation_combine(1, '/', this.attr.f);
    var r = equation_combine(per, '/', 1000);
    var pw = equation_combine(per, '*', this.attr.duty, '/', 100);

    // spice does not support equation in ac_mag
    if (!this.attr.ac_mag && (is_equation(this.attr.v) || is_compiled_equation(this.attr.v))) {
        throw new Exception('pickup ' + this.attr.name + ' - if amplitude is equation, you must set numeric ac_mag, e.g. .ac_mag(0.1)');
    }

    spice.push("V_" + this.attr.name + " " + this.attr.anode + " " + this.attr.cathode +
        " DC " + this.attr.dc_value +
        " AC " + (this.attr.ac_mag || this.attr.v) + " " + this.attr.ac_phase + " " +
        " PULSE (" +
        (this.attr.offset) + " " +
        equation_combine(this.attr.offset, '+', this.attr.v) + " " +
        (this.attr.delay || 0) + " " +
        (this.attr.raise || r) + " " +
        (this.attr.fall || r) + " " +
        (pw || 0) + " " +
        (per || 0) + ")"
    );
    return spice.join('\n');
};

globalThis.exports = {Square,square};
Internal.Square = Square;
globalThis.square = square;
Internal.device_constructor.square = square;
