// Operational amplifier
// linter: ngspicejs-lint --internal
"use strict";

function Opamp(aName, aInPlus, aInMinus, aVPlus, aVMinus, aOut, aModel) {
    // Constructor
    assert_arguments_length(arguments, 0, 7, 'opamp(name,inplus,inminus,vplus,vminus,out,model)');
    this.type = 'opamp';
    this.expected_prefix = ['Q'];
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
    if (aInPlus !== undefined) {
        this.inplus(aInPlus);
    }
    if (aInMinus !== undefined) {
        this.inminus(aInMinus);
    }
    if (aVPlus !== undefined) {
        this.vplus(aVPlus);
    }
    if (aVMinus !== undefined) {
        this.vminus(aVMinus);
    }
    if (aOut !== undefined) {
        this.out(aOut);
    }
    if (aModel !== undefined) {
        this.model(aModel);
    }
}

function opamp(aName, aInPlus, aInMinus, aVPlus, aVMinus, aOut, aModel) {
    // Add opamp to netlist
    assert_arguments_length(arguments, 0, 7, 'opamp(name,inplus,inminus,vplus,vminus,out,model)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Opamp(aName);
    }
    return new Opamp(aName, aInPlus, aInMinus, aVPlus, aVMinus, aOut, aModel);
}

Opamp.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'opamp.name(name,allow_this_prefix)');
    assert_name(aName, 'opamp');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Opamp.prototype.inplus = function (aNet) {
    // Set non-inverting input net
    assert_arguments_length(arguments, 1, 1, 'opamp.inplus(net)');
    assert_net(aNet, 'net', 'opamp.inplus(net)');
    this.attr.inplus = aNet;
    return this;
};

Opamp.prototype.inminus = function (aNet) {
    // Set inverting input net
    assert_arguments_length(arguments, 1, 1, 'opamp.inminus(net)');
    assert_net(aNet, 'net', 'opamp.inminus(net)');
    this.attr.inminus = aNet;
    return this;
};

Opamp.prototype.vplus = function (aNet) {
    // Set positive supply net
    assert_arguments_length(arguments, 1, 1, 'opamp.vplus(net)');
    assert_net(aNet, 'net', 'opamp.vplus(net)');
    this.attr.vplus = aNet;
    return this;
};

Opamp.prototype.vminus = function (aNet) {
    // Set negative supply net
    assert_arguments_length(arguments, 1, 1, 'opamp.vminus(net)');
    assert_net(aNet, 'net', 'opamp.vminus(net)');
    this.attr.vminus = aNet;
    return this;
};

Opamp.prototype.out = function (aNet) {
    // Set output net
    assert_arguments_length(arguments, 1, 1, 'opamp.out(net)');
    assert_net(aNet, 'net', 'opamp.out(net)');
    this.attr.out = aNet;
    return this;
};

Opamp.prototype.model = function (aModel) {
    // Set model name
    assert_arguments_length(arguments, 1, 1, 'opamp.model(name)');
    assert_string(aModel, 'model', 'opamp.model(model)');
    this.attr.model = aModel;
    assert_model_exists(this, this.type.toUpperCase(), aModel);
    return this;
};

Opamp.prototype.get_model = function () {
    // Get model device specified by this device
    assert_arguments_length(arguments, 0, 0, 'opamp.get_model()');
    assert_string(this.attr.model, this.attr.name + ' ' + this.type + '.attr.model');
    var m = find_model(this, this.type.toUpperCase(), this.attr.model);
    if (!m) {
        hint('Unlike spice, models needs to be defined before they are used!');
        throw new Exception('Unknown ' + this.type.toUpperCase() + ' model type ' + this.attr.model);
    }
    return m;
};

Opamp.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'opamp.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        inplus: {type: "net", required: true},
        inminus: {type: "net", required: true},
        vplus: {type: "net", required: true},
        vminus: {type: "net", required: true},
        out: {type: "net", required: true},
        model: {type: "string", min: 1, max: 100, alphanumeric: true, startalpha: false, required: true}
    });
    device_attr_assign(this, this.attr);
};

Opamp.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'opamp.get_nets()');
    return {
        inplus: this.attr.inplus,
        inminus: this.attr.inminus,
        vplus: this.attr.vplus,
        vminus: this.attr.vminus,
        out: this.attr.out
    };
};

Opamp.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'opamp.get_value()');
    return this.attr.model;
};

Opamp.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'opamp.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Opamp.prototype.render = function () {
    // Render spice netlist for this opamp
    assert_arguments_length(arguments, 0, 0, 'opamp.render()');
    var spice = ["* opamp " + this.attr.name];
    var m = find_model(this, 'OPAMP', this.attr.model);
    if (!m) {
        throw new Exception('Opamp ' + this.attr.name + ' model "' + this.attr.model + '" was not found');
    }
    spice.push("x_opamp__" + this.attr.name + ' ' +
        this.attr.inplus + ' ' +
        this.attr.inminus + ' ' +
        this.attr.vplus + ' ' +
        this.attr.vminus + ' ' +
        this.attr.out + ' ' + this.attr.model);
    return spice.join('\n');
};

globalThis.exports = {Opamp,opamp};
Internal.Opamp = Opamp;
globalThis.opamp = opamp;
Internal.device_constructor.opamp = opamp;
