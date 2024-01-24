// Sawtooth voltage source
// linter: ngspicejs-lint --internal
"use strict";

function Sawtooth(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aInverse) {
    // Constructor
    this.type = 'sawtooth';
    this.expected_prefix = ['U', 'V'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true;
    this.attr = {offset: 0, delay: 0, inverse: false};
    assert_arguments_length(arguments, 0, 8, 'sawtooth(name,anode,cathode,offset,v,f,delay,inverse)');
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
        this.delay(aDelay);
    }
    if (aInverse !== undefined) {
        this.inverse(aInverse);
    }
}

function sawtooth(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aInverse) {
    // Add sawtooth voltage source to netlist
    assert_arguments_length(arguments, 0, 8, 'sawtooth(name,anode,cathode,offset,v,f,delay)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Sawtooth(aName);
    }
    var d = new Sawtooth(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aInverse);
    warn_source_arguments_length(arguments, d);
    return d;
}

Sawtooth.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'sawtooth.name(name,allow_this_prefix)');
    assert_name(aName, 'sawtooth');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Sawtooth.prototype.anode = function (aAnode) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'sawtooth.anode(net)');
    assert_net(aAnode, 'net', 'sawtooth.anode(net)');
    this.attr.anode = aAnode;
    return this;
};

Sawtooth.prototype.cathode = function (aCathode) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'sawtooth.cathode(net)');
    assert_net(aCathode, 'net', 'sawtooth.cathode(net)');
    this.attr.cathode = aCathode;
    return this;
};

Sawtooth.prototype.offset = function (aValue) {
    // Set offset
    assert_arguments_length(arguments, 1, 1, 'sawtooth.offset(value)');
    this.attr.offset = eng(aValue, 1, 'sawtooth.offset(value)');
    return this;
};
Sawtooth.prototype.v = function (aValue) {
    // Set amplitude
    assert_arguments_length(arguments, 1, 1, 'sawtooth.v(value)');
    this.attr.v = eng(aValue, 1, 'sawtooth.v(value)');
    return this;
};

Sawtooth.prototype.f = function (aValue) {
    // Set frequency
    assert_arguments_length(arguments, 1, 1, 'sawtooth.f(value)');
    this.attr.f = eng(aValue, 1, 'sawtooth.f(value)');
    return this;
};

Sawtooth.prototype.delay = function (aValue) {
    // Set delay
    assert_arguments_length(arguments, 1, 1, 'sawtooth.delay(value)');
    this.attr.delay = eng(aValue, 1, 'sawtooth.delay(value)');
    return this;
};

Sawtooth.prototype.inverse = function (aValue) {
    // Make sawtooth inverted (in time, normal is raising, inverted is falling)
    assert_arguments_length(arguments, 1, 1, 'sawtooth.inverse(value)');
    assert_boolean(aValue, 'value', 'sawtooth.inverse(value)');
    this.attr.inverse = aValue;
    return this;
};

Sawtooth.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'sawtooth.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        offset: {type: "number", min: -1e9, max: 1e9, eng: true, equation: true},
        v: {type: "number", min: 0, max: 1e9, eng: true, equation: true, required: true},
        f: {type: "number", min: 0, max: 1e12, eng: true, equation: true, required: true},
        delay: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        inverse: {type: "boolean"},
    });
    device_attr_assign(this, this.attr);
};

Sawtooth.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'sawtooth.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Sawtooth.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'sawtooth.get_value()');
    this.validate();
    return this.attr.v + 'V ' + this.attr.f.toEng() + 'Hz';
};

Sawtooth.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'sawtooth.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Sawtooth.prototype.render = function () {
    // Render spice netlist
    assert_arguments_length(arguments, 0, 0, 'sawtooth.render()');
    this.validate();
    var spice = ["*" + device_summary(this)];
    //var pw = 1 / this.attr.f;
    var pw = equation_combine(1, '/', this.attr.f);
    if (this.attr.inverse) {
        spice.push("V_" + this.attr.name + " " + this.attr.anode + " " + this.attr.cathode + " DC 0 " +
            "PWL (0 " + equation_combine(this.attr.offset, '+', this.attr.v) + " " + pw + " " + this.attr.offset + ") r=0 td=" + (this.attr.delay || 0));
    } else {
        spice.push("V_" + this.attr.name + " " + this.attr.anode + " " + this.attr.cathode + " DC 0 " +
            "PWL (0 " + this.attr.offset + " " + pw + " " + equation_combine(this.attr.offset, '+', this.attr.v) + ") r=0 td=" + (this.attr.delay || 0));
    }
    return spice.join('\n');
};

globalThis.exports = {Sawtooth, sawtooth};

Internal.Sawtooth = Sawtooth;
globalThis.sawtooth = sawtooth;
Internal.device_constructor.sawtooth = sawtooth;
