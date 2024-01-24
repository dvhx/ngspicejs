// Ammeter
// linter: ngspicejs-lint --internal
"use strict";

function Ammeter(aName, aAnode, aCathode) {
    // Constructor
    assert_arguments_length(arguments, 0, 3, 'ammeter(name,anode,cathode)');
    this.type = 'ammeter';
    this.expected_prefix = ['A'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true; // yes ammeter is voltage source, there is also check for parallel voltage sources and this handles it
    this.attr = {};
    Ammeter.ammeters.push(this);
    // single attr value, e.g. ammeter({name: 'D1', anode: 1, cathode: 2, model: '1N5819'});
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
}

Ammeter.ammeters = [];

function ammeter(aName, aAnode, aCathode) {
    // Add ammeter to netlist
    assert_arguments_length(arguments, 0, 3, 'ammeter(name,anode,cathode)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Ammeter(aName);
    }
    return new Ammeter(aName, aAnode, aCathode);
}

Ammeter.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'ammeter.name(name,allow_this_prefix)');
    assert_name(aName, 'ammeter');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Ammeter.prototype.anode = function (aNet) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'ammeter.anode(net)');
    assert_net(aNet, 'net', 'ammeter.anode(net)');
    this.attr.anode = aNet;
    return this;
};

Ammeter.prototype.cathode = function (aNet) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'ammeter.cathode(net)');
    assert_net(aNet, 'net', 'ammeter.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

Ammeter.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'ammeter.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", min: 1, max: 100, required: true, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true}
    });
    device_attr_assign(this, this.attr);
};

Ammeter.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'ammeter.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Ammeter.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'ammeter.get_value()');
    this.validate();
    return '';
};

Ammeter.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'ammeter.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    Ammeter.ammeters.splice(Ammeter.ammeters.indexOf(this), 1);
    return this;
};

Ammeter.prototype.render = function () {
    // Render spice netlist for this ammeter
    assert_arguments_length(arguments, 0, 0, 'ammeter.render()');
    var spice = [];
    spice.push("* ammeter " + this.attr.name);
    spice.push("V_AMMETER__" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' DC 0');
    return spice.join('\n');
};

globalThis.exports = {Ammeter, ammeter};
Internal.Ammeter = Ammeter;
globalThis.ammeter = ammeter;
Internal.device_constructor.ammeter = ammeter;
