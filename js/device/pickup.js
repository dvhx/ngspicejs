// Generic inductive or capacitive pickup
// linter: ngspicejs-lint --internal
"use strict";

function Pickup(aName, aAnode, aCathode, aL, aC, aRs, aCp, aRp, aV, aF, aDamping, aPhase, aOvertones, aDcValue, aAcMag, aAcPhase) {
    // Constructor
    assert_arguments_length(arguments, 0, 16, 'pickup(name,anode,cathode,l,c,rs,cp,rp,v,f,damping,phase,overtones,dc_value,ac_mag,ac_phase)');
    this.type = 'pickup';
    this.expected_prefix = ['L', 'U', 'V', 'C', 'MIC', 'PICKUP'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.subtype = 'generic';
    this.is_net_device = true;
    this.is_voltage_source = true; // ?
    this.attr = {
        l: 0,
        c: 0,
        rs: 5400,
        cp: 30e-12,
        rp: 100e6,
        v: 0.1,
        f: 196,
        damping: 69.3,
        phase: 0,
        overtones: 0,
        dc_value: 0,
        //ac_mag: 0.1,
        ac_phase: 0
    };
    // single attr value, e.g. pickup({name: 'L1', anode: 1, cathode: 1, l: 3.2, cp: 1e-9, ...});
    if (arguments.length === 1 && typeof aName === 'object') {
        object_merge(this.attr, aName);
        this.validate();
        return;
    }
    // individual arguments
    if (aName !== undefined && typeof aName === 'string') {
        this.name(aName);
    }
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
    if (aC !== undefined) {
        this.c(aC);
    }
    if (aRs !== undefined) {
        this.rs(aRs);
    }
    if (aCp !== undefined) {
        this.cp(aCp);
    }
    if (aRp !== undefined) {
        this.rp(aRp);
    }
    if (aV !== undefined) {
        this.v(aV);
    }
    if (aF !== undefined) {
        this.f(aF);
    }
    if (aDamping !== undefined) {
        this.damping(aDamping);
    }
    if (aPhase !== undefined) {
        this.phase(aPhase);
    }
    if (aOvertones !== undefined) {
        this.overtones(aOvertones);
    }
    if (aDcValue !== undefined) {
        this.dc_value(aDcValue);
    }
    if (aAcMag !== undefined) {
        this.ac_mag(aAcMag);
    }
    if (aAcPhase !== undefined) {
        this.ac_phase(aAcPhase);
    }
}

function pickup(aName, aAnode, aCathode, aL, aC, aRs, aCp, aRp, aV, aF, aDamping, aPhase, aOvertones, aDcValue, aAcMag, aAcPhase) {
    // Add generic inductive or capacitive pickup to netlist
    assert_arguments_length(arguments, 0, 16, 'pickup(name,anode,cathode,l,c,rs,cp,rp,v,f,damping,phase,overtones,dc_value,ac_mag,ac_phase)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Pickup(aName);
    }
    var d = new Pickup(aName, aAnode, aCathode, aL, aC, aRs, aCp, aRp, aV, aF, aDamping, aPhase, aOvertones, aDcValue, aAcMag, aAcPhase);
    warn_source_arguments_length(arguments, d);
    return d;
}

Pickup.prototype.name = function (aName, aAllowThisPrefix) {
    assert_arguments_length(arguments, 1, 2, 'pickup.name(name,allow_this_prefix)');
    assert_name(aName, 'pickup');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Pickup.prototype.anode = function (aAnode) {
    assert_arguments_length(arguments, 1, 1, 'pickup.anode(net)');
    assert_net(aAnode, 'net', 'pickup.anode(net)');
    this.attr.anode = aAnode;
    return this;
};

Pickup.prototype.cathode = function (aCathode) {
    assert_arguments_length(arguments, 1, 1, 'pickup.cathode(net)');
    assert_net(aCathode, 'net', 'pickup.cathode(net)');
    this.attr.cathode = aCathode;
    return this;
};

Pickup.prototype.l = function (aL) {
    assert_arguments_length(arguments, 1, 1, 'pickup.l(value)');
    this.attr.l = eng(aL, 1, 'pickup.l(value)');
    return this;
};

Pickup.prototype.c = function (aC) {
    assert_arguments_length(arguments, 1, 1, 'pickup.c(value)');
    this.attr.c = eng(aC, 1, 'pickup.c(value)');
    return this;
};

Pickup.prototype.rs = function (aRs) {
    assert_arguments_length(arguments, 1, 1, 'pickup.rs(value)');
    this.attr.rs = eng(aRs, 1, 'pickup.rs(value)');
    return this;
};

Pickup.prototype.cp = function (aCp) {
    assert_arguments_length(arguments, 1, 1, 'pickup.cp(value)');
    this.attr.cp = eng(aCp, 1, 'pickup.cp(value)');
    return this;
};

Pickup.prototype.rp = function (aRp) {
    assert_arguments_length(arguments, 1, 1, 'pickup.rp(value)');
    this.attr.rp = eng(aRp, 1, 'pickup.rp(value)');
    return this;
};

Pickup.prototype.v = function (aV) {
    assert_arguments_length(arguments, 1, 1, 'pickup.v(value)');
    this.attr.v = eng(aV, 1, 'pickup.v(value)');
    return this;
};

Pickup.prototype.f = function (aF) {
    assert_arguments_length(arguments, 1, 1, 'pickup.f(value)');
    this.attr.f = eng(aF, 1, 'pickup.f(value)');
    return this;
};

Pickup.prototype.damping = function (aValue) {
    // Set amplitude damping factor (theta)
    assert_arguments_length(arguments, 1, 1, 'pickup.damping(value)');
    this.attr.damping = eng(aValue, 1, 'pickup.damping(value)');
    return this;
};

Pickup.prototype.halve = function (aSecondsToHalfVolume) {
    // Set time after which will amplitude drops to half
    assert_arguments_length(arguments, 1, 1, 'pickup.halve(seconds_to_half_volume)');
    var d = eng(aSecondsToHalfVolume, 1, 'pickup.halve(seconds_to_half_volume)');
    this.attr.damping = -Math.log(0.5) / d;
    return this;
};

Pickup.prototype.phase = function (aPhase) {
    // Set phase angle
    assert_arguments_length(arguments, 1, 1, 'pickup.phase(value)');
    this.attr.phase = eng(aPhase, 1, 'pickup.phase(value)');
    return this;
};

Pickup.prototype.overtones = function (aOvertones) {
    // Set number of overtones
    assert_arguments_length(arguments, 1, 1, 'pickup.overtones(count)');
    assert_integer(aOvertones, 'count', 'pickup.overtones(count)');
    this.attr.overtones = eng(aOvertones, 1, 'pickup.overtones(count)');
    return this;
};

Pickup.prototype.dc_value = function (aValue) {
    // Set simulation's DC value
    assert_arguments_length(arguments, 1, 1, 'pickup.dc_value(value)');
    this.attr.dc_value = eng(aValue, 1, 'pickup.dc_value(value)');
    return this;
};

Pickup.prototype.ac_mag = function (aValue) {
    // Set simulation's AC magnitude
    assert_arguments_length(arguments, 1, 1, 'pickup.ac_mag(value)');
    this.attr.ac_mag = eng(aValue, 1, 'pickup.ac_mag(value)');
    return this;
};

Pickup.prototype.ac_phase = function (aDegrees) {
    // Set simulation's AC phase
    assert_arguments_length(arguments, 1, 1, 'pickup.ac_phase(value)');
    this.attr.ac_phase = eng(aDegrees, 1, 'pickup.ac_phase(value)');
    return this;
};

Pickup.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'pickup.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        l: {type: "number", min: 0, max: 3000, eng: true, equation: true},
        c: {type: "number", min: 0, max: 100, eng: true, equation: true},
        rs: {type: "number", min: 0, max: 1e6, eng: true, equation: true},
        cp: {type: "number", min: 0, max: 10, eng: true, equation: true},
        rp: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        v: {type: "number", min: 0, max: 1e6, eng: true, equation: true},
        f: {type: "number", min: 0, max: 1e12, eng: true, equation: true},
        damping: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        phase: {type: "number", min: -360, max: 360, eng: true, equation: true},
        overtones: {type: "number", min: 0, max: 10, eng: true, equation: true},
        dc_value: {type: "number", min: 0, max: 1e6, eng: true, equation: true},
        ac_mag: {type: "number", min: 0, max: 1e6, eng: true, equation: true},
        ac_phase: {type: "number", min: -360, max: 360, eng: true, equation: true},
    });
    device_attr_assign(this, this.attr);
    if (this.attr.l && this.attr.c) {
        hint('l=' + this.attr.l.toEng());
        hint('c=' + this.attr.c.toEng());
        throw new Exception('pickup ' + this.attr.name + ' can either be inductive (l>0, c=0) or capacitive (c>0, l=0), both l and c cannot be used');
    }
    if (!this.attr.l && !this.attr.c) {
        hint('l=' + this.attr.l.toEng());
        hint('c=' + this.attr.c.toEng());
        throw new Exception('pickup ' + this.attr.name + ' can either be inductive (l>0, c=0) or capacitive (c>0, l=0), both l and c cannot be zero');
    }
};

Pickup.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'pickup.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Pickup.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'pickup.get_value()');
    this.validate();
    return (this.subtype ? this.subtype + ' ' : '') + this.attr.v + 'V ' +
        this.attr.f.toEng() + 'Hz ' +
        'L=' + this.attr.l.toEng() + 'H ' +
        'C=' + this.attr.c.toEng() + 'F ' +
        'Rs=' + this.attr.rs.toEng() + 'R ' +
        'Cp=' + this.attr.cp.toEng() + 'F ' +
        'Rp=' + this.attr.rp.toEng() + 'R';
};

Pickup.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'pickup.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Pickup.prototype.render = function () {
    // Render spice netlist for this pickup
    assert_arguments_length(arguments, 0, 0, 'pickup.render()');
    var spice = [];

    spice.push("* pickup " + this.attr.name);
    // sub
    spice.push(".subckt sub_pickup_" + this.attr.name + " a b");
    if (this.attr.l) {
        spice.push(" L0 a 1 " + this.attr.l + " NT=1");
    }
    if (this.attr.c) {
        spice.push(" C0 a 1 " + this.attr.c);
    }
    spice.push(" Rs 1 2 " + this.attr.rs);
    spice.push(" Cp a b " + this.attr.cp);
    spice.push(" Rp a b " + this.attr.rp);

    var d = this.attr.damping || 0;

    // spice does not support equation in ac_mag
    if (!this.attr.ac_mag && (is_equation(this.attr.v) || is_compiled_equation(this.attr.v))) {
        throw new Exception('pickup ' + this.attr.name + ' - if amplitude is equation, you must set numeric ac_mag, e.g. .ac_mag(0.1)');
    }

    // overtones
    if (this.attr.overtones > 0) {
        spice.push(" * base tone");
        spice.push(" V1 b ov0 DC " + this.attr.dc_value + " AC " + (this.attr.ac_mag || this.attr.v) + " " + this.attr.ac_phase + " SIN(0 " + this.attr.v + " " + this.attr.f + " 0 " + d + " " + this.attr.phase + " 0)");
        spice.push(" * " + this.attr.overtones + " overtones");
        var a = this.attr.v;
        for (var i = 1; i < this.attr.overtones + 1; i++) {
            a = a * 0.618;
            var next_net = i >= this.attr.overtones ? "2" : "ov" + i;
            spice.push(" V1_OVERTONE_" + i + " ov" + (i - 1) + " " + next_net + " DC " + this.attr.dc_value + " AC " + (this.attr.ac_mag || a.toPrecision(3)) + " " + this.attr.ac_phase + " SIN(0 " + a.toPrecision(3) + " " + this.attr.f * (i + 1) + " 0 " + d + " " + this.attr.phase + " 0)");
        }
    } else {
        spice.push(" V1 b 2 DC " + this.attr.dc_value + " AC " + (this.attr.ac_mag || this.attr.v) + " " + this.attr.ac_phase + " SIN(0 " + this.attr.v + " " + this.attr.f + " 0 " + d + " " + this.attr.phase + " 0)");
    }
    spice.push(".ends sub_pickup_" + this.attr.name);
    spice.push("x_" + this.attr.name + " " + this.attr.anode + " " + this.attr.cathode + " sub_pickup_" + this.attr.name);

    return spice.join('\n');
};

globalThis.exports = {Pickup,pickup};
Internal.Pickup = Pickup;
globalThis.pickup = pickup;
Internal.device_constructor.pickup = pickup;
