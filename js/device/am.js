// Amplitude modulation voltage source
// linter: ngspicejs-lint --internal
"use strict";

function AM(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aFc, aPhaseDeg, aDcValue, aAcMag, aAcPhase) {
    // Constructor
    assert_arguments_length(arguments, 0, 12, 'am(name,anode,cathode,offset,v,f,delay,fc,phase_deg,dc_value,ac_mag,ac_phase)');
    this.type = 'am';
    this.expected_prefix = ['V', 'U', 'AM'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true;
    this.attr = {offset: 0, delay: 0, phase: 0, v: 1, dc_value: 1, ac_mag: 1, ac_phase: 0};
    // single attr value, e.g. device({name: 'U1', anode: 1, cathode: 0, ...});
    if (arguments.length === 1 && typeof aName === 'object') {
        object_merge(this.attr, aName);
        this.validate();
        return;
    }
    // individual arguments
    if (aName !== undefined && typeof aName === 'string') {
        this.name(aName);
    }
    if (aAnode !== undefined) {
        this.anode(aAnode);
    }
    if (aCathode !== undefined) {
        this.cathode(aCathode);
    }
    if (aOffset !== undefined) {
        this.offset(aOffset);
    }
    if (aV !== undefined) {
        this.v(aV);
    }
    if (aF !== undefined) {
        this.f(aF);
    }
    if (aFc !== undefined) {
        this.fc(aFc);
    }
    if (aDelay !== undefined) {
        this.phase(aDelay);
    }
    if (aPhaseDeg !== undefined) {
        this.phase(aPhaseDeg);
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

function am(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aFc, aPhaseDeg, aDcValue, aAcMag, aAcPhase) {
    // Add amplitude modulation voltage source to netlist
    assert_arguments_length(arguments, 0, 12, 'am(name,anode,cathode,offset,v,f,delay,fc,phase_deg,dc_value,ac_mag,ac_phase)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new AM(aName);
    }
    var d = new AM(aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aFc, aPhaseDeg, aDcValue, aAcMag, aAcPhase);
    warn_source_arguments_length(arguments, d);
    return d;
}

AM.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'am.name(value,allow_this_prefix)');
    assert_name(aName, 'am');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

AM.prototype.anode = function (aAnode) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'am.anode(net)');
    assert_net(aAnode, 'net', 'am.anode(net)');
    this.attr.anode = aAnode;
    return this;
};

AM.prototype.cathode = function (aCathode) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'am.cathode(net)');
    assert_net(aCathode, 'net', 'am.cathode(net)');
    this.attr.cathode = aCathode;
    return this;
};

AM.prototype.offset = function (aValue) {
    // Set voltage offset
    assert_arguments_length(arguments, 1, 1, 'am.offset(voltage)');
    this.attr.offset = eng(aValue, 1, 'am.offset(voltage)');
    return this;
};

AM.prototype.v = function (aValue) {
    // Set amplitude
    assert_arguments_length(arguments, 1, 1, 'am.v(voltage)');
    this.attr.v = eng(aValue, 1, 'am.v(voltage)');
    return this;
};

AM.prototype.f = function (aValue) {
    // Set AM signal frequency
    assert_arguments_length(arguments, 1, 1, 'am.f(frequency)');
    this.attr.f = eng(aValue, 1, 'am.f(frequency)');
    return this;
};

AM.prototype.fc = function (aFrequency) {
    // Set carrier frequency
    assert_arguments_length(arguments, 1, 1, 'am.fc(frequency)');
    this.attr.fc = eng(aFrequency, 1, 'am.fc(frequency)');
    return this;
};

AM.prototype.delay = function (aValue) {
    // Set delay
    assert_arguments_length(arguments, 1, 1, 'am.delay(seconds)');
    this.attr.delay = eng(aValue, 1, 'am.delay(seconds)');
    return this;
};

AM.prototype.phase = function (aDegrees) {
    // Set phase
    assert_arguments_length(arguments, 1, 1, 'am.phase(degrees)');
    this.attr.phase = eng(aDegrees, 1, 'am.phase(degrees)');
    return this;
};

AM.prototype.dc_value = function (aValue) {
    // Set simulation DC value
    assert_arguments_length(arguments, 1, 1, 'am.dc_value(voltage)');
    this.attr.dc_value = eng(aValue, 1, 'am.dc_value(voltage)');
    return this;
};

AM.prototype.ac_mag = function (aValue) {
    // Set simulation AC magnitude value
    assert_arguments_length(arguments, 1, 1, 'am.ac_mag(value)');
    this.attr.ac_mag = eng(aValue, 1, 'am.ac_mag(value)');
    return this;
};

AM.prototype.ac_phase = function (aDegrees) {
    // Set simulation AC phase
    assert_arguments_length(arguments, 1, 1, 'am.ac_phase(degrees)');
    this.attr.ac_phase = eng(aDegrees, 1, 'am.ac_phase(degrees)');
    return this;
};

AM.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'am.validate()');
    var v = ngspice_version();
    device_attr_check(this, this.attr, {
        name: {type: "string", min: 1, max: 100, required: true, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true },
        cathode: {type: "net", required: true },
        offset: {type: "number", min: 0, max: 1e9, eng: true, equation: true},
        v: {type: "number", min: 1e-15, max: 1e9, eng: true, equation: true},
        f: {type: "number", min: 0.1, max: 1e12, eng: true, equation: true, required: true},
        fc: {type: "number", min: 0.1, max: 1e12, eng: true, equation: true, required: true},
        delay: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        phase: {type: "number", min: -360, max: 360, eng: true, equation: true},
        // equations in ngspice-40 only!
        dc_value: {type: "number", min: 0, max: 1e9, eng: true, equation: v >= 40},
        ac_mag: {type: "number", min: 0, max: 1e9, eng: true, equation: v >= 40},
        ac_phase: {type: "number", min: -360, max: 360, eng: true, equation: v >= 40},
    });
    device_attr_assign(this, this.attr);
};

AM.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'am.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

AM.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'am.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

AM.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'am.get_value()');
    this.validate();
    return this.attr.v + 'V ' + this.attr.f.toEng() + 'Hz';
};

AM.prototype.render = function () {
    // Render spice netlist
    assert_arguments_length(arguments, 0, 0, 'am.render()');
    var spice = [];
    //var eq = render_equations(this, ['v', 'offset', 'f', 'fc', 'delay', 'phase', 'dc_value', 'ac_mag', 'ac_phase']);
    //echo_json(eq);
    spice.push("* am " + this.attr.name + ' (VA VO MF FC TD PHASE)');
    spice.push("V_" + this.attr.name + " " + this.attr.anode + " " + this.attr.cathode +
        " DC " + this.attr.dc_value + " " +
        " AC " + this.attr.ac_mag + " " + this.attr.ac_phase + " " +
        " AM (" +
            this.attr.v + ' ' +
            this.attr.offset + " " +
            this.attr.f + " " +
            this.attr.fc + " " +
            this.attr.delay + " " +
            this.attr.phase +
        ")"
    );
    return spice.join('\n');
};

Internal.AM = AM;
globalThis.am = am;
Internal.device_constructor.am = am;
