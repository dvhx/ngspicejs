// P-channel JFET transistor
// linter: ngspicejs-lint --internal
"use strict";

function JFetP(aName, aD, aG, aS, aModel) {
    // Constructor
    assert_arguments_length(arguments, 0, 5, 'jfet_p(name,d,g,s,model)');
    this.type = 'jfet_p';
    this.expected_prefix = ['J', 'Q', 'T'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = false;
    this.attr = {};
    // single attr value, e.g. jfet_p({name: 'D1', anode: 1, cathode: 2, model: '1N5819'});
    if (arguments.length === 1 && typeof aName === 'object') {
        object_merge(this.attr, aName);
        this.validate();
        return;
    }
    // individual arguments
    if (aName !== undefined) {
        this.name(aName);
    }
    if (aD !== undefined) {
        this.d(aD);
    }
    if (aG !== undefined) {
        this.g(aG);
    }
    if (aS !== undefined) {
        this.s(aS);
    }
    if (aModel !== undefined) {
        this.model(aModel);
    }
}

function jfet_p(aName, aD, aG, aS, aModel) {
    // Add jfet_p to netlist
    assert_arguments_length(arguments, 0, 5, 'jfet_p(name,d,g,s,model)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new JFetP(aName);
    }
    return new JFetP(aName, aD, aG, aS, aModel);
}

JFetP.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'jfet_p.name(name,allow_this_prefix)');
    assert_name(aName, 'jfet_p');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

JFetP.prototype.d = function (aNet) {
    // Set drain net
    assert_arguments_length(arguments, 1, 1, 'jfet_p.d(net)');
    assert_net(aNet, 'net', 'jfet_p.d(net)');
    this.attr.d = aNet;
    return this;
};

JFetP.prototype.g = function (aNet) {
    // Set gate net
    assert_arguments_length(arguments, 1, 1, 'jfet_p.g(net)');
    assert_net(aNet, 'net', 'jfet_p.g(net)');
    this.attr.g = aNet;
    return this;
};

JFetP.prototype.s = function (aNet) {
    // Set source net
    assert_arguments_length(arguments, 1, 1, 'jfet_p.s(net)');
    assert_net(aNet, 'net', 'jfet_p.s(net)');
    this.attr.s = aNet;
    return this;
};

JFetP.prototype.model = function (aModel) {
    // Set model
    assert_arguments_length(arguments, 1, 1, 'jfet_p.model(name)');
    assert_string(aModel, 'model', 'jfet_p.model(model)');
    this.attr.model = aModel;
    assert_model_exists(this, this.type.toUpperCase(), aModel);
    return this;
};

JFetP.prototype.get_model = function () {
    // Get model device specified by this device
    assert_arguments_length(arguments, 0, 0, 'jfet_p.get_model()');
    assert_string(this.attr.model, this.attr.name + ' ' + this.type + '.attr.model');
    var m = find_model(this, this.type.toUpperCase(), this.attr.model);
    if (!m) {
        hint('Unlike spice, models needs to be defined before they are used!');
        throw new Exception('Unknown ' + this.type.toUpperCase() + ' model type ' + this.attr.model);
    }
    return m;
};

JFetP.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'jfet_p.get_nets()');
    return {
        d: this.attr.d,
        g: this.attr.g,
        s: this.attr.s
    };
};

JFetP.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'jfet_p.get_value()');
    return this.attr.model;
};

JFetP.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'jfet_p.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        d: {type: "net", required: true},
        g: {type: "net", required: true},
        s: {type: "net", required: true},
        model: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: false}
    });
    device_attr_assign(this, this.attr);
};

JFetP.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'jfet_p.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

JFetP.prototype.render = function () {
    // Render spice netlist for this jfet_p
    assert_arguments_length(arguments, 0, 0, 'jfet_p.render()');
    var spice = ["* jfet_p " + this.attr.name];
    var m = find_model(this, 'PNP', this.attr.model);
    if (m.type === 'jfet_model') {
        spice.push("J_" + this.attr.name + ' ' + this.attr.d + ' ' + this.attr.g + ' ' + this.attr.s + ' Q' + this.attr.model);
        return spice.join('\n');
    }
    if (m.type === 'sub_model' || m.type === 'spice_model') {
        spice.push("x_" + this.attr.name + ' ' + this.attr.c + ' ' + this.attr.b + ' ' + this.attr.e + ' ' + this.attr.model);
        return spice.join('\n');
    }
    throw new Exception('Unknown JFET_P model type ' + m.type);
};

globalThis.exports = {JFetP,jfet_p};
Internal.JFetP = JFetP;
globalThis.jfet_p = jfet_p;
Internal.device_constructor.jfet_p = jfet_p;
