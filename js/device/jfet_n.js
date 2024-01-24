// N-channel JFET transistor
// linter: ngspicejs-lint --internal
"use strict";

function JFetN(aName, aD, aG, aS, aModel) {
    // Constructor
    assert_arguments_length(arguments, 0, 5, 'jfet_n(name,d,g,s,model)');
    this.type = 'jfet_n';
    this.expected_prefix = ['J', 'Q', 'T'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = false;
    this.attr = {};
    // single attr value, e.g. jfet_n({name: 'D1', anode: 1, cathode: 2, model: '1N5819'});
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

function jfet_n(aName, aD, aG, aS, aModel) {
    // Add jfet_n to netlist
    assert_arguments_length(arguments, 0, 5, 'jfet_n(name,d,g,s,model)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new JFetN(aName);
    }
    return new JFetN(aName, aD, aG, aS, aModel);
}

JFetN.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'jfet_n.name(name,allow_this_prefix)');
    assert_name(aName, 'jfet_n');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

JFetN.prototype.d = function (aNet) {
    // Set drain net
    assert_arguments_length(arguments, 1, 1, 'jfet_n.d(net)');
    assert_net(aNet, 'net', 'jfet_n.d(net)');
    this.attr.d = aNet;
    return this;
};

JFetN.prototype.g = function (aNet) {
    // Set gate net
    assert_arguments_length(arguments, 1, 1, 'jfet_n.g(net)');
    assert_net(aNet, 'net', 'jfet_n.g(net)');
    this.attr.g = aNet;
    return this;
};

JFetN.prototype.s = function (aNet) {
    // Set source net
    assert_arguments_length(arguments, 1, 1, 'jfet_n.s(net)');
    assert_net(aNet, 'net', 'jfet_n.s(net)');
    this.attr.s = aNet;
    return this;
};

JFetN.prototype.model = function (aModel) {
    // Set model
    assert_arguments_length(arguments, 1, 1, 'jfet_n.model(name)');
    assert_string(aModel, 'model', 'jfet_n.model(model)');
    this.attr.model = aModel;
    assert_model_exists(this, this.type.toUpperCase(), aModel);
    return this;
};

JFetN.prototype.get_model = function () {
    // Get model device specified by this device
    assert_arguments_length(arguments, 0, 0, 'jfet_n.get_model()');
    assert_string(this.attr.model, this.attr.name + ' ' + this.type + '.attr.model');
    var m = find_model(this, this.type.toUpperCase(), this.attr.model);
    if (!m) {
        hint('Unlike spice, models needs to be defined before they are used!');
        throw new Exception('Unknown ' + this.type.toUpperCase() + ' model type ' + this.attr.model);
    }
    return m;
};

JFetN.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'jfet_n.get_nets()');
    return {
        d: this.attr.d,
        g: this.attr.g,
        s: this.attr.s
    };
};

JFetN.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'jfet_n.get_value()');
    return this.attr.model;
};

JFetN.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'jfet_n.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        d: {type: "net", required: true},
        g: {type: "net", required: true},
        s: {type: "net", required: true},
        model: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: false}
    });
    device_attr_assign(this, this.attr);
};

JFetN.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'jfet_n.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

JFetN.prototype.render = function () {
    // Render spice netlist for this jfet_n
    assert_arguments_length(arguments, 0, 0, 'jfet_n.render()');
    var spice = ["* jfet_n " + this.attr.name];
    var m = find_model(this, 'JFET_N', this.attr.model);
    if (m.type === 'jfet_model') {
        spice.push("J_" + this.attr.name + ' ' + this.attr.d + ' ' + this.attr.g + ' ' + this.attr.s + ' Q' + this.attr.model);
        return spice.join('\n');
    }
    if (m.type === 'sub_model' || m.type === 'spice_model') {
        spice.push("x_" + this.attr.name + ' ' + this.attr.d + ' ' + this.attr.g + ' ' + this.attr.s + ' ' + this.attr.model);
        return spice.join('\n');
    }
    throw new Exception('Unknown JFET_N model type ' + m.type);
};

globalThis.exports = {JFetN,jfet_n};
Internal.JFetN = JFetN;
globalThis.jfet_n = jfet_n;
Internal.device_constructor.jfet_n = jfet_n;
