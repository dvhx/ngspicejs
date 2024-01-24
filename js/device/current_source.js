// Current source
// linter: ngspicejs-lint --internal
"use strict";

function CurrentSource(aName, aAnode, aCathode, aI, aRs) {
    // Constructor
    assert_arguments_length(arguments, 0, 5, 'current_source(name,anode,cathode,i,rs)');
    this.type = 'current_source';
    this.expected_prefix = ['I'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = false;
    this.attr = {rs: 0};
    // single attr value, e.g. current_source({name: 'U1', anode: 1, cathode: 2, model: '1N5819'});
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
    if (aI !== undefined) {
        this.i(aI);
    }
    if (aRs !== undefined) {
        this.rs(aRs);
    }
}

function current_source(aName, aAnode, aCathode, aI, aRs) {
    // Add current source to netlist
    assert_arguments_length(arguments, 0, 5, 'current_source(name,anode,cathode,i,rs)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new CurrentSource(aName);
    }
    return new CurrentSource(aName, aAnode, aCathode, aI, aRs);
}

CurrentSource.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'current_source.name(name,allow_this_prefix)');
    assert_name(aName, 'current_source');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

CurrentSource.prototype.anode = function (aNet) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'current_source.anode(net)');
    assert_net(aNet, 'net', 'current_source.anode(net)');
    this.attr.anode = aNet;
    return this;
};

CurrentSource.prototype.cathode = function (aNet) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'current_source.cathode(net)');
    assert_net(aNet, 'net', 'current_source.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

CurrentSource.prototype.i = function (aValue) {
    // Set current
    assert_arguments_length(arguments, 1, 1, 'current_source.i(current)');
    this.attr.i = eng(aValue, 1, 'current_source.i(current)');
    return this;
};

CurrentSource.prototype.rs = function (aValue) {
    // Set series resistance
    assert_arguments_length(arguments, 1, 1, 'current_source.rs(resistance)');
    this.attr.rs = eng(aValue, 1, 'current_source.rs(resistance)');
    return this;
};

CurrentSource.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'current_source.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        i: {type: "number", min: 0, max: 1e12, eng: true, equation: true, required: true},
        rs: {type: "number", min: 0, max: 1e12, eng: true, equation: true}
    });
    device_attr_assign(this, this.attr);
};

CurrentSource.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'current_source.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

CurrentSource.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'current_source.get_value()');
    this.validate();
    return this.attr.i + 'A';
};

CurrentSource.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'current_source.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

CurrentSource.prototype.render = function () {
    // Render spice netlist for this current_source
    assert_arguments_length(arguments, 0, 0, 'current_source.render()');
    this.validate();
    var spice = [];
    spice.push("* current_source " + this.attr.name);
    if (this.attr.rs) {
        spice.push(".subckt sub_current_source_" + this.attr.name + " a b");
        spice.push(" Rs a 1 " + this.attr.rs);
        spice.push(" I0 1 b DC " + this.attr.i);
        spice.push(".ends sub_current_source_" + this.attr.name);
        spice.push("x_" + this.attr.name + " " + this.attr.anode + " " + this.attr.cathode + " sub_current_source_" + this.attr.name);
    } else {
        spice.push("I_" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' DC ' + this.attr.i);
    }
    return spice.join('\n');
};

globalThis.exports = {CurrentSource,current_source};
Internal.CurrentSource = CurrentSource;
globalThis.current_source = current_source;
Internal.device_constructor.current_source = current_source;
