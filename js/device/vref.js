// 3-pin voltage reference
// linter: ngspicejs-lint --internal
"use strict";

function Vref(aName, aRef, aAnode, aCathode, aModel) {
    // Constructor
    assert_arguments_length(arguments, 0, 5, 'vref(name,ref,anode,cathode,model)');
    this.type = 'vref';
    this.expected_prefix = ['Q', 'VREF', 'REF'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = false;
    this.attr = {};
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
    if (aRef !== undefined) {
        this.ref(aRef);
    }
    if (aAnode !== undefined) {
        this.anode(aAnode);
    }
    if (aCathode !== undefined) {
        this.cathode(aCathode);
    }
    if (aModel !== undefined) {
        this.model(aModel);
    }
}

function vref(aName, aRef, aAnode, aCathode, aModel) {
    // Add voltage reference to netlist
    assert_arguments_length(arguments, 0, 5, 'vref(name,ref,anode,cathode,model)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Vref(aName);
    }
    return new Vref(aName, aRef, aAnode, aCathode, aModel);
}

Vref.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'vref.name(name,allow_this_prefix)');
    assert_name(aName, 'vref');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Vref.prototype.ref = function (aNet) {
    // Set reference input net name
    assert_arguments_length(arguments, 1, 1, 'vref.ref(net)');
    assert_net(aNet, 'net', 'vref.ref(net)');
    this.attr.ref = aNet;
    return this;
};

Vref.prototype.anode = function (aNet) {
    // Set anode net name
    assert_arguments_length(arguments, 1, 1, 'vref.anode(net)');
    assert_net(aNet, 'net', 'vref.anode(net)');
    this.attr.anode = aNet;
    return this;
};

Vref.prototype.cathode = function (aNet) {
    // Set cathode net name
    assert_arguments_length(arguments, 1, 1, 'vref.cathode(net)');
    assert_net(aNet, 'net', 'vref.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

Vref.prototype.model = function (aModel) {
    // Set model name
    assert_arguments_length(arguments, 1, 1, 'vref.model(name)');
    assert_string(aModel, 'model', 'vref.model(model)');
    this.attr.model = aModel;
    assert_model_exists(this, this.type.toUpperCase(), aModel);
    return this;
};

Vref.prototype.get_model = function () {
    // Get model device specified by this device
    assert_arguments_length(arguments, 0, 0, 'vref.get_model()');
    assert_string(this.attr.model, this.attr.name + ' ' + this.type + '.attr.model');
    var m = find_model(this, this.type.toUpperCase(), this.attr.model);
    if (!m) {
        hint('Unlike spice, models needs to be defined before they are used!');
        throw new Exception('Unknown ' + this.type.toUpperCase() + ' model type ' + this.attr.model);
    }
    return m;
};

Vref.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'vref.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        ref: {type: "net", required: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        model: {type: "string", min: 1, max: 100, alphanumeric: true, startalpha: false}
    });
    device_attr_assign(this, this.attr);
};

Vref.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'vref.get_nets()');
    return {
        ref: this.attr.ref,
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Vref.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'vref.get_value()');
    this.validate();
    return this.attr.model;
};

Vref.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'vref.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Vref.prototype.render = function () {
    // Render spice netlist for this vref
    assert_arguments_length(arguments, 0, 0, 'vref.render()');
    var spice = ["* vref " + this.attr.name];
    var m = find_model(this, 'VREF', this.attr.model);
    if (m.type === 'sub_model' || m.type === 'spice_model') {
        spice.push("x_" + this.attr.name + ' ' + this.attr.ref + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' ' + this.attr.model);
        return spice.join('\n');
    }
    throw new Exception('Unknown VREF model type ' + m.type);
};

globalThis.exports = {Vref,vref};
Internal.Vref = Vref;
globalThis.vref = vref;
Internal.device_constructor.vref = vref;
