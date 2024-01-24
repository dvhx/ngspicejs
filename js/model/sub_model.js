// Subcircuit device
// linter: ngspicejs-lint --internal
"use strict";

function SubModel(aName, aNets, aParams) {
    // Constructor
    this.type = 'sub_model';
    this.expected_prefix = [];
    this.attr = {params: {}};
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.netlist_devices_orig_count = netlist_devices.length;
    this.sub_devices = [];
    this.line_markers = [];
    this.is_net_device = true;
    this.is_voltage_source = false;
    this.is_model = true;
    this.unused_nets = {}; // Used to track unused nets, use .nc(net) to add
    assert_arguments_length(arguments, 1, 3, 'sub_model(name,nets,params)');
    if (SubModel.models.find((a) => a.attr.name === aName)) {
        error('Cannot declare subcircuit with name "' + aName + '" because subcircuit with same name already exists!');
    }
    SubModel.models.push(this);
    // all attr as object in first argument
    if (arguments.length === 1 && typeof aName === 'object') {
        this.attr = aName;
        this.validate();
        return;
    }
    // individual arguments
    if (aName !== undefined) {
        this.name(aName);
    }
    if (aNets !== undefined) {
        this.nets(aNets);
    }
    if (aParams !== undefined) {
        this.params(aParams);
    }
}

SubModel.models = [];

function sub_model(aName, aNets, aParams) {
    // Add sub_model to netlist, actual device can then be added using sub()
    assert_arguments_length(arguments, 1, 3, 'sub_model(name,nets,params)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new SubModel(aName);
    }
    return new SubModel(aName, aNets, aParams);
}

SubModel.prototype.name = function (aName) {
    // Set name
    assert_name(aName, 'sub_model');
    assert_name_unique(aName, this, this.netlist_devices);
    if (!aName.match(/^[A-Z0-9_]+$/)) {
        throw new Exception('sub_model.name(value) allowed characters are A-Z0-9_ but instead is "' + aName + '"');
    }
    this.attr.name = aName;
    return this;
};

SubModel.prototype.nets = function (aNets) {
    // Set nets
    assert_array(aNets, 'nets', 'sub_model.nets(nets)');
    assert_array_of_nets(aNets, 'nets', 'sub_model.nets(nets)');
    this.attr.nets = aNets;
    return this;
};

SubModel.prototype.params = function (aParams) {
    // Set params
    this.attr.params = aParams;
    return this;
};

SubModel.prototype.validate = function () {
    // Validate parameters
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: !true},
        nets: {type: "array_of_nets", required: true},
        params: {type: "object_of_eng"}
    });
    device_attr_assign(this, this.attr);
};

SubModel.prototype.special_call = function (aFunction, aArguments) {
    // Call global function with given arguments
    var old = netlist_devices;
    while (aArguments.at(-1) === undefined) {
        aArguments.pop();
    }
    // jshint -W020
    netlist_devices = this.sub_devices;
    var d = aFunction.apply({}, aArguments);
    d.sub_model = this;
    d.sub_devices = this.sub_devices;
    d.parent_devices = old;
    netlist_devices = old;
    // jshint +W020
    return d;
};

SubModel.prototype.am = function (aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aFc, aPhaseDeg, aDcValue, aAcMag, aAcPhase) {
    // Add AM source to this subcircuit
    return this.special_call(am, [aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aFc, aPhaseDeg, aDcValue, aAcMag, aAcPhase]);
};

SubModel.prototype.ammeter = function (aName, aAnode, aCathode) {
    // Add ammeter to this subcircuit, then you can use e.g. I(X1.A1)
    return this.special_call(ammeter, [aName, aAnode, aCathode]);
};

SubModel.prototype.audio = function (aName, aAnode, aCathode, aFilename, aOffset, aV, aDelay) {
    // Add audio source to this subcircuit
    return this.special_call(audio, [aName, aAnode, aCathode, aFilename, aOffset, aV, aDelay]);
};

SubModel.prototype.battery = function (aName, aAnode, aCathode, aV, aRs) {
    // Add battery to this subcircuit
    return this.special_call(battery, [aName, aAnode, aCathode, aV, aRs]);
};

SubModel.prototype.beeps = function (aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aPulseWidth, aPeriod, aDcValue, aAcMag, aAcPhase) {
    // Add beeping source to this subcircuit
    return this.special_call(beeps, [aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aPulseWidth, aPeriod, aDcValue, aAcMag, aAcPhase]);
};

SubModel.prototype.capacitor = function (aName, aAnode, aCathode, aC, aRs, aRp, aLs) {
    // Add capacitor to this subcircuit
    return this.special_call(capacitor, [aName, aAnode, aCathode, aC, aRs, aRp,aLs]);
};

SubModel.prototype.cccs = function (aName, aAnode, aCathode, aVname, aGain) {
    // Add CCCS to this subcircuit
    return this.special_call(cccs, [aName, aAnode, aCathode, aVname, aGain]);
};

SubModel.prototype.ccvs = function (aName, aAnode, aCathode, aVname, aGain) {
    // Add CCVS to this subcircuit
    return this.special_call(ccvs, [aName, aAnode, aCathode, aVname, aGain]);
};

SubModel.prototype.current_source = function (aName, aAnode, aCathode, aI, aRs) {
    // Add current source to this subcircuit
    return this.special_call(current_source, [aName, aAnode, aCathode, aI, aRs]);
};

SubModel.prototype.diode = function (aName, aAnode, aCathode, aModel) {
    // Add diode to this subcircuit
    return this.special_call(diode, [aName, aAnode, aCathode, aModel]);
};

SubModel.prototype.dynamic_mic = function (aName, aAnode, aCathode, aV, aF, aDamping) {
    // Add dynamic mic to this subcircuit
    return this.special_call(dynamic_mic, [aName, aAnode, aCathode, aV, aF, aDamping]);
};

SubModel.prototype.electret_mic = function (aName, aAnode, aCathode, aV, aF, aDamping, aPhase) {
    // Add electret mic to this subcircuit
    return this.special_call(electret_mic, [aName, aAnode, aCathode, aV, aF, aDamping, aPhase]);
};

SubModel.prototype.inductor = function (aName, aAnode, aCathode, aL, aRs, aCp) {
    // Add inductor to this subcircuit
    return this.special_call(inductor, [aName, aAnode, aCathode, aL, aRs, aCp]);
};

SubModel.prototype.inductor_coupling = function (aName, aL1, aL2, aRatio) {
    // Add inductor coupling to this subcircuit
    return this.special_call(inductor_coupling, [aName, aL1, aL2, aRatio]);
};

SubModel.prototype.jfet_n = function (aName, aD, aG, aS, aModel) {
    // Add jfet_n to this subcircuit
    return this.special_call(jfet_n, [aName, aD, aG, aS, aModel]);
};

SubModel.prototype.jfet_p = function (aName, aD, aG, aS, aModel) {
    // Add jfet_p to this subcircuit
    return this.special_call(jfet_p, [aName, aD, aG, aS, aModel]);
};

SubModel.prototype.mosfet_n = function (aName, aD, aG, aS, aModel) {
    // Add mosfet_n to this subcircuit
    return this.special_call(mosfet_n, [aName, aD, aG, aS, aModel]);
};

SubModel.prototype.mosfet_p = function (aName, aD, aG, aS, aModel) {
    // Add mosfet_p to this subcircuit
    return this.special_call(mosfet_p, [aName, aD, aG, aS, aModel]);
};

SubModel.prototype.npn = function (aName, aC, aB, aE, aModel) {
    // Add NPN to this subcircuit
    return this.special_call(npn, [aName, aC, aB, aE, aModel]);
};

SubModel.prototype.opamp = function (aName, aInPlus, aInMinus, aVPlus, aVMinus, aOut, aModel) {
    // Add opamp to this subcircuit
    return this.special_call(opamp, [aName, aInPlus, aInMinus, aVPlus, aVMinus, aOut, aModel]);
};

SubModel.prototype.pickup = function (aName, aAnode, aCathode, aL, aC, aRs, aCp, aRp, aV, aF, aDamping, aPhase, aOvertones, aDcValue, aAcMag, aAcPhase) {
    // Add pickup to this subcircuit
    return this.special_call(pickup, [aName, aAnode, aCathode, aL, aC, aRs, aCp, aRp, aV, aF, aDamping, aPhase, aOvertones, aDcValue, aAcMag, aAcPhase]);
};

SubModel.prototype.pickup_humbucker = function (aName, aAnode, aCathode) {
    // Add pickup_humbucker to this subcircuit
    return this.special_call(pickup_humbucker, [aName, aAnode, aCathode]);
};

SubModel.prototype.pickup_piezo = function (aName, aAnode, aCathode) {
    // Add pickup_piezo to this subcircuit
    return this.special_call(pickup_piezo, [aName, aAnode, aCathode]);
};

SubModel.prototype.pickup_singlecoil = function (aName, aAnode, aCathode) {
    // Add pickup_singlecoil to this subcircuit
    return this.special_call(pickup_singlecoil, [aName, aAnode, aCathode]);
};

SubModel.prototype.pnp = function (aName, aC, aB, aE, aModel) {
    // Add PNP to this subcircuit
    return this.special_call(pnp, [aName, aC, aB, aE, aModel]);
};

SubModel.prototype.pot = function (aName, aStart, aWiper, aEnd, aR, aPercent) {
    // Add POT to this subcircuit
    return this.special_call(pot, [aName, aStart, aWiper, aEnd, aR, aPercent]);
};

SubModel.prototype.pulse = function (aName, aAnode, aCathode, aOffset, aV, aPulseWidth, aDelay, aRaise, aFall, aDcValue, aAcMag, aAcPhase) {
    // Add pulse source to this subcircuit
    return this.special_call(pulse, [aName, aAnode, aCathode, aOffset, aV, aPulseWidth, aDelay, aRaise, aFall, aDcValue, aAcMag, aAcPhase]);
};

SubModel.prototype.pwl = function (aName, aAnode, aCathode, aShape, aRepeatFrom, aDelay) {
    // Add PWL source to this subcircuit
    return this.special_call(pwl, [aName, aAnode, aCathode, aShape, aRepeatFrom, aDelay]);
};

SubModel.prototype.resistor = function (aName, aAnode, aCathode, aR, aLs, aCp) {
    // Add resistor to this subcircuit
    return this.special_call(resistor, [aName, aAnode, aCathode, aR, aLs, aCp]);
};

SubModel.prototype.sawtooth = function (aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aInverse) {
    // Add sawtooth source to this subcircuit
    return this.special_call(sawtooth, [aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aInverse]);
};

SubModel.prototype.sinewave = function (aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aDamping, aPhaseDeg, aDcValue, aAcMag, aAcPhase) {
    // Add sinewave source to this subcircuit
    return this.special_call(sinewave, [aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aDamping, aPhaseDeg, aDcValue, aAcMag, aAcPhase]);
};

SubModel.prototype.spice = function (aCode) {
    // Add spice code to this subcircuit
    // NOTE: Using spice in subcircuit is completely untested in v0.1
    return this.special_call(spice, [aCode]);
};

SubModel.prototype.square = function (aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aDuty, aRaise, aFall, aDcValue, aAcMag, aAcPhase) {
    // Add square wave source to this subcircuit
    return this.special_call(square, [aName, aAnode, aCathode, aOffset, aV, aF, aDelay, aDuty, aRaise, aFall, aDcValue, aAcMag, aAcPhase]);
};

SubModel.prototype.sub = function (aName, aModel, aNets, aParams) {
    // Add subcircuit to this subcircuit
    warn('Using sub in subcircuit is completely untested in v0.1');
    return this.special_call(sub, [aName, aModel, aNets, aParams]);
};

SubModel.prototype.switch_1p2t = function (aName, aInput, aOutput1, aOutput2, aState, aRon, aRoff, aTimeline) {
    // Add switch_1p2t to this subcircuit
    return this.special_call(switch_1p2t, [aName, aInput, aOutput1, aOutput2, aState, aRon, aRoff, aTimeline]);
};

SubModel.prototype.vccs = function (aName, aOutAnode, aOutCathode, aInAnode, aInCathode, aGain) {
    // Add vccs to this subcircuit
    return this.special_call(vccs, [aName, aOutAnode, aOutCathode, aInAnode, aInCathode, aGain]);
};

SubModel.prototype.vcvs = function (aName, aOutAnode, aOutCathode, aInAnode, aInCathode, aGain) {
    // Add vcvs to this subcircuit
    return this.special_call(vcvs, [aName, aOutAnode, aOutCathode, aInAnode, aInCathode, aGain]);
};

SubModel.prototype.voltmeter = function (aName, aAnode, aCathode, aR) {
    // Add voltmeter to this subcircuit
    warn('Using voltmeter in subcircuit is completely untested in v0.1');
    return this.special_call(voltmeter, [aName, aAnode, aCathode, aR]);
};

SubModel.prototype.vref = function (aName, aRef, aAnode, aCathode, aModel) {
    // Add vref to this subcircuit
    return this.special_call(vref, [aName, aRef, aAnode, aCathode, aModel]);
};

// models

SubModel.prototype.bjt_model = function (aNameOrObj) {
    // Add bjt_model to this subcircuit
    return this.special_call(bjt_model, [aNameOrObj]);
};

SubModel.prototype.diode_model = function (aNameOrObj) {
    // Add diode_model to this subcircuit
    return this.special_call(diode_model, [aNameOrObj]);
};

SubModel.prototype.jfet_model = function (aNameOrObj) {
    // Add jfet_model to this subcircuit
    return this.special_call(jfet_model, [aNameOrObj]);
};

SubModel.prototype.mos_model = function (aNameOrObj) {
    // Add mos_model to this subcircuit
    return this.special_call(mos_model, [aNameOrObj]);
};

SubModel.prototype.resistor_model = function (aNameOrObj) {
    // Add resistor_model to this subcircuit
    return this.special_call(resistor_model, [aNameOrObj]);
};

SubModel.prototype.spice_model = function (aName, aKind, aSpice) {
    // Add spice_model to this subcircuit
    // NOTE: Using spice_model in subcircuit is completely untested in v0.1
    return this.special_call(spice_model, [aName, aKind, aSpice]);
};

SubModel.prototype.sub_model = function (aName, aNets, aParams) {
    // Add sub_model to this subcircuit
    ignore(aName, aNets, aParams);
    throw new Exception('Recursive sub_model() is not supported');
};

SubModel.prototype.vdmos_model = function (aNameOrObj) {
    // Add vdmos_model to this subcircuit
    return this.special_call(vdmos_model, [aNameOrObj]);
};

SubModel.prototype.nc = function (aNet) {
    // Mark net as unused to suppress warning
    this.unused_nets[aNet] = this.unused_nets[aNet] || 0;
    this.unused_nets[aNet]++;
    return this;
};

SubModel.prototype.check_loose_nets = function () {
    // Check for nets that only connects to 1 net that is not input net
    var t = this;
    function usage(aNet) {
        var s = aNet.toString();
        t.sub_devices.forEach((d) => {
            var arr = Object.values(d.get_nets());
            //echo('t', t.type, t.attr.name, 'nets/arr', arr);
            if (arr.map((r)=>r.toString()).includes(s)) {
                hint('Sub device ' + d.type + ' ' + d.attr.name + ' connects to net "' + aNet + '"');
            }
        });
    }
    var n = this.internal_nets(true), k, sn = this.attr.nets.map((a)=>a.toString());
    for (k in n) {
        if (n.hasOwnProperty(k)) {
            if (n[k] === 1 && !sn.includes(k) && !this.unused_nets[k]) {
                warn('Device ' + this.type + ' ' + this.attr.name + ' has loose net "' + k + '", use .nc("' + k + '") to suppress this warning');
                usage(k);
            }
        }
    }
    // check for unused inputs
    sn.forEach((a) => {
        if (!n[a] && !this.unused_nets[a]) {
            warn('Device ' + this.type + ' ' + this.attr.name + ' has interface net "' + a + '" that isn\'t used by any subdevice, use .nc("' + a + '") to suppress this warning');
        }
    });
};

SubModel.prototype.check_unused_params = function () {
    // Check for declared but not used parameters
    // find actually used identifiers in all equations
    // each sub device
    var used = {};
    this.sub_devices.forEach((d) => {
        // each attribute
        Object.values(d.attr).filter((a) => typeof a === 'object').forEach((a) => {
            //echo('d', d, 'a', a, typeof a);
            //echo_json(a);
            if (a.equation && a.equation.identifiers && Array.isArray(a.equation.identifiers)) {
                a.equation.identifiers.forEach((i) => used[i] = true);
            }
        });
    });
    var unused = Object.keys(this.attr.params).filter((p) => !used[p]);
    if (unused.length > 0) {
        warn('Sub model ' + this.attr.name + ' has ' + unused.length + ' unused parameters: ' + unused.join(', '));
    }
};

SubModel.prototype.end = function () {
    // Syntactic sugar used to prevent footgun where you start making subcircuit but accidentaly add device to root instead of subckt
    if (this.ended) {
        throw new Exception("sub_model.end() on " + this.attr.name + " can be called only once!");
    }
    this.ended = true;
    this.sub_devices.forEach((a) => a.validate());
    this.check_loose_nets();
    assert_arguments_length(arguments, 0, 0, 'sub_model.end()');
    // check for global devices intermingled with sub devices, often error (forgoten sub prefix)
    if (this.netlist_devices_orig_count !== netlist_devices.length) {
        warn('Sub model "' + this.attr.name + '" has ' + (netlist_devices.length - this.netlist_devices_orig_count) + ' intermingled devices (this is often error)' + this.netlist_devices_orig_count + ' ' + netlist_devices.length);
        echo('netlist_devices_orig_count = ' + this.netlist_devices_orig_count);
        echo('netlist_devices.length     = ' + netlist_devices.length);
        hint('Example:');
        hint('var s = sub_model("DIVIDER", [1, 2, 3], {});');
        hint('s.resistor("R1", 1, 2, 100);');
        hint('resistor("R2", 2, 3, 100);   <-- intermingled global resistor, you forgot the "s." prefix');
        hint('s.end();');
    }
    // check for unused parameters
    this.check_unused_params();
};

SubModel.prototype.internal_nets = function (aCounts) {
    // Return nets used inside this subcircuit
    var n = [], i, o = {};
    this.sub_devices.map(function (d) {
        if (typeof d.is_net_device !== 'boolean') {
            internal_error('Device ' + d.type + ' does not correctly specify if it is net device via .is_net_device boolean');
        }
        if (d.is_net_device === false) {
            return;
        }
        if (typeof d.get_nets !== 'function') {
            internal_error('Device ' + d.type + ' does not have get_nets() method');
        }
        d.validate();
        var m, gn = d.get_nets();
        m = Object.values(gn);
        assert_object_of_nets(m, 'returned from ' + d.type + '.get_nets()', d.type + ' ' + d.attr.name);
        n = n.concat(m);
    });
    if (aCounts) {
        for (i = 0; i < n.length; i++) {
            o[n[i]] = o[n[i]] || 0;
            o[n[i]]++;
        }
        return o;
    }
    return n;
};

SubModel.prototype.get_nets = function () {
    // Return nets as object
    var i, n = {};
    if (this.attr.nets) {
        for (i = 0; i < this.attr.nets.length; i++) {
            n[i] = this.attr.nets[i];
        }
    }
    return n;
};

SubModel.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    this.validate();
    return this.attr.name + ' ' + this.attr.nets.length + 'nets';
};

SubModel.assert_all_sub_models_ended = function () {
    // Make sure for all sub_models the .end() was called
    SubModel.models.filter((a) => !a.ended).forEach((a) => error("sub_model.end() was not called for sub_model " + a.attr.name));
};

SubModel.prototype.remove = function () {
    // Remove this device from netlist
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    SubModel.models.splice(SubModel.models.indexOf(this), 1);
    return this;
};

SubModel.prototype.render = function () {
    // Render spice netlist for this model
    if (!this.ended) {
        throw new Exception("sub_model.end() was not called for sub_model " + this.attr.name);
    }
    var spice = [];
    var aa = Object.keys(this.attr.params).map((a) => a + '=' + this.attr.params[a]).join(' ');
    spice.push(".subckt " + this.attr.name + ' ' + this.attr.nets.join(' ') + ' PARAMS: ' + aa);
    spice.push("* attr: " + JSON.stringify(this.attr));
    spice.push("* subdev: " + this.sub_devices.length);
    spice.push(netlist_render(this.sub_devices, this.line_markers, false, true));
    return spice.join('\n');
};

globalThis.exports = {SubModel, sub_model};
globalThis.sub_model = sub_model;
Internal.SubModel = SubModel;
