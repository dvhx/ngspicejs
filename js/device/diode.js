// Diode
// linter: ngspicejs-lint --internal
"use strict";

function Diode(aName, aAnode, aCathode, aModel) {
    // Constructor
    assert_arguments_length(arguments, 0, 4, 'diode(name,anode,cathode,model)');
    this.type = 'diode';
    this.expected_prefix = ['D', 'LED'];
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

function diode(aName, aAnode, aCathode, aModel) {
    // Add diode to netlist
    assert_arguments_length(arguments, 0, 4, 'diode(name,anode,cathode,model)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Diode(aName);
    }
    return new Diode(aName, aAnode, aCathode, aModel);
}

Diode.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'diode.name(name,allow_this_prefix)');
    assert_name(aName, 'diode');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Diode.prototype.anode = function (aNet) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'diode.anode(net)');
    assert_net(aNet, 'net', 'diode.anode(net)');
    this.attr.anode = aNet;
    return this;
};

Diode.prototype.cathode = function (aNet) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'diode.cathode(net)');
    assert_net(aNet, 'net', 'diode.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

Diode.prototype.model = function (aModel) {
    // Set model
    assert_arguments_length(arguments, 1, 1, 'diode.model(model)');
    assert_string(aModel, 'model', 'diode.model(model)');
    this.attr.model = aModel;
    assert_model_exists(this, this.type.toUpperCase(), aModel);
    return this;
};

Diode.prototype.get_model = function () {
    // Get model device specified by this device
    assert_arguments_length(arguments, 0, 0, 'diode.get_model()');
    assert_string(this.attr.model, this.attr.name + ' ' + this.type + '.attr.model');
    var m = find_model(this, this.type.toUpperCase(), this.attr.model);
    if (!m) {
        hint('Unlike in spice, models needs to be defined before they are used!');
        throw new Exception('Unknown ' + this.type.toUpperCase() + ' model type ' + this.attr.model);
    }
    return m;
};

Diode.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'diode.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        model: {type: "string", min: 1, max: 100, alphanumeric: true, startalpha: false}
    });
    device_attr_assign(this, this.attr);
};

Diode.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'diode.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Diode.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'diode.get_value()');
    return this.attr.model;
};

Diode.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'diode.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Diode.prototype.render = function () {
    // Render spice netlist for this diode
    assert_arguments_length(arguments, 0, 0, 'diode.render()');
    var spice = ["* diode " + this.attr.name];
    var m = find_model(this, 'DIODE', this.attr.model);
    if (!m) {
        throw new Exception(this.attr.name + ' diode model ' + this.attr.model + ' not found!');
    }
    if (m.type === 'diode_model') {
        spice.push("D_" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' D' + this.attr.model);
        return spice.join('\n');
    }
    if (m.type === 'sub_model' || m.type === 'spice_model') {
        spice.push("x_" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' ' + this.attr.model);
        return spice.join('\n');
    }
    throw new Exception('Diode ' + this.attr.name + ' uses unknown model type ' + m.type);
};

globalThis.exports = {Diode,diode};
Internal.Diode = Diode;
globalThis.diode = diode;
Internal.device_constructor.diode = diode;
