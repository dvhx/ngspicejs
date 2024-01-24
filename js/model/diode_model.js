// Diode model
// linter: ngspicejs-lint --internal
"use strict";

function DiodeModel(aNameOrObj) {
    // Constructor
    this.type = 'diode_model';
    this.expected_prefix = [];
    netlist_devices.push(this);
    this.netlist_devices = netlist_devices;
    this.is_net_device = false;
    this.is_voltage_source = false;
    this.is_model = true;
    this.attr = {kind: "DIODE"};
    DiodeModel.models.push(this);
    // single attr value, e.g. diode_model({name: 'D1', ...});
    if (arguments.length === 1 && typeof aNameOrObj === 'object') {
        this.attr = aNameOrObj;
        this.validate();
        return;
    }
    // individual arguments
    if (arguments.length === 1 && aNameOrObj !== undefined && typeof aNameOrObj === 'string') {
        this.name(aNameOrObj);
        return;
    }
    throw new Exception('diode_model only supports single string argument or single object argument');
}

DiodeModel.models = [];

function diode_model(aNameOrObj) {
    // Add diode model to netlist
    assert_arguments_length(arguments, 0, 1, 'diode_model(name_or_objs)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new DiodeModel(aNameOrObj);
    }
    return new DiodeModel(aNameOrObj);
}

DiodeModel.prototype.name = function (aName) {
    // Set name
    assert_name(aName, 'diode_model');
    assert_name_unique(aName, this, this.netlist_devices);
    this.attr.name = aName;
    return this;
};

DiodeModel.prototype.is = function (aValue) {
    // Set is
    this.attr.is = eng(aValue, 1, 'diode_model.is(value)');
    return this;
};

DiodeModel.prototype.jsw = function (aValue) {
    // Set jsw
    this.attr.jsw = eng(aValue, 1, 'diode_model.jsw(value)');
    return this;
};

DiodeModel.prototype.n = function (aValue) {
    this.attr.n = eng(aValue, 1, 'diode_model.n(value)');
    return this;
};

DiodeModel.prototype.rs = function (aValue) {
    this.attr.rs = eng(aValue, 1, 'diode_model.rs(value)');
    return this;
};

DiodeModel.prototype.bv = function (aValue) {
    this.attr.bv = eng(aValue, 1, 'diode_model.bv(value)');
    return this;
};

DiodeModel.prototype.ibv = function (aValue) {
    this.attr.ibv = eng(aValue, 1, 'diode_model.ibv(value)');
    return this;
};

DiodeModel.prototype.nbv = function (aValue) {
    this.attr.nbv = eng(aValue, 1, 'diode_model.nbv(value)');
    return this;
};

DiodeModel.prototype.ikf = function (aValue) {
    this.attr.ikf = eng(aValue, 1, 'diode_model.ikf(value)');
    return this;
};

DiodeModel.prototype.ikr = function (aValue) {
    this.attr.ikr = eng(aValue, 1, 'diode_model.ikr(value)');
    return this;
};

DiodeModel.prototype.jtun = function (aValue) {
    this.attr.jtun = eng(aValue, 1, 'diode_model.jtun(value)');
    return this;
};

DiodeModel.prototype.jtunsw = function (aValue) {
    this.attr.jtunsw = eng(aValue, 1, 'diode_model.jtunsw(value)');
    return this;
};

DiodeModel.prototype.ntun = function (aValue) {
    this.attr.ntun = eng(aValue, 1, 'diode_model.ntun(value)');
    return this;
};

DiodeModel.prototype.xtitun = function (aValue) {
    this.attr.xtitun = eng(aValue, 1, 'diode_model.xtitun(value)');
    return this;
};

DiodeModel.prototype.keg = function (aValue) {
    this.attr.keg = eng(aValue, 1, 'diode_model.keg(value)');
    return this;
};

DiodeModel.prototype.isr = function (aValue) {
    this.attr.isr = eng(aValue, 1, 'diode_model.isr(value)');
    return this;
};

DiodeModel.prototype.nr = function (aValue) {
    this.attr.nr = eng(aValue, 1, 'diode_model.nr(value)');
    return this;
};

DiodeModel.prototype.cjo = function (aValue) {
    this.attr.cjo = eng(aValue, 1, 'diode_model.cjo(value)');
    return this;
};

DiodeModel.prototype.cjp = function (aValue) {
    this.attr.cjp = eng(aValue, 1, 'diode_model.cjp(value)');
    return this;
};

DiodeModel.prototype.fc = function (aValue) {
    this.attr.fc = eng(aValue, 1, 'diode_model.fc(value)');
    return this;
};

DiodeModel.prototype.fcs = function (aValue) {
    this.attr.fcs = eng(aValue, 1, 'diode_model.fcs(value)');
    return this;
};

DiodeModel.prototype.m = function (aValue) {
    this.attr.m = eng(aValue, 1, 'diode_model.m(value)');
    return this;
};

DiodeModel.prototype.mjsw = function (aValue) {
    this.attr.mjsw = eng(aValue, 1, 'diode_model.mjsw(value)');
    return this;
};

DiodeModel.prototype.vj = function (aValue) {
    this.attr.vj = eng(aValue, 1, 'diode_model.vj(value)');
    return this;
};

DiodeModel.prototype.php = function (aValue) {
    this.attr.php = eng(aValue, 1, 'diode_model.php(value)');
    return this;
};

DiodeModel.prototype.tt = function (aValue) {
    this.attr.tt = eng(aValue, 1, 'diode_model.tt(value)');
    return this;
};

DiodeModel.prototype.lm = function (aValue) {
    this.attr.lm = eng(aValue, 1, 'diode_model.lm(value)');
    return this;
};

DiodeModel.prototype.lp = function (aValue) {
    this.attr.lp = eng(aValue, 1, 'diode_model.lp(value)');
    return this;
};

DiodeModel.prototype.wm = function (aValue) {
    this.attr.wm = eng(aValue, 1, 'diode_model.wm(value)');
    return this;
};

DiodeModel.prototype.wp = function (aValue) {
    this.attr.wp = eng(aValue, 1, 'diode_model.wp(value)');
    return this;
};

DiodeModel.prototype.xom = function (aValue) {
    this.attr.xom = eng(aValue, 1, 'diode_model.xom(value)');
    return this;
};

DiodeModel.prototype.xoi = function (aValue) {
    this.attr.xoi = eng(aValue, 1, 'diode_model.xoi(value)');
    return this;
};

DiodeModel.prototype.xm = function (aValue) {
    this.attr.xm = eng(aValue, 1, 'diode_model.xm(value)');
    return this;
};

DiodeModel.prototype.xp = function (aValue) {
    this.attr.xp = eng(aValue, 1, 'diode_model.xp(value)');
    return this;
};

DiodeModel.prototype.eg = function (aValue) {
    this.attr.eg = eng(aValue, 1, 'diode_model.eg(value)');
    return this;
};

DiodeModel.prototype.tnom = function (aValue) {
    this.attr.tnom = eng(aValue, 1, 'diode_model.tnom(value)');
    return this;
};

DiodeModel.prototype.trs1 = function (aValue) {
    this.attr.trs1 = eng(aValue, 1, 'diode_model.trs1(value)');
    return this;
};

DiodeModel.prototype.trs2 = function (aValue) {
    this.attr.trs2 = eng(aValue, 1, 'diode_model.trs2(value)');
    return this;
};

DiodeModel.prototype.tm1 = function (aValue) {
    this.attr.tm1 = eng(aValue, 1, 'diode_model.tm1(value)');
    return this;
};

DiodeModel.prototype.tm2 = function (aValue) {
    this.attr.tm2 = eng(aValue, 1, 'diode_model.tm2(value)');
    return this;
};

DiodeModel.prototype.ttt1 = function (aValue) {
    this.attr.ttt1 = eng(aValue, 1, 'diode_model.ttt1(value)');
    return this;
};

DiodeModel.prototype.ttt2 = function (aValue) {
    this.attr.ttt2 = eng(aValue, 1, 'diode_model.ttt2(value)');
    return this;
};

DiodeModel.prototype.xti = function (aValue) {
    this.attr.xti = eng(aValue, 1, 'diode_model.xti(value)');
    return this;
};

DiodeModel.prototype.tlev = function (aValue) {
    this.attr.tlev = eng(aValue, 1, 'diode_model.tlev(value)');
    return this;
};

DiodeModel.prototype.tlevc = function (aValue) {
    this.attr.tlevc = eng(aValue, 1, 'diode_model.tlevc(value)');
    return this;
};

DiodeModel.prototype.cta = function (aValue) {
    this.attr.cta = eng(aValue, 1, 'diode_model.cta(value)');
    return this;
};

DiodeModel.prototype.ctp = function (aValue) {
    this.attr.ctp = eng(aValue, 1, 'diode_model.ctp(value)');
    return this;
};

DiodeModel.prototype.tcv = function (aValue) {
    this.attr.tcv = eng(aValue, 1, 'diode_model.tcv(value)');
    return this;
};

DiodeModel.prototype.kf = function (aValue) {
    this.attr.kf = eng(aValue, 1, 'diode_model.kf(value)');
    return this;
};

DiodeModel.prototype.af = function (aValue) {
    this.attr.af = eng(aValue, 1, 'diode_model.af(value)');
    return this;
};

DiodeModel.prototype.validate = function () {
    // Validate attributes
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: !true},
        kind: {type: "string", required: false, allowed: ['DIODE']},
        is: {type: "number", min: 0, max: 1, eng: true, equation: true},
        jsw: {type: "number", min: 0, max: 1, eng: true, equation: true},
        n: {type: "number", min: 0, max: 100, eng: true, equation: true},
        rs: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        bv: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        ibv: {type: "number", min: 0, max: 100000, eng: true, equation: true},
        nbv: {type: "number", min: 0, max: 100, eng: true, equation: true},
        ikf: {type: "number", min: 0, max: 100000, eng: true, equation: true},
        ikr: {type: "number", min: 0, max: 100, eng: true, equation: true},
        jtun: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        jtunsw: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        ntun: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        xtitun: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        keg: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        isr: {type: "number", min: 0, max: 10, eng: true, equation: true},
        nr: {type: "number", min: 0, max: 10, eng: true, equation: true},
        cjo: {type: "number", min: 0, max: 1, eng: true, equation: true},
        cjp: {type: "number", min: 0, max: 1, eng: true, equation: true},
        fc: {type: "number", min: 0, max: 10, eng: true, equation: true},
        fcs: {type: "number", min: 0, max: 10, eng: true, equation: true},
        m: {type: "number", min: 0, max: 10, eng: true, equation: true},
        mjsw: {type: "number", min: 0, max: 10, eng: true, equation: true},
        vj: {type: "number", min: 0, max: 10, eng: true, equation: true},
        php: {type: "number", min: 0, max: 10, eng: true, equation: true},
        tt: {type: "number", min: 0, max: 1, eng: true, equation: true},
        lm: {type: "number", min: 0, max: 0.3, eng: true, equation: true},
        lp: {type: "number", min: 0, max: 0.3, eng: true, equation: true},
        wm: {type: "number", min: 0, max: 0.3, eng: true, equation: true},
        wp: {type: "number", min: 0, max: 0.3, eng: true, equation: true},
        xom: {type: "number", min: 0, max: 0.3, eng: true, equation: true},
        xoi: {type: "number", min: 0, max: 0.3, eng: true, equation: true},
        xm: {type: "number", min: 0, max: 0.3, eng: true, equation: true},
        xp: {type: "number", min: 0, max: 0.3, eng: true, equation: true},
        eg: {type: "number", min: 0, max: 5, eng: true, equation: true},
        tnom: {type: "number", min: -273, max: 1000, eng: true, equation: true},
        trs1: {type: "number", min: 0, max: 10, eng: true, equation: true},
        trs2: {type: "number", min: 0, max: 10, eng: true, equation: true},
        tm1: {type: "number", min: 0, max: 10, eng: true, equation: true},
        tm2: {type: "number", min: 0, max: 10, eng: true, equation: true},
        ttt1: {type: "number", min: 0, max: 10, eng: true, equation: true},
        ttt2: {type: "number", min: 0, max: 10, eng: true, equation: true},
        xti: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tlev: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tlevc: {type: "number", min: 0, max: 100, eng: true, equation: true},
        cta: {type: "number", min: 0, max: 100, eng: true, equation: true},
        ctp: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tcv: {type: "number", min: 0, max: 100, eng: true, equation: true},
        kf: {type: "number", min: 0, max: 100, eng: true, equation: true},
        af: {type: "number", min: 0, max: 100, eng: true, equation: true}
    });
};

DiodeModel.prototype.remove = function () {
    // Remove this device from netlist
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    DiodeModel.models.splice(DiodeModel.models.indexOf(this), 1);
    return this;
};

DiodeModel.prototype.render = function () {
    // Render spice netlist for this diode model
    this.validate();
    var spice = [];
    spice.push("* diode model " + this.attr.name);
    var s = [];
    s = [];
    for (const [key, value] of Object.entries(this.attr)) {
        if (key !== 'name' && key !== 'kind') {
            s.push(key + '=' + value);
        }
    }
    spice.push(".model D" + this.attr.name + ' D(' + s.join(' ') + ')');
    return spice.join('\n');
};

globalThis.exports = {DiodeModel, diode_model};
globalThis.diode_model = diode_model;
Internal.DiodeModel = DiodeModel;
