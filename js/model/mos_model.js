// Mosfet model (for mosfet_n and mosfet_p transistors)
// linter: ngspicejs-lint --internal
"use strict";

function MosModel(aNameOrObj) {
    // Constructor
    this.type = 'mos_model';
    this.expected_prefix = [];
    netlist_devices.push(this);
    this.netlist_devices = netlist_devices;
    this.is_net_device = false;
    this.is_voltage_source = false;
    this.is_model = true;
    this.attr = {};
    MosModel.models.push(this);
    // single attr value, e.g. mos_model({name: 'D1', ...});
    if (arguments.length === 1 && typeof aNameOrObj === 'object') {
        this.attr = aNameOrObj;
        return;
    }
    // individual arguments
    if (aNameOrObj !== undefined && typeof aNameOrObj === 'string') {
        this.name(aNameOrObj);
    }
}

MosModel.models = [];

function mos_model(aNameOrObj) {
    // Add NMOS or PMOS model to netlist
    if (arguments.length === 1 && typeof aNameOrObj === 'object') {
        return new MosModel(aNameOrObj);
    }
    return new MosModel(aNameOrObj);
}

MosModel.prototype.name = function (aName) {
    // Set name
    assert_name(aName, 'mos_model');
    assert_name_unique(aName, this, this.netlist_devices);
    this.attr.name = aName;
    return this;
};

MosModel.prototype.kind = function (aValue) {
    // Set kind
    this.attr.kind = aValue;
    return this;
};

MosModel.prototype.vto = function (aValue) {
    this.attr.vto = eng(aValue, 1, 'mos_model.vto(value)');
    return this;
};

MosModel.prototype.kp = function (aValue) {
    this.attr.kp = eng(aValue, 1, 'mos_model.kp(value)');
    return this;
};

MosModel.prototype.rd = function (aValue) {
    this.attr.rd = eng(aValue, 1, 'mos_model.rd(value)');
    return this;
};

MosModel.prototype.cgso = function (aValue) {
    this.attr.cgso = eng(aValue, 1, 'mos_model.cgso(value)');
    return this;
};

MosModel.prototype.cgdo = function (aValue) {
    this.attr.cgdo = eng(aValue, 1, 'mos_model.cgdo(value)');
    return this;
};

MosModel.prototype.cgbo = function (aValue) {
    this.attr.cgbo = eng(aValue, 1, 'mos_model.cgbo(value)');
    return this;
};

MosModel.prototype.cbd = function (aValue) {
    this.attr.cbd = eng(aValue, 1, 'mos_model.cbd(value)');
    return this;
};

MosModel.prototype.cbs = function (aValue) {
    this.attr.cbs = eng(aValue, 1, 'mos_model.cbs(value)');
    return this;
};

MosModel.prototype.pb = function (aValue) {
    this.attr.pb = eng(aValue, 1, 'mos_model.pb(value)');
    return this;
};

MosModel.prototype.level = function (aValue) {
    this.attr.level = eng(aValue, 1, 'mos_model.level(value)');
    return this;
};

MosModel.prototype.gamma = function (aValue) {
    this.attr.gamma = eng(aValue, 1, 'mos_model.gamma(value)');
    return this;
};

MosModel.prototype.phi = function (aValue) {
    this.attr.phi = eng(aValue, 1, 'mos_model.phi(value)');
    return this;
};

MosModel.prototype.lambda = function (aValue) {
    this.attr.lambda = eng(aValue, 1, 'mos_model.lambda(value)');
    return this;
};

MosModel.prototype.mj = function (aValue) {
    this.attr.mj = eng(aValue, 1, 'mos_model.mj(value)');
    return this;
};

MosModel.prototype.nsub = function (aValue) {
    this.attr.nsub = eng(aValue, 1, 'mos_model.nsub(value)');
    return this;
};

MosModel.prototype.delta = function (aValue) {
    this.attr.delta = eng(aValue, 1, 'mos_model.delta(value)');
    return this;
};

MosModel.prototype.kappa = function (aValue) {
    this.attr.kappa = eng(aValue, 1, 'mos_model.kappa(value)');
    return this;
};

MosModel.prototype.tpg = function (aValue) {
    this.attr.tpg = aValue;
    return this;
};

MosModel.prototype.vmax = function (aValue) {
    this.attr.vmax = eng(aValue, 1, 'mos_model.vmax(value)');
    return this;
};

MosModel.prototype.eta = function (aValue) {
    this.attr.eta = eng(aValue, 1, 'mos_model.eta(value)');
    return this;
};

MosModel.prototype.nfs = function (aValue) {
    this.attr.nfs = eng(aValue, 1, 'mos_model.nfs(value)');
    return this;
};

MosModel.prototype.tox = function (aValue) {
    this.attr.tox = eng(aValue, 1, 'mos_model.tox(value)');
    return this;
};

MosModel.prototype.ld = function (aValue) {
    this.attr.ld = eng(aValue, 1, 'mos_model.ld(value)');
    return this;
};

MosModel.prototype.uo = function (aValue) {
    this.attr.uo = eng(aValue, 1, 'mos_model.uo(value)');
    return this;
};

MosModel.prototype.xj = function (aValue) {
    this.attr.xj = eng(aValue, 1, 'mos_model.xj(value)');
    return this;
};

MosModel.prototype.theta = function (aValue) {
    this.attr.theta = eng(aValue, 1, 'mos_model.theta(value)');
    return this;
};

MosModel.prototype.dl = function (aValue) {
    this.attr.dl = eng(aValue, 1, 'mos_model.dl(value)');
    return this;
};

MosModel.prototype.dw = function (aValue) {
    this.attr.dw = eng(aValue, 1, 'mos_model.dw(value)');
    return this;
};

MosModel.prototype.l = function (aValue) {
    this.attr.l = eng(aValue, 1, 'mos_model.l(value)');
    return this;
};

MosModel.prototype.w = function (aValue) {
    this.attr.w = eng(aValue, 1, 'mos_model.w(value)');
    return this;
};

MosModel.prototype.rs = function (aValue) {
    this.attr.rs = eng(aValue, 1, 'mos_model.rs(value)');
    return this;
};

MosModel.prototype.is = function (aValue) {
    this.attr.is = eng(aValue, 1, 'mos_model.is(value)');
    return this;
};

MosModel.prototype.rsh = function (aValue) {
    this.attr.rsh = eng(aValue, 1, 'mos_model.rsh(value)');
    return this;
};

MosModel.prototype.cj = function (aValue) {
    this.attr.cj = eng(aValue, 1, 'mos_model.cj(value)');
    return this;
};

MosModel.prototype.cjsw = function (aValue) {
    this.attr.cjsw = eng(aValue, 1, 'mos_model.cjsw(value)');
    return this;
};

MosModel.prototype.mjsw = function (aValue) {
    this.attr.mjsw = eng(aValue, 1, 'mos_model.mjsw(value)');
    return this;
};

MosModel.prototype.js = function (aValue) {
    this.attr.js = eng(aValue, 1, 'mos_model.js(value)');
    return this;
};

MosModel.prototype.nss = function (aValue) {
    this.attr.nss = eng(aValue, 1, 'mos_model.nss(value)');
    return this;
};

MosModel.prototype.ucrit = function (aValue) {
    this.attr.ucrit = eng(aValue, 1, 'mos_model.ucrit(value)');
    return this;
};

MosModel.prototype.uexp = function (aValue) {
    this.attr.uexp = eng(aValue, 1, 'mos_model.uexp(value)');
    return this;
};

MosModel.prototype.utra = function (aValue) {
    this.attr.utra = eng(aValue, 1, 'mos_model.utra(value)');
    return this;
};

MosModel.prototype.neff = function (aValue) {
    this.attr.neff = eng(aValue, 1, 'mos_model.neff(value)');
    return this;
};

MosModel.prototype.kf = function (aValue) {
    this.attr.kf = eng(aValue, 1, 'mos_model.kf(value)');
    return this;
};

MosModel.prototype.af = function (aValue) {
    this.attr.af = eng(aValue, 1, 'mos_model.af(value)');
    return this;
};

MosModel.prototype.fc = function (aValue) {
    this.attr.fc = eng(aValue, 1, 'mos_model.fc(value)');
    return this;
};

MosModel.prototype.tnom = function (aValue) {
    this.attr.tnom = eng(aValue, 1, 'mos_model.tnom(value)');
    return this;
};

MosModel.prototype.validate = function () {
    // Validate attributes
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: !true},
        kind: {type: "string", allowed: ['NMOS', 'PMOS'], required: true},

        level: {type: "number", min: 1, max: 73, eng: true, equation: true},
        vto: {type: "number", min: -1000, max: 1000, eng: true, equation: true},
        kp: {type: "number", min: 0, max: 100, eng: true, equation: true},
        gamma: {type: "number", min: 0, max: 10, eng: true, equation: true},
        phi: {type: "number", min: 0, max: 10, eng: true, equation: true},
        lambda: {type: "number", min: 0, max: 10, eng: true, equation: true},
        rd: {type: "number", min: 0, max: 100, eng: true, equation: true},
        rs: {type: "number", min: 0, max: 100, eng: true, equation: true},
        cbd: {type: "number", min: 0, max: 1, eng: true, equation: true},
        cbs: {type: "number", min: 0, max: 1, eng: true, equation: true},
        is: {type: "number", min: 0, max: 1, eng: true, equation: true},
        pb: {type: "number", min: 0, max: 1, eng: true, equation: true},
        cgso: {type: "number", min: 0, max: 1, eng: true, equation: true},
        cgdo: {type: "number", min: 0, max: 1, eng: true, equation: true},
        cgbo: {type: "number", min: 0, max: 1, eng: true, equation: true},
        rsh: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        cj: {type: "number", min: 0, max: 10, eng: true, equation: true},
        mj: {type: "number", min: 0, max: 10, eng: true, equation: true},
        cjsw: {type: "number", min: 0, max: 1, eng: true, equation: true},
        mjsw: {type: "number", min: 0, max: 10, eng: true, equation: true},

        js: {type: "number", min: 0, max: 1, eng: true, equation: true},
        tox: {type: "number", min: 0, max: 1, eng: true, equation: true},
        nsub: {type: "number", min: 0, max: 10e20, eng: true, equation: true},
        nss: {type: "number", min: 0, max: 1e20, eng: true, equation: true},
        nfs: {type: "number", min: 0, max: 1e20, eng: true, equation: true},
        tpg: {type: "number", allowed: [-1, 0, 1], eng: true, equation: true},
        xj: {type: "number", min: 0, max: 100, eng: true, equation: true},
        ld: {type: "number", min: 0, max: 10, eng: true, equation: true},
        uo: {type: "number", min: 0, max: 100000, eng: true, equation: true},
        ucrit: {type: "number", min: 0, max: 1e10, eng: true, equation: true},
        uexp: {type: "number", min: 0, max: 10, eng: true, equation: true},
        utra: {type: "number", min: 0, max: 10, eng: true, equation: true},
        vmax: {type: "number", min: 0, max: 1e9, eng: true, equation: true},
        neff: {type: "number", min: 0, max: 100, eng: true, equation: true},
        kf: {type: "number", min: 0, max: 1, eng: true, equation: true},
        af: {type: "number", min: 0, max: 10, eng: true, equation: true},
        fc: {type: "number", min: 0, max: 10, eng: true, equation: true},
        delta: {type: "number", min: 0, max: 10, eng: true, equation: true},
        theta: {type: "number", min: 0, max: 10, eng: true, equation: true},
        eta: {type: "number", min: 0, max: 10, eng: true, equation: true},
        kappa: {type: "number", min: 0, max: 10, eng: true, equation: true},
        tnom: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        dl: {type: "number", min: 0, max: 1, eng: true, equation: true},
        dw: {type: "number", min: 0, max: 1, eng: true, equation: true},
        l: {type: "number", min: 0, max: 10, eng: true, equation: true},      // these are instance params?
        w: {type: "number", min: 0, max: 10, eng: true, equation: true},
    });
    if (this.attr.kind === 'NMOS' && this.attr.vto < 0) {
        error('NMOS model ' + this.attr.name + ' has negative vto=' + this.attr.vto + ' but NMOS must have positive VTO');
    }
    if (this.attr.kind === 'PMOS' && this.attr.vto > 0) {
        error('PMOS model ' + this.attr.name + ' has positive vto=' + this.attr.vto + ' but PMOS must have negative VTO');
    }
};

MosModel.prototype.remove = function () {
    // Remove this device from netlist
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    MosModel.models.splice(MosModel.models.indexOf(this), 1);
    return this;
};

MosModel.prototype.render = function () {
    // Render spice netlist for this model
    this.validate();
    var spice = [];
    spice.push("* " + this.attr.kind + " model " + this.attr.name);
    var s = [];
    s = [];
    for (const [key, value] of Object.entries(this.attr)) {
        if (key !== 'name' && key !== 'kind') {
            s.push(key + '=' + value);
        }
    }
    spice.push(".model Q" + this.attr.name + ' ' + this.attr.kind + '(' + s.join(' ') + ')');
    return spice.join('\n');
};

globalThis.exports = {MosModel, mos_model};
globalThis.mos_model = mos_model;
Internal.MosModel = MosModel;
