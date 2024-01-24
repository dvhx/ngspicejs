// Capacitor
// linter: ngspicejs-lint --internal
"use strict";

function Capacitor(aName, aAnode, aCathode, aC, aRs, aRp, aLs) {
    // Constructor
    assert_arguments_length(arguments, 0, 7, 'capacitor(name,anode,cathode,c,rs,ls)');
    this.type = 'capacitor';
    this.expected_prefix = ['C'];
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
    if (aC !== undefined) {
        this.c(aC);
    }
    if (aRs !== undefined) {
        this.rs(aRs);
    }
    if (aRp !== undefined) {
        this.rp(aRp);
    }
    if (aLs !== undefined) {
        this.ls(aLs);
    }
}

function capacitor(aName, aAnode, aCathode, aC, aRs, aRp, aLs) {
    // Add capacitor to netlist
    assert_arguments_length(arguments, 0, 7, 'capacitor(name,anode,cathode,c,rs,rp,ls)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Capacitor(aName);
    }
    return new Capacitor(aName, aAnode, aCathode, aC, aRs, aRp, aLs);
}

Capacitor.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'capacitor.name(name,allow_this_prefix)');
    assert_name(aName, 'capacitor');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Capacitor.prototype.anode = function (aNet) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'capacitor.anode(net)');
    assert_net(aNet, 'net', 'capacitor.anode(net)');
    this.attr.anode = aNet;
    return this;
};

Capacitor.prototype.cathode = function (aNet) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'capacitor.cathode(net)');
    assert_net(aNet, 'net', 'capacitor.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

Capacitor.prototype.c = function (aValue) {
    // Set capacitance
    assert_arguments_length(arguments, 1, 1, 'capacitor.c(capacitance)');
    this.attr.c = eng(aValue, 1, 'capacitor.c(capacitance)');
    return this;
};

Capacitor.prototype.rs = function (aValue) {
    // Set series resistance
    assert_arguments_length(arguments, 1, 1, 'capacitor.rs(resistance)');
    this.attr.rs = eng(aValue, 1, 'capacitor.rs(value)');
    return this;
};

Capacitor.prototype.rp = function (aValue) {
    // Set parallel resistance
    assert_arguments_length(arguments, 1, 1, 'capacitor.rp(resistance)');
    this.attr.rp = eng(aValue, 1, 'capacitor.rp(resistance)');
    return this;
};

Capacitor.prototype.ls = function (aValue) {
    // Set series inductance
    assert_arguments_length(arguments, 1, 1, 'capacitor.ls(inductance)');
    this.attr.ls = eng(aValue, 1, 'capacitor.ls(inductance)');
    return this;
};

Capacitor.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'capacitor.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        c: {type: "number", min: 1e-21, max: 10, eng: true, equation: true, required: true},
        rs: {type: "number", min: 0.01, max: 1e9, eng: true, equation: true, zero: true},
        rp: {type: "number", min: 0.01, max: 1e20, eng: true, equation: true, zero: true},
        ls: {type: "number", min: 1e-12, max: 3000, eng: true, equation: true, zero: true}
    });
    device_attr_assign(this, this.attr);
};

Capacitor.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'capacitor.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Capacitor.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'capacitor.get_value()');
    return this.attr.c.toEng();
};

Capacitor.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'capacitor.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Capacitor.prototype.alter = function () {
    // Alter value without uploading netlist, only to be used with ac.fast, don't use this unless you need performance
    // WARNING: using this requires deep understanding of ngspicejs!!!
    assert_arguments_length(arguments, 0, 0, 'capacitor.alter()');
    this.validate();
    assert_equal(this.attr.model, undefined, 'model', 'capacitor.alter() - currently only ideal capacitor is supported');
    assert_equal(this.attr.rs, undefined, 'rs', 'capacitor.alter() - currently only ideal capacitor is supported');
    assert_equal(this.attr.rp, undefined, 'rp', 'capacitor.alter() - currently only ideal capacitor is supported');
    assert_equal(this.attr.cp, undefined, 'cp', 'capacitor.alter() - currently only ideal capacitor is supported');
    assert_number(this.attr.c, 'capacitor.attr.c', 'capacitor.alter()');
    ngspice_command('alter C_' + this.attr.name + ' = ' + this.attr.c);
    return this;
};

Capacitor.prototype.render = function () {
    // Render spice netlist for this device
    assert_arguments_length(arguments, 0, 0, 'capacitor.render()');
    //var eq = render_equations(this, ['c', 'rs', 'rp', 'ls']);
    //echo_json(eq);
    var spice = [];
    spice.push("* capacitor " + this.attr.name);
    if (this.attr.ls || this.attr.rs || this.attr.rp) {
        spice.push(".subckt sub_capacitor_" + this.attr.name + " a b");
        if (this.attr.rs && this.attr.ls) {
            // C L R
            spice.push("* variant 1");
            spice.push(" C0 a 1 " + this.attr.c);
            spice.push(" L0 1 2 " + this.attr.ls + " NT=1");
            spice.push(" Rs 2 b " + this.attr.rs);
        } else if (this.attr.ls) {
            // C L
            spice.push("* variant 2");
            spice.push(" C0 a 1 " + this.attr.c);
            spice.push(" L0 1 b " + this.attr.ls + " NT=1");
        } else if (this.attr.rs) {
            // C Rs
            spice.push("* variant 3");
            spice.push(" C0 a 1 " + this.attr.c);
            spice.push(" Rs 1 b " + this.attr.rs);
        } else {
            // C
            spice.push("* variant 4");
            spice.push(" C0 a b " + this.attr.c);
        }
        if (this.attr.rp) {
            spice.push(" Rp a b " + this.attr.rp);
        }
        spice.push(".ends sub_capacitor_" + this.attr.name);
        spice.push("x_" + this.attr.name + " " + this.attr.anode + " " + this.attr.cathode + " sub_capacitor_" + this.attr.name);
    } else {
        // ideal
        spice.push("C_" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' ' + this.attr.c);
    }
    return spice.join('\n');
};

globalThis.exports = {Capacitor, capacitor};
Internal.Capacitor = Capacitor;
globalThis.capacitor = capacitor;
Internal.device_constructor.capacitor = capacitor;
