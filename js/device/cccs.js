// Current Controlled Current Source (FXXX)
// linter: ngspicejs-lint --internal
"use strict";

function CCCS(aName, aAnode, aCathode, aVname, aGain) {
    // Constructor
    assert_arguments_length(arguments, 0, 5, 'cccs(name,anode,cathode,vname,gain)');
    this.type = 'cccs';
    this.expected_prefix = ['F'];
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
    if (aVname !== undefined) {
        this.vname(aVname);
    }
    if (aGain !== undefined) {
        this.gain(aGain);
    }
}

function cccs(aName, aAnode, aCathode, aVname, aGain) {
    // Add cccs to netlist
    assert_arguments_length(arguments, 0, 5, 'cccs(name,anode,cathode,vname,gain)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new CCCS(aName);
    }
    return new CCCS(aName, aAnode, aCathode, aVname, aGain);
}

CCCS.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'cccs.name(name,allow_this_prefix)');
    assert_name(aName, 'cccs');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

CCCS.prototype.anode = function (aNet) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'cccs.anode(net)');
    assert_net(aNet, 'net', 'cccs.anode(net)');
    this.attr.anode = aNet;
    return this;
};

CCCS.prototype.cathode = function (aNet) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'cccs.cathode(net)');
    assert_net(aNet, 'net', 'cccs.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

CCCS.prototype.vname = function (aNet) {
    // Set name of zero voltage source used to measure current
    assert_arguments_length(arguments, 1, 1, 'cccs.vname(value)');
    this.attr.vname = aNet;
    return this;
};

CCCS.prototype.gain = function (aValue) {
    // Set gain
    assert_arguments_length(arguments, 1, 1, 'cccs.gain(value)');
    this.attr.gain = eng(aValue, 1, 'cccs.gain(value)');
    return this;
};

CCCS.prototype.poly = function (aVoltageSourceNames, aCoef) {
    // Set poly
    if (arguments.length === 1 && typeof aVoltageSourceNames === 'object' && aVoltageSourceNames.type === 'poly') {
        assert_poly(aVoltageSourceNames);
        this.attr.poly = aVoltageSourceNames;
        return this;
    }
    assert_arguments_length(arguments, 2, 2, 'cccs.poly(vnames,coef)');
    assert_array_of_strings_or_numbers(aVoltageSourceNames, 'vnames', 'cccs.poly(vnames,coef)');
    assert_array_of_numbers(aCoef, 'coef', 'cccs.poly(vnames,coef)', true);
    this.attr.poly = this.attr.poly || {};
    this.attr.poly.type = 'poly';
    this.attr.poly.dimension = aVoltageSourceNames.length;
    this.attr.poly.names = aVoltageSourceNames;
    this.attr.poly.coef = aCoef;
    this.attr.poly.code = 'POLY(' + this.attr.poly.dimension + ') ' + aVoltageSourceNames.map((a) => 'V_' + a).join(' ') + ' ' + aCoef.join(' ');
    return this;
};

CCCS.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'cccs.validate()');
    if (this.attr.poly) {
        device_attr_check(this, this.attr, {
            name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
            anode: {type: "net", required: true},
            cathode: {type: "net", required: true},
            vname: {type: "string"},
            poly: {type: "poly"}
        });
    } else {
        device_attr_check(this, this.attr, {
            name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
            anode: {type: "net", required: true},
            cathode: {type: "net", required: true},
            vname: {type: "string", required: true},
            gain: {type: "number", min: -Infinity, max: Infinity, required: true, eng: true, equation: true}
        });
    }
    device_attr_assign(this, this.attr);
};

CCCS.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'cccs.get_nets()');
    if (this.attr.poly) {
        return {
            anode: this.attr.anode,
            cathode: this.attr.cathode
        };
    }
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

CCCS.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'cccs.get_value()');
    this.validate();
    return this.attr.vname + ' ' + (this.attr.gain || 'poly');
};

CCCS.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'cccs.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

CCCS.prototype.render = function () {
    // Render spice netlist for this cccs
    assert_arguments_length(arguments, 0, 0, 'cccs.render()');
    var spice = [];
    var i, cs;

    // poly checks
    if (!this.attr.poly) {
        for (i = 0; i < this.netlist_devices.length; i++) {
            if (this.netlist_devices[i].attr.name === this.attr.vname) {
                cs = this.netlist_devices[i];
            }
        }
        if (!cs) {
            hint('Controlling source (typically ammeter) that could not be found is "' + this.attr.vname + '"');
            if (Ammeter.ammeters.length > 0) {
                hint('Available ammeters are: ' + Ammeter.ammeters.map((a) => a.attr.name).join(', '));
            } else {
                hint("There are no available ammeters, use: ammeter('A1', anode, cathode)");
            }
            hint('You can also use any voltage source, available are: ' + this.netlist_devices.filter((a) => a.is_voltage_source).map((a) => a.attr.name).join(', '));
            throw new Exception("Current controlled current source '" + this.attr.name + "' could not find ammeter '" + this.attr.vname + "'");
        }
    }

    spice.push("* cccs " + this.attr.name + ' ' + JSON.stringify(this.attr));
    if (this.attr.poly) {
        spice.push("F_" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' ' + this.attr.poly.code);
    } else {
        var g = this.attr.gain;
        if (is_equation(g)) {
            g = equation(g);
            g.check_params(this);
        }
        spice.push("F_" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' V_' + this.attr.vname + ' ' + g);
    }
    return spice.join('\n');
};

globalThis.exports = {CCCS,cccs};
Internal.CCCS = CCCS;
globalThis.cccs = cccs;
Internal.device_constructor.cccs = cccs;
