// Resistor
// linter: ngspicejs-lint --internal
"use strict";

function Resistor(aName, aAnode, aCathode, aR, aLs, aCp) {
    // Constructor
    assert_arguments_length(arguments, 0, 6, 'resistor(name,anode,cathode,r,ls,cp)');
    this.type = 'resistor';
    this.expected_prefix = ['R', 'LOAD'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = false;
    this.attr = {};
    // single attr value, e.g. device({name: 'D1', anode: 1, cathode: 2, ...});
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
    if (aR !== undefined) {
        this.r(aR);
    }
    if (aLs !== undefined) {
        this.ls(aLs);
    }
    if (aCp !== undefined) {
        this.cp(aCp);
    }
}

function resistor(aName, aAnode, aCathode, aR, aLs, aCp) {
    // Add resistor to netlist
    assert_arguments_length(arguments, 0, 6, 'resistor(name,anode,cathode,r,ls,cp)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Resistor(aName);
    }
    return new Resistor(aName, aAnode, aCathode, aR, aLs, aCp);
}

Resistor.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'resistor.name(name,allow_this_prefix)');
    assert_name(aName, 'resistor');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Resistor.prototype.anode = function (aNet) {
    // Set anode net
    assert_arguments_length(arguments, 1, 1, 'resistor.anode(net)');
    assert_net(aNet, 'net', 'resistor.anode(net)');
    this.attr.anode = aNet;
    return this;
};

Resistor.prototype.cathode = function (aNet) {
    // Set cathode net
    assert_arguments_length(arguments, 1, 1, 'resistor.cathode(net)');
    assert_net(aNet, 'net', 'resistor.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

Resistor.prototype.r = function (aValue) {
    // set resistance
    assert_arguments_length(arguments, 1, 1, 'resistor.r(value)');
    this.attr.r = eng(aValue, 1, 'resistor.r(value)');
    /*
    if (is_equation(aValue)) {
        this.attr.r = equation(aValue);
    } else if (is_compiled_equation(aValue)) {
        this.attr.r = aValue;
    } else {
        this.attr.r = eng(aValue, 1, 'resistor.r(value)');
    }
    */
    return this;
};

Resistor.prototype.ls = function (aValue) {
    // Set series inductance
    assert_arguments_length(arguments, 1, 1, 'resistor.ls(value)');
    this.attr.ls = eng(aValue, 1, 'resistor.ls(value)');
    return this;
};

Resistor.prototype.cp = function (aValue) {
    // Set parallel capacitance
    assert_arguments_length(arguments, 1, 1, 'resistor.cp(value)');
    this.attr.cp = eng(aValue, 1, 'resistor.cp(value)');
    return this;
};

Resistor.prototype.model = function (aModel) {
    // Set model name
    assert_arguments_length(arguments, 1, 1, 'resistor.model(model)');
    assert_string(aModel, 'model', 'resistor.model(model)');
    this.attr.model = aModel;
    assert_model_exists(this, this.type.toUpperCase(), aModel);
    return this;
};

Resistor.prototype.get_model = function () {
    // Get model device specified by this device
    assert_arguments_length(arguments, 0, 0, 'resistor.get_model()');
    assert_string(this.attr.model, this.attr.name + ' ' + this.type + '.attr.model');
    var m = find_model(this, this.type.toUpperCase(), this.attr.model);
    if (!m) {
        hint('Unlike spice, models needs to be defined before they are used!');
        throw new Exception('Unknown ' + this.type.toUpperCase() + ' model type ' + this.attr.model);
    }
    return m;
};

Resistor.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'resistor.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        r: {type: "number", min: 0.0001, max: 1e20, required: true, eng: true, equation: true, message_min: 'Below 0.001 ohm, use CCVS as transconductance'},
        cp: {type: "number", min: 1e-21, max: 10, equation: true, zero: true},
        ls: {type: "number", min: 1e-12, max: 3000, equation: true, zero: true},
        model: {type: "string", min: 0, max: 100}
    });
    device_attr_assign(this, this.attr);
};

Resistor.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'resistor.remove()');
    var i = this.netlist_devices.indexOf(this);
    if (i >= 0) {
        this.netlist_devices.splice(i, 1);
        return;
    }
    error('Cannot remove resistor ' + this.attr.name + ' from netlist because it is not there!');
};

Resistor.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'resistor.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Resistor.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'resistor.get_value()');
    return this.attr.r && this.attr.r.toEng();
};

Resistor.prototype.remove = function () {
    // remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'resistor.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Resistor.prototype.alter = function () {
    // Alter value without uploading netlist, only to be used with ac.fast, don't use this unless you need performance
    // WARNING: using this requires deep understanding of ngspicejs!!!
    assert_arguments_length(arguments, 0, 0, 'resistor.alter()');
    this.validate();
    assert_equal(this.attr.model, undefined, 'model', 'resistor.alter() - currently only ideal resistor is supported');
    assert_equal(this.attr.ls, undefined, 'ls', 'resistor.alter() - currently only ideal resistor is supported');
    assert_equal(this.attr.cp, undefined, 'cp', 'resistor.alter() - currently only ideal resistor is supported');
    assert_number(this.attr.r, 'resistor.attr.r', 'resistor.alter()');
    ngspice_command('alter R_' + this.attr.name + ' = ' + this.attr.r);
    return this;
};

Resistor.prototype.render = function () {
    // Render spice netlist for this device
    assert_arguments_length(arguments, 0, 0, 'resistor.render()');
    this.validate();
    var rmod;
    if (this.attr.model) {
        rmod = ResistorModel.models.find((a) => a.attr.name === this.attr.model);
        if (!rmod) {
            hint('Available resistor models are: ' + ResistorModel.models.map((a) => a.attr.name).sort().join(', '));
            error('Resistor ' + this.attr.name + ' require resistor model ' + this.attr.model + ' but such resistor model not found');
        }
    }
    var spice = [];
    if ((this.attr.ls !== undefined && this.attr.ls !== 0) || this.attr.cp) {
        spice.push(".subckt sub_resistor_" + this.attr.name + " a b");
        if (this.attr.ls) {
            spice.push(" L_Ls a 1 " + this.attr.ls + " NT=1");
            spice.push(" R_R0 1 b " + this.attr.r);
            this.coupling_name = 'l.x_' + this.attr.name.toLowerCase() + '.l_ls';
        } else {
            spice.push(" R_R0 a b " + this.attr.r);
        }
        if (this.attr.cp) {
            spice.push(" C_Cp a b " + this.attr.cp);
        }
        spice.push(".ends sub_resistor_" + this.attr.name);
        spice.push("x_" + this.attr.name + " " + this.attr.anode + " " + this.attr.cathode + " sub_resistor_" + this.attr.name);
        return spice.join('\n');
    }
    spice.push("R_" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' ' + this.attr.r + (this.attr.model ? ' R' + this.attr.model : ''));
    return spice.join('\n');
};

globalThis.resistor = resistor;
Internal.Resistor = Resistor;
globalThis.exports = {Resistor,resistor};
Internal.device_constructor.resistor = resistor;
