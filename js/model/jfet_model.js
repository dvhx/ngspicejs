// JFET model device (for JFET_N and JFET_P tranzistors)
// linter: ngspicejs-lint --internal
"use strict";

function JfetModel(aNameOrObj) {
    // Constructor
    this.type = 'jfet_model';
    this.expected_prefix = [];
    netlist_devices.push(this);
    this.netlist_devices = netlist_devices;
    this.is_net_device = false;
    this.is_voltage_source = false;
    this.is_model = true;
    this.attr = {};
    JfetModel.models.push(this);
    // single attr value, e.g. jfet_model({name: 'D1', ...});
    if (arguments.length === 1 && typeof aNameOrObj === 'object') {
        this.attr = aNameOrObj;
        return;
    }
    // individual arguments
    if (arguments.length === 1 && aNameOrObj !== undefined && typeof aNameOrObj === 'string') {
        this.name(aNameOrObj);
        return;
    }
    throw new Exception('jfet_model only supports single string argument or single object argument');
}

function jfet_model(aNameOrObj) {
    // Add JFET model to netlist
    if (arguments.length === 1) {
        return new JfetModel(aNameOrObj);
    }
    throw new Exception('jfet_model only supports single string argument or single object argument');
}

JfetModel.models = [];

JfetModel.prototype.name = function (aName) {
    // Set name
    assert_name(aName, 'jfet_model');
    assert_name_unique(aName, this, this.netlist_devices);
    this.attr.name = aName;
    return this;
};

JfetModel.prototype.level = function (aValue) {
    this.attr.level = aValue;
    return this;
};

JfetModel.prototype.kind = function (aKind) {
    this.attr.kind = aKind;
    return this;
};

JfetModel.prototype.id = function (aValue) {
    this.attr.id = aValue;
    return this;
};

JfetModel.prototype.vto = function (aValue) {
    this.attr.vto = eng(aValue, 1, 'jfet_model.vto(value)');
    return this;
};

JfetModel.prototype.beta = function (aValue) {
    this.attr.beta = eng(aValue, 1, 'jfet_model.beta(value)');
    return this;
};

JfetModel.prototype.lambda = function (aValue) {
    this.attr.lambda = eng(aValue, 1, 'jfet_model.lambda(value)');
    return this;
};

JfetModel.prototype.rd = function (aValue) {
    this.attr.rd = eng(aValue, 1, 'jfet_model.rd(value)');
    return this;
};

JfetModel.prototype.rs = function (aValue) {
    this.attr.rs = eng(aValue, 1, 'jfet_model.rs(value)');
    return this;
};

JfetModel.prototype.cgs = function (aValue) {
    this.attr.cgs = eng(aValue, 1, 'jfet_model.cgs(value)');
    return this;
};

JfetModel.prototype.cgd = function (aValue) {
    this.attr.cgd = eng(aValue, 1, 'jfet_model.cgd(value)');
    return this;
};

JfetModel.prototype.pb = function (aValue) {
    this.attr.pb = eng(aValue, 1, 'jfet_model.pb(value)');
    return this;
};

JfetModel.prototype.is = function (aValue) {
    this.attr.is = eng(aValue, 1, 'jfet_model.is(value)');
    return this;
};

JfetModel.prototype.b = function (aValue) {
    this.attr.b = eng(aValue, 1, 'jfet_model.b(value)');
    return this;
};

JfetModel.prototype.kf = function (aValue) {
    this.attr.kf = eng(aValue, 1, 'jfet_model.kf(value)');
    return this;
};

JfetModel.prototype.af = function (aValue) {
    this.attr.af = eng(aValue, 1, 'jfet_model.af(value)');
    return this;
};

JfetModel.prototype.nlev = function (aValue) {
    this.attr.nlev = eng(aValue, 1, 'jfet_model.nlev(value)');
    return this;
};

JfetModel.prototype.gdsnoi = function (aValue) {
    this.attr.gdsnoi = eng(aValue, 1, 'jfet_model.gdsnoi(value)');
    return this;
};

JfetModel.prototype.fc = function (aValue) {
    this.attr.fc = eng(aValue, 1, 'jfet_model.fc(value)');
    return this;
};

JfetModel.prototype.tnom = function (aValue) {
    this.attr.tnom = eng(aValue, 1, 'jfet_model.tnom(value)');
    return this;
};

JfetModel.prototype.tcv = function (aValue) {
    this.attr.tcv = eng(aValue, 1, 'jfet_model.tcv(value)');
    return this;
};

JfetModel.prototype.vtotc = function (aValue) {
    this.attr.vtotc = eng(aValue, 1, 'jfet_model.vtotc(value)');
    return this;
};

JfetModel.prototype.bex = function (aValue) {
    this.attr.bex = eng(aValue, 1, 'jfet_model.bex(value)');
    return this;
};

JfetModel.prototype.betatce = function (aValue) {
    this.attr.betatce = eng(aValue, 1, 'jfet_model.betatce(value)');
    return this;
};

JfetModel.prototype.xti = function (aValue) {
    this.attr.xti = eng(aValue, 1, 'jfet_model.xti(value)');
    return this;
};

JfetModel.prototype.eg = function (aValue) {
    this.attr.eg = eng(aValue, 1, 'jfet_model.eg(value)');
    return this;
};

JfetModel.prototype.acgam = function (aValue) {
    this.attr.acgam = eng(aValue, 1, 'jfet_model.acgam(value)');
    return this;
};

JfetModel.prototype.delta = function (aValue) {
    this.attr.delta = eng(aValue, 1, 'jfet_model.delta(value)');
    return this;
};

JfetModel.prototype.hfeta = function (aValue) {
    this.attr.hfeta = eng(aValue, 1, 'jfet_model.hfeta(value)');
    return this;
};

JfetModel.prototype.hfe1 = function (aValue) {
    this.attr.hfe1 = eng(aValue, 1, 'jfet_model.hfe1(value)');
    return this;
};

JfetModel.prototype.hfe2 = function (aValue) {
    this.attr.hfe2 = eng(aValue, 1, 'jfet_model.hfe2(value)');
    return this;
};

JfetModel.prototype.hfgam = function (aValue) {
    this.attr.hfgam = eng(aValue, 1, 'jfet_model.hfgam(value)');
    return this;
};

JfetModel.prototype.hfg1 = function (aValue) {
    this.attr.hfg1 = eng(aValue, 1, 'jfet_model.hfg1(value)');
    return this;
};

JfetModel.prototype.hfg2 = function (aValue) {
    this.attr.hfg2 = eng(aValue, 1, 'jfet_model.hfg2(value)');
    return this;
};

JfetModel.prototype.ibd = function (aValue) {
    this.attr.ibd = eng(aValue, 1, 'jfet_model.ibd(value)');
    return this;
};

JfetModel.prototype.lfgam = function (aValue) {
    this.attr.lfgam = eng(aValue, 1, 'jfet_model.lfgam(value)');
    return this;
};

JfetModel.prototype.lfg1 = function (aValue) {
    this.attr.lfg1 = eng(aValue, 1, 'jfet_model.lfg1(value)');
    return this;
};

JfetModel.prototype.lfg2 = function (aValue) {
    this.attr.lfg2 = eng(aValue, 1, 'jfet_model.lfg2(value)');
    return this;
};

JfetModel.prototype.mvst = function (aValue) {
    this.attr.mvst = eng(aValue, 1, 'jfet_model.mvst(value)');
    return this;
};

JfetModel.prototype.n = function (aValue) {
    this.attr.n = eng(aValue, 1, 'jfet_model.n(value)');
    return this;
};

JfetModel.prototype.p = function (aValue) {
    this.attr.p = eng(aValue, 1, 'jfet_model.p(value)');
    return this;
};

JfetModel.prototype.q = function (aValue) {
    this.attr.q = eng(aValue, 1, 'jfet_model.q(value)');
    return this;
};

JfetModel.prototype.taud = function (aValue) {
    this.attr.taud = eng(aValue, 1, 'jfet_model.taud(value)');
    return this;
};

JfetModel.prototype.taug = function (aValue) {
    this.attr.taug = eng(aValue, 1, 'jfet_model.taug(value)');
    return this;
};

JfetModel.prototype.vbd = function (aValue) {
    this.attr.vbd = eng(aValue, 1, 'jfet_model.vbd(value)');
    return this;
};

JfetModel.prototype.vbi = function (aValue) {
    this.attr.vbi = eng(aValue, 1, 'jfet_model.vbi(value)');
    return this;
};

JfetModel.prototype.vst = function (aValue) {
    this.attr.vst = eng(aValue, 1, 'jfet_model.vst(value)');
    return this;
};

JfetModel.prototype.xc = function (aValue) {
    this.attr.xc = eng(aValue, 1, 'jfet_model.xc(value)');
    return this;
};

JfetModel.prototype.xi = function (aValue) {
    this.attr.xi = eng(aValue, 1, 'jfet_model.xi(value)');
    return this;
};

JfetModel.prototype.z = function (aValue) {
    this.attr.z = eng(aValue, 1, 'jfet_model.z(value)');
    return this;
};

JfetModel.prototype.rg = function (aValue) {
    this.attr.rg = eng(aValue, 1, 'jfet_model.rg(value)');
    return this;
};

JfetModel.prototype.lg = function (aValue) {
    this.attr.lg = eng(aValue, 1, 'jfet_model.lg(value)');
    return this;
};

JfetModel.prototype.ls = function (aValue) {
    this.attr.ls = eng(aValue, 1, 'jfet_model.ls(value)');
    return this;
};

JfetModel.prototype.ld = function (aValue) {
    this.attr.ld = eng(aValue, 1, 'jfet_model.ld(value)');
    return this;
};

JfetModel.prototype.cdss = function (aValue) {
    this.attr.cdss = eng(aValue, 1, 'jfet_model.cdss(value)');
    return this;
};

JfetModel.prototype.afac = function (aValue) {
    this.attr.afac = eng(aValue, 1, 'jfet_model.afac(value)');
    return this;
};

JfetModel.prototype.nfing = function (aValue) {
    this.attr.nfing = eng(aValue, 1, 'jfet_model.nfing(value)');
    return this;
};

JfetModel.prototype.temp = function (aValue) {
    this.attr.temp = eng(aValue, 1, 'jfet_model.temp(value)');
    return this;
};

JfetModel.prototype.validate = function () {
    // Validate attributes
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: !true},
        kind: {type: "string", required: true, allowed: ['JFET_N', 'JFET_P']},

        level: {type: "number", allowed: [1, 2]},
        // level 1
        vto: {type: "number", min: -100, max: 100, eng: true, equation: true},
        idss: {type: "number", min: 0, max: 1, eng: true, equation: false, informative: true},
        beta: {type: "number", min: 0, max: 1, eng: true, equation: true},
        lambda: {type: "number", min: 0, max: 1, eng: true, equation: true},
        rd: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        rs: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        cgs: {type: "number", min: 0, max: 1, eng: true, equation: true},
        cgd: {type: "number", min: 0, max: 1, eng: true, equation: true},
        pb: {type: "number", min: 0, max: 10, eng: true, equation: true},
        is: {type: "number", min: 0, max: 1, eng: true, equation: true},
        b: {type: "number", min: 0, max: 100, eng: true, equation: true},
        kf: {type: "number", min: -10, max: 10, eng: true, equation: true},
        af: {type: "number", min: 0, max: 10, eng: true, equation: true},
        nlev: {type: "number", min: 0, max: 100, eng: true, equation: true},
        gdsnoi: {type: "number", min: 0, max: 100, eng: true, equation: true},
        fc: {type: "number", min: 0, max: 10, eng: true, equation: true},
        tnom: {type: "number", min: 0, max: 150, eng: true, equation: true},
        tcv: {type: "number", min: 0, max: 1, eng: true, equation: true},
        vtotc: {type: "number", min: -1, max: 1, eng: true, equation: true},
        bex: {type: "number", min: 0, max: 10, eng: true, equation: true},
        betatce: {type: "number", min: -10, max: 10, eng: true, equation: true},
        xti: {type: "number", min: 0, max: 10, eng: true, equation: true},
        eg: {type: "number", min: 0, max: 10, eng: true, equation: true},
        // level 2
        id: {type: "string", min: 0, max: 100},
        acgam: {type: "number", min: 0, max: 10, eng: true, equation: true},
        delta: {type: "number", min: 0, max: 10, eng: true, equation: true},
        hfeta: {type: "number", min: 0, max: 10, eng: true, equation: true},
        hfe1: {type: "number", min: 0, max: 10, eng: true, equation: true},
        hfe2: {type: "number", min: 0, max: 10, eng: true, equation: true},
        hfgam: {type: "number", min: 0, max: 10, eng: true, equation: true},
        hfg1: {type: "number", min: 0, max: 10, eng: true, equation: true},
        hfg2: {type: "number", min: 0, max: 10, eng: true, equation: true},
        ibd: {type: "number", min: 0, max: 10, eng: true, equation: true},
        lfgam: {type: "number", min: 0, max: 10, eng: true, equation: true},
        lfg1: {type: "number", min: 0, max: 10, eng: true, equation: true},
        lfg2: {type: "number", min: 0, max: 10, eng: true, equation: true},
        mvst: {type: "number", min: 0, max: 10, eng: true, equation: true},
        n: {type: "number", min: 0, max: 10, eng: true, equation: true},
        p: {type: "number", min: 0, max: 10, eng: true, equation: true},
        q: {type: "number", min: 0, max: 10, eng: true, equation: true},
        taud: {type: "number", min: 0, max: 10, eng: true, equation: true},
        taug: {type: "number", min: 0, max: 10, eng: true, equation: true},
        vbd: {type: "number", min: 0, max: 10, eng: true, equation: true},
        vbi: {type: "number", min: 0, max: 10, eng: true, equation: true},
        vst: {type: "number", min: 0, max: 10, eng: true, equation: true},
        xc: {type: "number", min: 0, max: 10, eng: true, equation: true},
        xi: {type: "number", min: 0, max: 100000, eng: true, equation: true},
        z: {type: "number", min: 0, max: 10, eng: true, equation: true},
        rg: {type: "number", min: 0, max: 10, eng: true, equation: true},
        lg: {type: "number", min: 0, max: 10, eng: true, equation: true},
        ls: {type: "number", min: 0, max: 10, eng: true, equation: true},
        ld: {type: "number", min: 0, max: 10, eng: true, equation: true},
        cdss: {type: "number", min: 0, max: 10, eng: true, equation: true},
        afac: {type: "number", min: 0, max: 10, eng: true, equation: true},
        nfing: {type: "number", min: 0, max: 10, eng: true, equation: true},
        temp: {type: "number", min: 0, max: 450, eng: true, equation: true}
    });
    var l2 = 'id,acgam,delta,hfeta,hfe1,hfe2,hfgam,hfg1,hfg2,ibd,lfgam,lfg1,lfg2,mvst,n,p,q,taud,taug,vbd,vbi,vst,xc,xi,z,rg,lg,ls,ld,cdss,afac,nfing,temp'.split(',');
    var i;
    if (this.attr.level !== 2) {
        for (i = 0; i < l2.length; i++) {
            if (this.attr.hasOwnProperty(l2[i])) {
                hint('Example: {kind: "JFET_N", vto: -0.3} - ok');
                hint('Example: {kind: "JFET_N", vto: -0.3, level: 1} - ok');
                hint('Example: {kind: "JFET_N", vto: -0.3, level: 1, n: 1.2} - NOT OK (n is from level 2)');
                hint('Example: {kind: "JFET_N", vto: -0.3, level: 2, n: 1.2} - ok');
                hint('Example: {kind: "JFET_N", vto: -0.3, n: 1.2} - NOT OK (default level is 1 but n is from level 2)');
                throw new Exception('Level 1 jfet_model ' + this.attr.name + ' uses parameter ' + l2[i] + ' but this parameter is from level 2, either explicitly change the level to 2 or don\'t use this parameter!');
            }
        }
    }
};

JfetModel.prototype.remove = function () {
    // Remove this device from netlist
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    JfetModel.models.splice(JfetModel.models.indexOf(this), 1);
    return this;
};

JfetModel.prototype.render = function () {
    // Render spice netlist
    this.validate();
    var spice = [];
    spice.push("* jfet model " + this.attr.name);
    var s = [];
    s = [];
    for (const [key, value] of Object.entries(this.attr)) {
        if (key !== 'name' && key !== 'kind' && key !== 'idss') {
            s.push(key + '=' + value);
        }
    }
    if (this.attr.kind === 'JFET_N') {
        spice.push(".model Q" + this.attr.name + ' NJF(' + s.join(' ') + ')');
    } else if (this.attr.kind === 'JFET_P') {
        spice.push(".model Q" + this.attr.name + ' PJF(' + s.join(' ') + ')');
    } else {
        throw new Exception("Invalid JFET model kind " + this.attr.kind + ", expected was JFET_N or JFET_P");
    }
    return spice.join('\n');
};

globalThis.exports = {JfetModel, jfet_model};
globalThis.jfet_model = jfet_model;
Internal.JfetModel = JfetModel;
