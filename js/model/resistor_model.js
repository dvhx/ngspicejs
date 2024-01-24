// Resistor model
// linter: ngspicejs-lint --internal
"use strict";

function ResistorModel(aNameOrObj) {
    // Constructor
    this.type = 'resistor_model';
    this.expected_prefix = [];
    netlist_devices.push(this);
    this.netlist_devices = netlist_devices;
    this.is_net_device = false;
    this.is_voltage_source = false;
    this.is_model = true;
    this.attr = {};
    ResistorModel.models.push(this);
    // single attr value, e.g. resistor_model({name: 'D1', ...});
    if (arguments.length === 1 && typeof aNameOrObj === 'object') {
        this.attr = aNameOrObj;
        this.validate();
        return;
    }
    // individual arguments
    if (aNameOrObj !== undefined && typeof aNameOrObj === 'string') {
        this.name(aNameOrObj);
    }
}

ResistorModel.models = [];

function resistor_model(aNameOrObj) {
    // Add resistor model to netlist
    if (arguments.length === 1 && typeof aNameOrObj === 'object') {
        return new ResistorModel(aNameOrObj);
    }
    return new ResistorModel(aNameOrObj);
}

ResistorModel.prototype.name = function (aName) {
    // Set name
    assert_name(aName, 'resistor_model');
    assert_name_unique(aName, this, this.netlist_devices);
    this.attr.name = aName;
    return this;
};

ResistorModel.prototype.tc1 = function (aValue) {
    this.attr.tc1 = eng(aValue, 1, 'resistor_model.tc1(value)');
    return this;
};

ResistorModel.prototype.tc2 = function (aValue) {
    this.attr.tc2 = eng(aValue, 1, 'resistor_model.tc2(value)');
    return this;
};

ResistorModel.prototype.rsh = function (aValue) {
    this.attr.rsh = eng(aValue, 1, 'resistor_model.rsh(value)');
    return this;
};

ResistorModel.prototype.defw = function (aValue) {
    this.attr.defw = eng(aValue, 1, 'resistor_model.defw(value)');
    return this;
};

ResistorModel.prototype.narrow = function (aValue) {
    this.attr.narrow = eng(aValue, 1, 'resistor_model.narrow(value)');
    return this;
};

ResistorModel.prototype.short = function (aValue) {
    this.attr.short = eng(aValue, 1, 'resistor_model.short(value)');
    return this;
};

ResistorModel.prototype.tnom = function (aValue) {
    this.attr.tnom = eng(aValue, 1, 'resistor_model.tnom(value)');
    return this;
};

ResistorModel.prototype.kf = function (aValue) {
    this.attr.kf = eng(aValue, 1, 'resistor_model.kf(value)');
    return this;
};

ResistorModel.prototype.af = function (aValue) {
    this.attr.af = eng(aValue, 1, 'resistor_model.af(value)');
    return this;
};

ResistorModel.prototype.wf = function (aValue) {
    this.attr.wf = eng(aValue, 1, 'resistor_model.wf(value)');
    return this;
};

ResistorModel.prototype.lf = function (aValue) {
    this.attr.lf = eng(aValue, 1, 'resistor_model.lf(value)');
    return this;
};

ResistorModel.prototype.ef = function (aValue) {
    this.attr.ef = eng(aValue, 1, 'resistor_model.ef(value)');
    return this;
};

ResistorModel.prototype.r = function (aValue) {
    this.attr.r = eng(aValue, 1, 'resistor_model.r(value)');
    return this;
};

ResistorModel.prototype.validate = function () {
    // Validate attributes
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: !true},
        tc1: {type: "number", min: -1000, max: 1000, eng: true, equation: true},
        tc2: {type: "number", min: -1000, max: 1000, eng: true, equation: true},
        rsh: {type: "number", min: 0, max: 1e15, eng: true, equation: true},
        defw: {type: "number", min: 0, max: 1, eng: true, equation: true},
        narrow: {type: "number", min: 0, max: 1, eng: true, equation: true},
        short: {type: "number", min: 0, max: 1, eng: true, equation: true},
        tnom: {type: "number", min: -273.15, max: 3000, eng: true, equation: true},
        kf: {type: "number", min: 0, max: 1, eng: true, equation: true},
        af: {type: "number", min: 0, max: 1, eng: true, equation: true},
        wf: {type: "number", min: 0, max: 1, eng: true, equation: true},
        lf: {type: "number", min: 0, max: 1, eng: true, equation: true},
        ef: {type: "number", min: 0, max: 1, eng: true, equation: true},
        r: {type: "number", min: 0.001, max: 1e15, eng: true, equation: true}
    });
};

ResistorModel.prototype.remove = function () {
    // Remove this device from netlist
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    ResistorModel.models.splice(ResistorModel.models.indexOf(this), 1);
    return this;
};

ResistorModel.prototype.render = function () {
    // Render spice netlist for this model
    this.validate();
    var spice = [];
    spice.push("* resistor model " + this.attr.name);
    var s = [];
    s = [];
    for (const [key, value] of Object.entries(this.attr)) {
        if (key !== 'name') {
            s.push(key + '=' + value);
        }
    }
    spice.push(".model R" + this.attr.name + ' R (' + s.join(' ') + ')');
    return spice.join('\n');
};

globalThis.exports = {ResistorModel, resistor_model};
globalThis.resistor_model = resistor_model;
Internal.ResistorModel = ResistorModel;
