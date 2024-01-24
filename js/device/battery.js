// Battery (DC voltage source)
// linter: ngspicejs-lint --internal
"use strict";

function Battery(aName, aAnode, aCathode, aV, aRs) {
    // Constructor
    assert_arguments_length(arguments, 0, 5, 'battery(name,anode,cathode,v,rs)');
    this.type = 'battery';
    Battery.batteries.push(this);
    this.expected_prefix = ['V', 'U', 'BAT'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true;
    this.attr = {rs: 0};
    // single attr value, e.g. battery({name: 'U1', anode: 1, cathode: 2, model: '1N5819'});
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
    if (aRs !== undefined) {
        this.rs(aRs);
    }
}

Battery.batteries = [];

function battery(aName, aAnode, aCathode, aV, aRs) {
    // Add battery to netlist
    assert_arguments_length(arguments, 0, 5, 'battery(name,anode,cathode,v,rs)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Battery(aName);
    }
    return new Battery(aName, aAnode, aCathode, aV, aRs);
}

Battery.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'battery.name(name,allow_this_prefix)');
    assert_name(aName, 'battery');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Battery.prototype.anode = function (aNet) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'battery.anode(net)');
    assert_net(aNet, 'net', 'battery.anode(net)');
    this.attr.anode = aNet;
    return this;
};

Battery.prototype.cathode = function (aNet) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'battery.cathode(net)');
    assert_net(aNet, 'net', 'battery.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

Battery.prototype.v = function (aV) {
    // Set DC voltage
    assert_arguments_length(arguments, 1, 1, 'battery.v(voltage)');
    this.attr.v = aV;
    return this;
};

Battery.prototype.rs = function (aRs) {
    // Set internal series resistance of the battery
    assert_arguments_length(arguments, 1, 1, 'battery.rs(resistance)');
    this.attr.rs = aRs;
    return this;
};

Battery.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'battery.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", min: 1, max: 100, required: true, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        v: {type: "number", min: 0, max: 1e12, eng: true, equation: true, required: true},
        rs: {type: "number", min: 0.01, max: 1e12, eng: true, equation: true, zero: true}
    });
    device_attr_assign(this, this.attr);
};

Battery.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'battery.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Battery.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'battery.get_value()');
    this.validate();
    return this.attr.v.toEng() + 'V';
};

Battery.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'battery.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Battery.prototype.process_data = function (aData) {
    // In data make current "I(U1.V0)" accessible also as "I(U1)"
    assert_arguments_length(arguments, 1, 1, 'battery.process_data(data)');
    assert_object(aData, 'data', 'battery.process_data(data)');
    var bn = 'I(' + this.attr.name + '.V0)';
    if (Object.hasOwn(aData, bn)) {
        aData['I(' + this.attr.name + ')'] = aData[bn];
    }
};

Battery.prototype.render = function () {
    // Render spice netlist for this battery
    assert_arguments_length(arguments, 0, 0, 'battery.render()');
    var spice = [];
    spice.push("* battery " + this.attr.name);
    if (this.attr.rs) {
        // sub
        spice.push(".subckt sub_battery_" + this.attr.name + " a b");
        spice.push(" Rs a 1 " + this.attr.rs);
        spice.push(" V0 1 b DC " + this.attr.v);
        spice.push(".ends sub_battery_" + this.attr.name);
        spice.push("x_" + this.attr.name + " " + this.attr.anode + " " + this.attr.cathode + " sub_battery_" + this.attr.name);
    } else {
        spice.push("V_" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' DC ' + this.attr.v);
    }
    return spice.join('\n');
};

globalThis.exports = {Battery, battery};
Internal.Battery = Battery;
globalThis.battery = battery;
Internal.device_constructor.battery = battery;
