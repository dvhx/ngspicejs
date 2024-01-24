// Subcircuit device, previously declared with sub_model('POT', ...),
// linter: ngspicejs-lint --internal
"use strict";

function Sub(aName, aModel, aNets, aParams) {
    // Constructor
    assert_arguments_length(arguments, 0, 4, 'sub(name,model,nets,params)');
    this.type = 'sub';
    this.expected_prefix = [];
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
    if (aModel !== undefined) {
        this.model(aModel);
    }
    if (aNets !== undefined) {
        assert_array(aNets, 'nets', 'sub(name,model,nets,params)');
        this.nets(aNets);
    }
    if (aParams !== undefined) {
        assert_object(aParams, 'params', 'sub(name,model,nets,params)');
        this.params(aParams);
    }
}

function sub(aName, aModel, aNets, aParams) {
    // Add sub to netlist, uses model previously declared with sub_model or any other kind of model
    assert_arguments_length(arguments, 0, 4, 'sub(name,model,nets,params)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Sub(aName);
    }
    return new Sub(aName, aModel, aNets, aParams);
}

Sub.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'sub.name(name,allow_this_prefix)');
    assert_name(aName, 'sub');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Sub.prototype.model = function (aModel) {
    // Set model name
    assert_arguments_length(arguments, 1, 1, 'sub.model(value)');
    assert_string(aModel, 'model', 'sub.model(model)');
    if (Array.isArray(aModel)) {
        hint('to declare subcircuit model use: sub_model(name,[nets],{params})');
        hint('to use subcircuit model use: sub(name,model,[nets],{params})');
    }
    assert_string(aModel, 'value', 'sub.model(value)');
    if (!aModel.match(/^[A-Z0-9_]+$/)) {
        throw new Exception('sub.model(value) allowed characters are A-Z0-9_ but instead is "' + aModel + '"');
    }
    this.attr.model = aModel;
    assert_model_exists(this, '', aModel);
    return this;
};

Sub.prototype.get_model = function () {
    // Get model device specified by this device
    assert_arguments_length(arguments, 0, 0, 'sub.get_model()');
    assert_string(this.attr.model, this.attr.name + ' ' + this.type + '.attr.model');
    var m = find_model(this, this.type.toUpperCase(), this.attr.model);
    if (!m) {
        hint('Unlike spice, models needs to be defined before they are used!');
        throw new Exception('Unknown ' + this.type.toUpperCase() + ' model type ' + this.attr.model);
    }
    return m;
};

Sub.prototype.nets = function (...aNets) {
    // Set nets
    assert_arguments_length(arguments, 1, 1, 'sub.nets(array)');
    if (Array.isArray(aNets) && Array.isArray(aNets[0])) {
        aNets = aNets[0]; // allow both nets(1,2,3) and nets([1,2,3])
    } else {
        if (arguments.length === 1 && Array.isArray(arguments[0])) {
            aNets = Array.from(arguments);
        }
    }
    assert_array(aNets, '...nets', 'sub.nets(...nets)');
    assert_array_of_nets(aNets, '...nets', 'sub.nets(...nets)');
    this.attr.nets = aNets;
    return this;
};

Sub.prototype.params = function (aParams) {
    // Set parameters
    assert_arguments_length(arguments, 1, 1, 'sub.params(value)');
    assert_object(aParams, 'value', 'sub.params(value)');
    this.attr.params = aParams;
    return this;
};

Sub.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'sub.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        model: {type: "string", required: true, min: 0, max: 100, alphanumeric: true, startalpha: !true},
        nets: {type: "array_of_nets", required: true},
        params: {type: "object_of_eng"}
    });
    device_attr_assign(this, this.attr);
};

Sub.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'sub.get_nets()');
    var i, n = {};
    if (this.attr.nets) {
        for (i = 0; i < this.attr.nets.length; i++) {
            n[i] = this.attr.nets[i];
        }
    }
    return n;
};

Sub.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'sub.get_value()');
    this.validate();
    return this.attr.model;
};

Sub.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'sub.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Sub.prototype.find_sub_model = function () {
    // Find corresponding sub_model
    assert_arguments_length(arguments, 0, 0, 'sub.find_sub_model()');
    assert_string(this.attr.model, 'sub.attr.model', 'find_sub_model()');
    var t = this;
    return netlist_devices.find((d) => d.attr.name === t.attr.model);
};

Sub.prototype.render = function () {
    // Render spice netlist for this sub
    assert_arguments_length(arguments, 0, 0, 'sub.render()');
    this.validate();
    var spice = ['* ' + device_summary(this)];

    // params
    var a = '', k;
    for (k in this.attr.params) {
        a += k + '=' + eng(this.attr.params[k]) + ' ';
    }
    //echo('params=' + a);

    // check for extra parameters
    var m = find_model(this, '', this.attr.model);
    if (m.type !== 'spice_model') {
        for (k in this.attr.params) {
            if (this.attr.params.hasOwnProperty(k)) {
                if (!m.attr.params.hasOwnProperty(k)) {
                    hint('Similar parameters are: ' + similar_strings(k, Object.keys(m.attr.params).sort(), 5, true).join(', '));
                    hint('All parameters are: ' + Object.keys(m.attr.params).sort().join(', '));
                    throw new Exception('Subcircuit ' + this.attr.name + ' uses parameter "' + k + '" which is not present in model ' + this.attr.model);
                }
            }
        }
    }

    // check spice model declared nets
    if (m.type === 'spice_model' && m.declared_nets > 0) {
        if (m.declared_nets != this.attr.nets.length) {
            throw new Exception('Subcircuit ' + this.attr.name + ' uses ' + this.attr.nets.length + ' nets but spice model ' + this.attr.model + ' uses ' + m.declared_nets + ' nets');
        }
    }
    // check sub model nets
    if (m.type === 'sub_model') {
        if (m.attr.nets.length != this.attr.nets.length) {
            throw new Exception('Subcircuit ' + this.attr.name + ' uses ' + this.attr.nets.length + ' nets but model ' + this.attr.model + ' uses ' + m.attr.nets.length + ' nets');
        }
    }

    // render spice
    if (m.type === 'sub_model' || m.type === 'spice_model') {
        spice.push("x_" + this.attr.name + ' ' + this.attr.nets.join(' ') + ' ' + this.attr.model + ' ' + a);
        return spice.join('\n');
    }
    return spice.join('\n');
};

globalThis.exports = {Sub,sub};
Internal.Sub = Sub;
globalThis.sub = sub;
Internal.device_constructor.sub = sub;
