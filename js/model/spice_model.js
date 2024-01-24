// Spice model device (e.g. darlington NPN made of two NPN tranzistors, injects spice code but knows kind and model so that it knows when model is available or not)
// linter: ngspicejs-lint --internal
"use strict";

function SpiceModel(aName, aKind, aSpice) {
    // Constructor
    this.type = 'spice_model';
    this.expected_prefix = [];
    netlist_devices.push(this);
    this.netlist_devices = netlist_devices;
    this.is_net_device = false;
    this.is_voltage_source = false; // ???
    this.is_model = true;
    this.attr = {};
    assert_arguments_length(arguments, 1, 3, 'spice_model(name,kind,spice)');
    SpiceModel.models.push(this);
    // single attr value, e.g. spice_model({name: 'D1', ...});
    if (arguments.length === 1 && typeof aName === 'object') {
        this.attr = aName;
        this.validate();
        return;
    }
    // individual arguments
    if (aName !== undefined) {
        this.name(aName);
    }
    if (aKind !== undefined) {
        this.kind(aKind);
    }
    if (aSpice !== undefined) {
        this.spice(aSpice);
    }
}

function spice_model(aName, aKind, aSpice) {
    // Add spice subcircuit to netlist and register it as a model with name and kind
    assert_arguments_length(arguments, 1, 3, 'spice_model(name,kind,spice)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new SpiceModel(aName);
    }
    return new SpiceModel(aName, aKind, aSpice);
}

SpiceModel.models = [];

SpiceModel.prototype.name = function (aName) {
    // Set name
    assert_name(aName, 'spice_model');
    assert_name_unique(aName, this, this.netlist_devices);
    this.attr.name = aName;
    return this;
};

SpiceModel.prototype.kind = function (aKind) {
    // Set kind
    assert_string(aKind, 'kind', 'spice_model.kind(kind)');
    this.attr.kind = aKind;
    return this;
};

SpiceModel.prototype.spice = function (aSpice) {
    // Set spice code
    assert_string(aSpice, 'spice', 'spice_model.spice(spice)');
    this.attr.spice = aSpice;
    return this;
};

SpiceModel.prototype.validate = function () {
    // Validate attributes
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: !true},
        kind: {type: "string", required: true, allowed: ['NPN', 'PNP', 'OPAMP', 'CUSTOM', 'TIMER', 'VREF', 'MOSFET_N', 'MOSFET_P', 'JFET_N', 'DIODE', 'MIC', 'OTHER']},
        spice: {type: "string", required: true, min: 0, max: Infinity, alphanumeric: false, startalpha: false}
    });
};

SpiceModel.prototype.require_model = function (aKind, aModel) {
    // Spice model is "dumb string" ngspicejs does not know what's in it and cannot know that some model is required, so this explicitly includes that model
    assert_arguments_length(arguments, 2, 2, 'spice_model.require_model(kind, model)');
    assert_string(aKind, 'kind', 'spice_model.require_model(kind, model)');
    assert_string(aModel, 'model', 'spice_model.require_model(kind, model)');
    Internal.require_model(aKind, aModel);
    return this;
};

SpiceModel.prototype.remove = function () {
    // Remove this device from netlist
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    SpiceModel.models.splice(SpiceModel.models.indexOf(this), 1);
    return this;
};

SpiceModel.prototype.render = function () {
    // Render spice netlist
    this.validate();
    var spice = [];
    // handle * REQUIRE KIND MODEL - so that subcircuit can request models
    var lines = this.attr.spice.split('\n');
    var i;
    for (i = 0; i < lines.length; i++) {
        var m = lines[i].match(/\* REQUIRE ([A-Z0-9_]+) ([A-Z0-9_]+)/);
        if (!m && lines[i].match(/\* REQUIRE ([A-Z0-9_]+)/)) {
            hint('example: * REQUIRE JFET_N J201');
            hint('example: * REQUIRE DIODE 1N4148');
            hint('example: * REQUIRE NPN BC547');
            hint('example: * REQUIRE BC547 <-- this is wrong, kind is missing');
            throw new Exception("If you use '* REQUIRE <KIND> <MODEL>' in spice subcircuit '" + this.attr.name + "', you need to specify both kind and model");
        }
        if (m && m.length >= 2) {
            m = find_model(this, m[1], m[2]);
            if (!m) {
                throw new Exception('Spice model required model ' + m[1] + ' ' + m[2] + ' could not be found!');
            }
            //request_model(m[1], m[2]);
        }
    }
    spice.push("* spice model " + this.attr.name + " of kind " + this.attr.kind);
    spice = spice.concat(this.attr.spice.trim().split('\n'));
    return spice.join('\n');
};

globalThis.exports = {SpiceModel, spice_model};
globalThis.spice_model = spice_model;
Internal.SpiceModel = SpiceModel;
