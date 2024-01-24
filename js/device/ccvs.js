// Current Controlled Voltage Source (HXXX)
// linter: ngspicejs-lint --internal
"use strict";

function CCVS(aName, aAnode, aCathode, aVname, aGain) {
    // Constructor
    assert_arguments_length(arguments, 0, 5, 'ccvs(name,anode,cathode,vname,gain)');
    this.type = 'ccvs';
    this.expected_prefix = ['H'];
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

function ccvs(aName, aAnode, aCathode, aVname, aGain) {
    // Add ccvs to netlist
    assert_arguments_length(arguments, 0, 5, 'ccvs(name,anode,cathode,vname,gain)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new CCVS(aName);
    }
    return new CCVS(aName, aAnode, aCathode, aVname, aGain);
}

CCVS.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'ccvs.name(name,allow_this_prefix)');
    assert_name(aName, 'ccvs');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

CCVS.prototype.anode = function (aNet) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'ccvs.anode(net)');
    assert_net(aNet, 'net', 'ccvs.anode(net)');
    this.attr.anode = aNet;
    return this;
};

CCVS.prototype.cathode = function (aNet) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'ccvs.cathode(value)');
    assert_net(aNet, 'net', 'ccvs.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

CCVS.prototype.vname = function (aVoltageSourceName) {
    // Set zero voltage name used to measure current
    assert_arguments_length(arguments, 1, 1, 'ccvs.vname(voltage_source_name)');
    this.attr.vname = aVoltageSourceName;
    return this;
};

CCVS.prototype.gain = function (aValue) {
    // Set gain
    assert_arguments_length(arguments, 1, 1, 'ccvs.gain(value)');
    this.attr.gain = eng(aValue, 1, 'ccvs.gain(value)');
    return this;
};

CCVS.prototype.poly = function (aVoltageSourceNames, aCoef) {
    // Set poly
    if (arguments.length === 1 && typeof aVoltageSourceNames === 'object' && aVoltageSourceNames.type === 'poly') {
        assert_poly(aVoltageSourceNames);
        this.attr.poly = aVoltageSourceNames;
        return this;
    }
    assert_arguments_length(arguments, 2, 2, 'ccvs.poly(vnames, coef)');
    assert_array_of_strings_or_numbers(aVoltageSourceNames, 'vnames', 'ccvs.poly(vnames,coef)');
    assert_array_of_numbers(aCoef, 'coef', 'ccvs.poly(vnames,coef)', true);
    this.attr.poly = this.attr.poly || {};
    this.attr.poly.type = 'poly';
    this.attr.poly.dimension = aVoltageSourceNames.length;
    this.attr.poly.names = aVoltageSourceNames;
    this.attr.poly.coef = aCoef;
    this.attr.poly.code = 'POLY(' + this.attr.poly.dimension + ') ' + aVoltageSourceNames.map((a) => 'V_' + a).join(' ') + ' ' + aCoef.join(' ');
    return this;
};

CCVS.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'ccvs.validate()');
    if (this.attr.poly) {
        device_attr_check(this, this.attr, {
            name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
            anode: {type: "net", required: true},
            cathode: {type: "net", required: true},
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

CCVS.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'ccvs.get_nets()');
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

CCVS.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'ccvs.get_value()');
    this.validate();
    return this.attr.vname ? (this.attr.vname + ' ' + (this.attr.gain || 'poly')) : 'poly';
};

CCVS.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'ccvs.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

CCVS.prototype.render = function () {
    // Render spice netlist for this ccvs
    assert_arguments_length(arguments, 0, 0, 'ccvs.render()');
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

    spice.push("* ccvs " + this.attr.name);
    if (this.attr.poly) {
        spice.push("H_" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' ' + this.attr.poly.code);
    } else {
        spice.push("H_" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' V_' + this.attr.vname + ' ' + this.attr.gain);
    }
    return spice.join('\n');
};

globalThis.exports = {CCVS, ccvs};
Internal.CCVS = CCVS;
globalThis.ccvs = ccvs;
Internal.device_constructor.ccvs = ccvs;
