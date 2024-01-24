// Inductor
// linter: ngspicejs-lint --internal
"use strict";

function Inductor(aName, aAnode, aCathode, aL, aRs, aCp) {
    // Constructor
    assert_arguments_length(arguments, 0, 6, 'inductor(name,anode,cathode,l,rs,cp)');
    this.type = 'inductor';
    Inductor.inductors.push(this);
    this.expected_prefix = ['L'];
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
    if (aL !== undefined) {
        this.l(aL);
    }
    if (aRs !== undefined) {
        this.rs(aRs);
    }
    if (aCp !== undefined) {
        this.cp(aCp);
    }
}

Inductor.inductors = [];

function inductor(aName, aAnode, aCathode, aL, aRs, aCp) {
    // Add inductor to netlist
    assert_arguments_length(arguments, 0, 6, 'inductor(name,anode,cathode,l,rs,cp)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Inductor(aName);
    }
    return new Inductor(aName, aAnode, aCathode, aL, aRs, aCp);
}

Inductor.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'inductor.name(name,allow_this_prefix)');
    assert_name(aName, 'inductor');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Inductor.prototype.anode = function (aNet) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'inductor.anode(net)');
    assert_net(aNet, 'net', 'inductor.anode(net)');
    this.attr.anode = aNet;
    return this;
};

Inductor.prototype.cathode = function (aNet) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'inductor.cathode(net)');
    assert_net(aNet, 'net', 'inductor.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

Inductor.prototype.l = function (aL) {
    // Set inductance
    assert_arguments_length(arguments, 1, 1, 'inductor.l(inductance)');
    this.attr.l = eng(aL, 1, 'inductor.l(value)');
    return this;
};

Inductor.prototype.rs = function (aRs) {
    // Set series resistance
    assert_arguments_length(arguments, 1, 1, 'inductor.rs(resistance)');
    this.attr.rs = eng(aRs, 1, 'inductor.rs(value)');
    return this;
};

Inductor.prototype.cp = function (aCp) {
    // Set parallel capacitance
    assert_arguments_length(arguments, 1, 1, 'inductor.cp(capacitance)');
    this.attr.cp = eng(aCp, 1, 'inductor.cp(value)');
    return this;
};

Inductor.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'inductor.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        l: {type: "number", min: 1e-15, max: 3000, eng: true, equation: true},
        rs: {type: "number", min: 0.01, max: 1e9, eng: true, equation: true, zero: true},
        cp: {type: "number", min: 1e-15, max: 10, eng: true, equation: true, zero: true}
    });
    device_attr_assign(this, this.attr);
};

Inductor.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'inductor.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Inductor.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'inductor.get_value()');
    return this.attr.l.toEng();
};

Inductor.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'inductor.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    Inductor.inductors.splice(Inductor.inductors.indexOf(this), 1);
    return this;
};

Inductor.prototype.alter = function () {
    // Alter value without uploading netlist, only to be used with ac.fast, don't use this unless you need performance
    // WARNING: using this requires deep understanding of ngspicejs!!!
    assert_arguments_length(arguments, 0, 0, 'inductor.alter()');
    this.validate();
    assert_equal(this.attr.model, undefined, 'model', 'inductor.alter() - currently only ideal inductor is supported');
    assert_equal(this.attr.ls, undefined, 'ls', 'inductor.alter() - currently only ideal inductor is supported');
    assert_equal(this.attr.cp, undefined, 'cp', 'inductor.alter() - currently only ideal inductor is supported');
    assert_number(this.attr.l, 'inductor.attr.l', 'inductor.alter()');
    ngspice_command('alter L_' + this.attr.name + ' = ' + this.attr.l);
    return this;
};

Inductor.prototype.render = function () {
    // Render spice netlist for this device
    assert_arguments_length(arguments, 0, 0, 'inductor.render()');
    var spice = [];
    spice.push("* inductor " + this.attr.name);
    if (this.attr.cp || this.attr.rs) {
        spice.push(".subckt sub_inductor_" + this.attr.name + " a b");
        if (this.attr.rs) {
            spice.push(" L_L0 a 1 " + this.attr.l + " NT=1");
            spice.push(" R_Rs 1 b " + this.attr.rs);
        } else {
            spice.push(" L_L0 a b " + this.attr.l + " NT=1");
        }
        this.coupling_name = 'l.x_' + this.attr.name.toLowerCase() + '.l_l0';
        if (this.attr.cp) {
            spice.push(" C_Cp a b " + this.attr.cp);
        }
        spice.push(".ends sub_inductor_" + this.attr.name);
        spice.push("x_" + this.attr.name + " " + this.attr.anode + " " + this.attr.cathode + " sub_inductor_" + this.attr.name);
    } else {
        // ideal
        spice.push("L_" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' ' + this.attr.l);
        this.coupling_name = 'l_' + this.attr.name.toLowerCase();
    }
    return spice.join('\n');
};

globalThis.exports = {inductor,Inductor};
Internal.Inductor = Inductor;
globalThis.inductor = inductor;
Internal.device_constructor.inductor = inductor;
