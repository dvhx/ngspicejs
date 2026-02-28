// Tapped inductor
// Note: Despite the name tapped inductor supports 2 different wire thicknesses
//       use different turn resistance rt1=r1/nt1, rt2=r2/nt2 and inductance
//       as a sum of both inductances. Then "percent" attribute will correctly
//       calculate resistance (linear) and inductance (quadratic).
// linter: ngspicejs-lint --internal
"use strict";

function InductorTapped(aName, aStart, aWiper, aEnd, aL, aRt1, aRt2, aNTurns, aPercent) {
    // Constructor
    assert_arguments_length(arguments, 0, 9, 'inductor_tapped(name,start,wiper,end,l,rt1,rt2,nt,percent)');
    this.type = 'inductor_tapped';
    Inductor.inductors.push(this); // This may give better error messages when coupling to non-existent inductors
    this.expected_prefix = ['L', 'T'];
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
    if (aStart !== undefined) {
        this.start(aStart);
    }
    if (aWiper !== undefined) {
        this.wiper(aWiper);
    }
    if (aEnd !== undefined) {
        this.end(aEnd);
    }
    if (aL !== undefined) {
        this.l(aL);
    }
    if (aRt1 !== undefined) {
        this.rt1(aRt1);
    }
    if (aRt2 !== undefined) {
        this.rt2(aRt2);
    }
    if (aNTurns !== undefined) {
        this.nt(aNTurns);
    }
    if (aPercent !== undefined) {
        this.percent(aPercent);
    }
}

function inductor_tapped(aName, aStart, aWiper, aEnd, aL, aRt1, aRt2, aNTurns, aPercent) {
    // Add tapped inductor to netlist
    assert_arguments_length(arguments, 0, 9, 'inductor_tapped(name,start,wiper,end,l,rt1,rt2,nt,percent)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new InductorTapped(aName);
    }
    return new InductorTapped(aName, aStart, aWiper, aEnd, aL, aRt1, aRt2, aNTurns, aPercent);
}

InductorTapped.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'inductor_tapped.name(name,allow_this_prefix)');
    assert_name(aName, 'inductor_tapped');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

InductorTapped.prototype.start = function (aNet) {
    // Set starting pin
    assert_arguments_length(arguments, 1, 1, 'inductor_tapped.start(net)');
    assert_net(aNet, 'net', 'inductor_tapped.start(net)');
    this.attr.start = aNet;
    return this;
};

InductorTapped.prototype.wiper = function (aNet) {
    // Set wiper pin
    assert_arguments_length(arguments, 1, 1, 'inductor_tapped.wiper(net)');
    assert_net(aNet, 'net', 'inductor_tapped.wiper(net)');
    this.attr.wiper = aNet;
    return this;
};

InductorTapped.prototype.end = function (aNet) {
    // Set ending pin
    assert_arguments_length(arguments, 1, 1, 'inductor_tapped.end(net)');
    assert_net(aNet, 'net', 'inductor_tapped.end(net)');
    this.attr.end = aNet;
    return this;
};

InductorTapped.prototype.l = function (aL) {
    // Set inductance
    assert_arguments_length(arguments, 1, 1, 'inductor_tapped.l(inductance)');
    this.attr.l = eng(aL, 1, 'inductor_tapped.l(value)');
    return this;
};

InductorTapped.prototype.rt1 = function (aValue) {
    // Set resistance per turn of first kind of wire (from start to wiper)
    assert_arguments_length(arguments, 1, 1, 'inductor_tapped.rt1(resistance_per_turn)');
    this.attr.rt1 = eng(aValue, 1, 'inductor_tapped.rt1(resistance_per_turn)');
    return this;
};

InductorTapped.prototype.rt2 = function (aValue) {
    // Set resistance per turn of first kind of wire (from start to wiper)
    assert_arguments_length(arguments, 1, 1, 'inductor_tapped.rt2(resistance_per_turn)');
    this.attr.rt2 = eng(aValue, 1, 'inductor_tapped.rt2(resistance_per_turn)');
    return this;
};

InductorTapped.prototype.nt = function (aNTurns) {
    // Set number of turns
    assert_arguments_length(arguments, 1, 1, 'inductor_tapped.nt(number_of_turns)');
    this.attr.nt = eng(aNTurns, 1, 'inductor_tapped.nt(number_of_turns)');
    return this;
};

InductorTapped.prototype.percent = function (aValue) {
    // Set wiper position from start (0%) to end (100%)
    assert_arguments_length(arguments, 1, 1, 'inductor_tapped.percent(value)');
    this.attr.percent = eng(aValue, 1, 'inductor_tapped.percent(value)');
    return this;
};

InductorTapped.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'inductor_tapped.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        start: {type: "net", required: true},
        wiper: {type: "net", required: true},
        end: {type: "net", required: true},
        l: {type: "number", min: 1e-15, max: 3000, eng: true, equation: true},
        rt1: {type: "number", min: 0.001, max: 1000, eng: true, equation: true, zero: false},
        rt2: {type: "number", min: 0.001, max: 1000, eng: true, equation: true, zero: false},
        nt: {type: "number", min: 2, max: 1000000, eng: true, equation: true},
        percent: {type: "number", min: 0, max: 100, eng: true, equation: true},
    });
    device_attr_assign(this, this.attr);
};

InductorTapped.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'inductor_tapped.get_nets()');
    return {
        start: this.attr.start,
        wiper: this.attr.wiper,
        end: this.attr.end
    };
};

InductorTapped.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'inductor_tapped.get_value()');
    return (this.attr.percent).toFixed(0) + '%';
};

InductorTapped.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'inductor_tapped.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    Inductor.inductors.splice(Inductor.inductors.indexOf(this), 1);
    return this;
};

InductorTapped.prototype.render = function () {
    // Render spice netlist for this device
    assert_arguments_length(arguments, 0, 0, 'inductor_tapped.render()');
    var spice = [];
    var n1 = Math.round(this.attr.nt * this.attr.percent / 100);
    var n2 = this.attr.nt - n1;
    var r1 = n1 * this.attr.rt1;
    var r2 = n2 * this.attr.rt2;
    var a = this.attr.l / (this.attr.nt**2);
    var l1 = a * n1 ** 2;
    var l2 = a * n2 ** 2;
    spice.push("* inductor_tapped " + this.attr.name + " percent=" + this.attr.percent.toFixed(1) + " nt=" + this.attr.nt + " n1=" + n1 + " n2=" + n2 + " rt1=" + this.attr.rt1.toFixed(6) + "/t rt2=" + this.attr.rt2.toFixed(6) + "/t");
    spice.push(".subckt sub_inductor_tapped_" + this.attr.name + " start wiper end");
    spice.push(" * nt=" + this.attr.nt + " n1=L_L1 start 2 " + this.attr.l + " NT=1");
    spice.push(" L_L1 start 2 " + l1.toPrecision(6) + " NT=" + n1);
    spice.push(" R_R1 2 wiper " + r1.toFixed(6));
    spice.push(" L_L2 wiper 3 " + l2.toPrecision(6) + " NT=" + n2);
    spice.push(" R_R2 3 end " + r2.toFixed(6));
    spice.push(" K_K1 L_L1 L_L2 0.97"); // FIXME: add coupling attribute
    //this.coupling_name1 = 'l.x_' + this.attr.name.toLowerCase() + '.l_l1';
    //this.coupling_name2 = 'l.x_' + this.attr.name.toLowerCase() + '.l_l2';
    if (this.attr.cp) {
        spice.push(" C_CP1 start wiper " + (this.attr.cp / 2));
        spice.push(" C_CP2 wiper end " + (this.attr.cp / 2));
    }
    spice.push(".ends sub_inductor_tapped_" + this.attr.name);
    spice.push('x_' + this.attr.name + ' ' + this.attr.start + ' ' + this.attr.wiper + ' ' + this.attr.end + ' sub_inductor_tapped_' + this.attr.name);
    return spice.join('\n');
};

globalThis.exports = {inductor_tapped,InductorTapped};
Internal.InductorTapped = InductorTapped;
globalThis.inductor_tapped = inductor_tapped;
Internal.device_constructor.inductor_tapped = inductor_tapped;

