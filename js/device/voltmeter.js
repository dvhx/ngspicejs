// Voltmeter
// linter: ngspicejs-lint --internal
"use strict";

function Voltmeter(aName, aAnode, aCathode, aR) {
    // Constructor
    assert_arguments_length(arguments, 0, 4, 'voltmeter(name,anode,cathode,r)');
    this.type = 'voltmeter';
    this.expected_prefix = ['V'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    Voltmeter.voltmeters.push(this);
    this.is_net_device = true;
    this.is_voltage_source = false; //?
    this.attr = {r: 100e9};
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
    if (aR !== undefined) {
        this.r(aR);
    }
}

Voltmeter.voltmeters = [];

function voltmeter(aName, aAnode, aCathode, aR) {
    // Add voltmeter to netlist
    assert_arguments_length(arguments, 0, 4, 'voltmeter(name,anode,cathode,r)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Voltmeter(aName);
    }
    return new Voltmeter(aName, aAnode, aCathode, aR);
}

Voltmeter.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'voltmeter.name(name,allow_this_prefix)');
    assert_name(aName, 'voltmeter');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Voltmeter.prototype.anode = function (aNet) {
    // Set anode net name
    assert_arguments_length(arguments, 1, 1, 'voltmeter.anode(net)');
    assert_net(aNet, 'net', 'voltmeter.anode(net)');
    this.attr.anode = aNet;
    return this;
};

Voltmeter.prototype.cathode = function (aNet) {
    // Set cathode net name
    assert_arguments_length(arguments, 1, 1, 'voltmeter.cathode(net)');
    assert_net(aNet, 'net', 'voltmeter.cathode(net)');
    this.attr.cathode = aNet;
    return this;
};

Voltmeter.prototype.r = function (aValue) {
    // Set voltmeter input resistance
    assert_arguments_length(arguments, 1, 1, 'voltmeter.r(value)');
    this.attr.r = eng(aValue, 1, 'resistor.r(value)');
    return this;
};

Voltmeter.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'voltmeter.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        r: {type: "number", min: 0, max: 1e20, eng: true, equation: true},
    });
    device_attr_assign(this, this.attr);
};

Voltmeter.prototype.render = function () {
    // Render spice netlist for this voltmeter
    assert_arguments_length(arguments, 0, 0, 'voltmeter.render()');
    var spice = [];
    spice.push("* voltmeter " + this.attr.name);
    spice.push("R_VOLTMETER_" + this.attr.name + ' ' + this.attr.anode + ' ' + this.attr.cathode + ' ' + this.attr.r);
    var ugly_name = 'v(' + this.attr.anode + ',' + this.attr.cathode + ')';
    if (this.attr.anode.toString() !== '0') {
        ugly_name = 'v(' + this.attr.anode + ')';
    } else {
        ugly_name = 'v(' + this.attr.cathode + ')';
    }
    return spice.join('\n');
};

Voltmeter.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'voltmeter.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Voltmeter.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'voltmeter.get_value()');
    this.validate();
    return '';
};

Voltmeter.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'voltmeter.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    Voltmeter.voltmeters.splice(Voltmeter.voltmeters.indexOf(this), 1);
    return this;
};

Voltmeter.prototype.process_data = function (aData) {
    // Add extra columns to TRAN data (for this voltmeter)
    assert_arguments_length(arguments, 1, 1, 'voltmeter.process_data(data)');
    var a, c, key, n, zero, arr_a, arr_c;
    // prepare zero array
    var any_vector = Object.keys(aData).filter(a => a !== 'time' && a !== 'frequency')[0];
    var len = aData[any_vector].length;
    var dimension = typeof aData[any_vector][0] === 'number' ? 1 : 2;
    //echo('any_vector', any_vector, len, dimension);
    zero = new Array(len);
    if (dimension === 1) {
        zero.fill(0);
    } else {
        zero.fill([0, 0]);
    }
    //echo_json(array_sub(a, b));
    a = this.attr.anode;
    c = this.attr.cathode;
    arr_a = aData['V(' + a + ')'];
    arr_c = aData['V(' + c + ')'];
    //echo('a', a, arr_a, 'c', c, arr_c);
    if (!arr_a) {
        if (a !== 0) {
            error('Net ' + a + ' required by voltmeter ' + this.attr.name + ' not found!');
        }
        arr_a = zero;
    }
    if (!arr_c) {
        if (c !== 0) {
            error('Net ' + c + ' required by voltmeter ' + this.attr.name + ' not found!');
        }
        arr_c = zero;
    }
    n = array_sub(arr_a, arr_c);
    key = 'V(' + this.attr.name + ')';
    if (aData.hasOwnProperty(key)) {
        file_write_json('1.json', aData);
        throw new Exception('Tried to calculate voltmeter data ' + key + ' but it was already present in result: ' + Object.keys(aData).join(', '));
    }
    aData[key] = n;
};

globalThis.exports = {Voltmeter,voltmeter};
Internal.Voltmeter = Voltmeter;
globalThis.voltmeter = voltmeter;
Internal.device_constructor.voltmeter = voltmeter;
