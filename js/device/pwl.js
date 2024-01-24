// Piece-wise linear voltage source
// linter: ngspicejs-lint --internal
"use strict";

function PWL(aName, aAnode, aCathode, aShape, aRepeatFrom, aDelay) {
    // Constructor
    this.type = 'pwl';
    this.expected_prefix = ['U', 'V'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true;
    this.attr = {};
    assert_arguments_length(arguments, 0, 6, 'pwl(name,anode,cathode,shape,repeat_from,delay)');
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
    if (aShape !== undefined) {
        this.shape(aShape);
    }
    if (aRepeatFrom !== undefined) {
        this.repeat_from(aRepeatFrom);
    }
    if (aDelay !== undefined) {
        this.delay(aDelay);
    }
}

function pwl(aName, aAnode, aCathode, aShape, aRepeatFrom, aDelay) {
    // Add piece-wise linear source to netlist
    assert_arguments_length(arguments, 0, 6, 'pwl(name,anode,cathode,shape,repeat_from,delay)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new PWL(aName);
    }
    var d = new PWL(aName, aAnode, aCathode, aShape, aRepeatFrom, aDelay);
    warn_source_arguments_length(arguments, d);
    return d;
}

PWL.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'pwl.name(name,allow_this_prefix)');
    assert_name(aName, 'pwl');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

PWL.prototype.anode = function (aAnode) {
    // Set anode net
    assert_arguments_length(arguments, 1, 1, 'pwl.anode(net)');
    assert_net(aAnode, 'net', 'pwl.anode(net)');
    this.attr.anode = aAnode;
    return this;
};

PWL.prototype.cathode = function (aCathode) {
    // Set cathode net
    assert_arguments_length(arguments, 1, 1, 'pwl.cathode(net)');
    assert_net(aCathode, 'net', 'pwl.cathode(net)');
    this.attr.cathode = aCathode;
    return this;
};

PWL.prototype.shape = function (aValue) {
    // Set shape as array of times and voltages, e.g. [[0, 0], [0.02, 5]]
    assert_arguments_length(arguments, 1, 1, 'pwl.shape(value)');
    assert_array(aValue, 'value', 'pwl.shape(value)');
    this.attr.shape = aValue;
    return this;
};

PWL.prototype.repeat_from = function (aValue) {
    // Set time from which to repeat the signal, value must be in the shape
    assert_arguments_length(arguments, 1, 1, 'pwl.repeat_from(value)');
    if (!this.attr.shape) {
        throw new Exception('In pwl() you need to set shape first, then you can set repeat_from');
    }
    var t = [];
    var a = this.attr.shape.find((s) => { t.push(s[0]); return eng(s[0]) === eng(aValue); });
    if (!a) {
        hint('Available times are: ' + t.join(', '));
        throw new Exception('In pwl().repeat_from() can only use existing time (x-axis value) used in shape: ' + JSON.stringify(this.attr.shape));
    }
    this.attr.repeat_from = eng(aValue, 1, 'pwl.repeat_from(value)');
    return this;
};

PWL.prototype.delay = function (aValue) {
    // Set delay
    assert_arguments_length(arguments, 1, 1, 'pwl.delay(value)');
    this.attr.delay = eng(aValue, 1, 'pwl.delay(value)');
    return this;
};

PWL.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'pwl.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        shape: {type: "array_of_complex", min: 0, max: 100, eng: true, required: true},
        repeat_from: {type: "number", min: 0, max: 1e9, eng: true, equation: false},
        delay: {type: "number", min: 0, max: 1000, eng: true, equation: true},
    });
    device_attr_assign(this, this.attr);
    if (this.attr.shape.length < 2) {
        throw new Exception("pwl(name=" + this.attr.name + ") shape must have at least 2 points but has " + this.attr.shape.length);
    }
    if (this.attr.repeat_from > this.attr.shape.at(-1)[0]) {
        throw new Exception("pwl(name=" + this.attr.name + ").repeat_from(" + this.attr.repeat_from.toEng() + ") is time from which the PWL signal is repeated, it must be smaller that the last time of the PWL shape which is " + this.attr.shape.at(-1)[0].toEng());
    }
};

PWL.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'pwl.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

PWL.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'pwl.get_value()');
    this.validate();
    return this.attr.shape.join(' ').replace(/,/g, ' ');
};

PWL.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'pwl.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

PWL.prototype.render = function () {
    // Render spice netlist
    assert_arguments_length(arguments, 0, 0, 'pwl.render()');
    // SIN (VO VA FREQ TD THETA PHASE )
    var spice = [];
    spice.push("* pwl " + this.attr.name);
    spice.push("V_" + this.attr.name + " " +
        this.attr.anode + " " +
        this.attr.cathode + ' ' +
        'DC 0 AC 0 0 ' +
        'PWL (' + this.attr.shape.join(' ').replace(/\,/g, ' ') + ') ' +
        (this.attr.repeat_from >= 0 ? 'r=' + this.attr.repeat_from + ' ' : '') +
        (this.attr.delay ? 'td=' + this.attr.delay : '')
    );
    return spice.join('\n');
};

globalThis.exports = {PWL,pwl};
Internal.PWL = PWL;
globalThis.pwl = pwl;
Internal.device_constructor.pwl = pwl;
