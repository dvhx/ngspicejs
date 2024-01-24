// Potentiometer
// linter: ngspicejs-lint --internal
"use strict";

function Pot(aName, aStart, aWiper, aEnd, aR, aPercent) {
    // Constructor
    assert_arguments_length(arguments, 0, 6, 'pot(name,start,wiper,end,r,percent)');
    this.type = 'pot';
    this.expected_prefix = ['P', 'R', 'POT', 'VOL', 'BLEND', 'HIGH', 'MID', 'LOW', 'TONE', 'GAIN', 'DIST', 'LOAD'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = false;
    this.attr = {percent: 50};
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
    if (aStart !== undefined) {
        this.start(aStart);
    }
    if (aWiper !== undefined) {
        this.wiper(aWiper);
    }
    if (aEnd !== undefined) {
        this.end(aEnd);
    }
    if (aR !== undefined) {
        this.r(aR);
    }
    if (aPercent !== undefined) {
        this.percent(aPercent);
    }
}

function pot(aName, aStart, aWiper, aEnd, aR, aPercent) {
    // Add pot to netlist
    assert_arguments_length(arguments, 0, 6, 'pot(name,start,wiper,end,r,percent)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Pot(aName);
    }
    return new Pot(aName, aStart, aWiper, aEnd, aR, aPercent);
}

Pot.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'pot.name(name,allow_this_prefix)');
    assert_name(aName, 'pot');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Pot.prototype.start = function (aNet) {
    // Set start net
    assert_arguments_length(arguments, 1, 1, 'pot.start(net)');
    assert_net(aNet, 'net', 'pot.start(net)');
    this.attr.start = aNet;
    return this;
};

Pot.prototype.wiper = function (aNet) {
    // Set wiper net
    assert_arguments_length(arguments, 1, 1, 'pot.wiper(net)');
    assert_net(aNet, 'net', 'pot.wiper(net)');
    this.attr.wiper = aNet;
    return this;
};

Pot.prototype.end = function (aNet) {
    // Set end net
    assert_arguments_length(arguments, 1, 1, 'pot.end(net)');
    assert_net(aNet, 'net', 'pot.end(net)');
    this.attr.end = aNet;
    return this;
};

Pot.prototype.r = function (aValue) {
    // Set resistance
    assert_arguments_length(arguments, 1, 1, 'pot.r(resistance)');
    this.attr.r = eng(aValue, 1, 'pot.r(value)');
    return this;
};

Pot.prototype.percent = function (aValue) {
    // Set wiper position in percents
    assert_arguments_length(arguments, 1, 1, 'pot.percent(value)');
    this.attr.percent = eng(aValue, 1, 'pot.percent(value)');
    return this;
};

Pot.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'pot.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        start: {type: "net", required: true},
        wiper: {type: "net", required: true},
        end: {type: "net", required: true},
        r: {type: "number", min: 0, max: 1e20, required: true, eng: true, equation: true},
        percent: {type: "number", min: 0, max: 100, required: true, eng: true, equation: true}
    });
    device_attr_assign(this, this.attr);
};

Pot.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'pot.get_nets()');
    return {
        start: this.attr.start,
        wiper: this.attr.wiper,
        end: this.attr.end
    };
};

Pot.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'pot.get_value()');
    this.validate();
    return this.attr.r + 'R ' + this.attr.percent + '%';
};

Pot.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'pot.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Pot.prototype.render = function () {
    // Render spice netlist for this pot
    assert_arguments_length(arguments, 0, 0, 'pot.render()');
    if (!Pot.model) {
        Pot.model = sub_model('POT', ['start', 'wiper', 'end'], {r: '1k', percent: 50});
        Pot.model.resistor('R1', 'start', 'wiper').r('{r * percent / 100}');
        Pot.model.resistor('R2', 'wiper', 'end').r('{r * (100 - percent) / 100}');
        Pot.model.end();
    }
    //request_model('OTHER', 'POT');
    var spice = [];
    spice.push("* pot " + this.attr.name);
    spice.push("xPOT_" + this.attr.name + "_" + this.attr.name + ' ' + this.attr.start + ' ' + this.attr.wiper + ' ' + this.attr.end + ' POT r=' + this.attr.r + ' percent=' + this.attr.percent);
    return spice.join('\n');
};

globalThis.exports = {Pot,pot};
Internal.Pot = Pot;
globalThis.pot = pot;
Internal.device_constructor.pot = pot;
