// VdmosModel device for mosfet_p and mosfet_n transistors
// linter: ngspicejs-lint --internal
"use strict";

function VdmosModel(aNameOrObj) {
    // Constructor
    this.type = 'vdmos_model';
    this.expected_prefix = [];
    netlist_devices.push(this);
    this.netlist_devices = netlist_devices;
    this.is_net_device = false;
    this.is_voltage_source = false;
    this.is_model = true;
    this.attr = {};
    VdmosModel.models.push(this);
    // single attr value, e.g. vdmos_model({name: 'D1', ...});
    if (arguments.length === 1 && typeof aNameOrObj === 'object') {
        this.attr = aNameOrObj;
        return;
    }
    // individual arguments
    if (aNameOrObj !== undefined && typeof aNameOrObj === 'string') {
        this.name(aNameOrObj);
    }
}

VdmosModel.models = [];

function vdmos_model(aNameOrObj) {
    // Add VDMOS model to netlist
    if (arguments.length === 1 && typeof aNameOrObj === 'object') {
        return new VdmosModel(aNameOrObj);
    }
    return new VdmosModel(aNameOrObj);
}

VdmosModel.prototype.name = function (aName) {
    // Set name
    assert_name(aName, '');
    assert_name_unique(aName, this, this.netlist_devices);
    if (aName.toLowerCase().indexOf('vdmos') >= 0) {
        hint('For more information see https://sourceforge.net/p/ngspice/bugs/642/');
        throw new Exception('VDMOS model cannot have name "' + aName + '" due to bug #642 in ngspice, VDMOS models cannot contain substring "VDMOS"');
    }
    this.attr.name = aName;
    return this;
};

VdmosModel.prototype.kind = function (aValue) {
    // Set kind
    this.attr.kind = aValue;
    return this;
};

VdmosModel.prototype.vto = function (aValue) {
    this.attr.vto = eng(aValue, 1, 'vdmos_model.vto(value)');
    return this;
};

VdmosModel.prototype.rs = function (aValue) {
    this.attr.rs = eng(aValue, 1, 'vdmos_model.rs(value)');
    return this;
};

VdmosModel.prototype.rd = function (aValue) {
    this.attr.rd = eng(aValue, 1, 'vdmos_model.rd(value)');
    return this;
};

VdmosModel.prototype.is = function (aValue) {
    this.attr.is = eng(aValue, 1, 'vdmos_model.is(value)');
    return this;
};

VdmosModel.prototype.kp = function (aValue) {
    this.attr.kp = eng(aValue, 1, 'vdmos_model.kp(value)');
    return this;
};

VdmosModel.prototype.rg = function (aValue) {
    this.attr.rg = eng(aValue, 1, 'vdmos_model.rg(value)');
    return this;
};

VdmosModel.prototype.vds = function (aValue) {
    this.attr.vds = eng(aValue, 1, 'vdmos_model.vds(value)');
    return this;
};

VdmosModel.prototype.cgdmax = function (aValue) {
    this.attr.cgdmax = eng(aValue, 1, 'vdmos_model.cgdmax(value)');
    return this;
};

VdmosModel.prototype.cgdmin = function (aValue) {
    this.attr.cgdmin = eng(aValue, 1, 'vdmos_model.cgdmin(value)');
    return this;
};

VdmosModel.prototype.cjo = function (aValue) {
    this.attr.cjo = eng(aValue, 1, 'vdmos_model.cjo(value)');
    return this;
};

VdmosModel.prototype.rb = function (aValue) {
    this.attr.rb = eng(aValue, 1, 'vdmos_model.rb(value)');
    return this;
};

VdmosModel.prototype.tt = function (aValue) {
    this.attr.tt = eng(aValue, 1, 'vdmos_model.tt(value)');
    return this;
};

VdmosModel.prototype.cgs = function (aValue) {
    this.attr.cgs = eng(aValue, 1, 'vdmos_model.cgs(value)');
    return this;
};

VdmosModel.prototype.ksubthres = function (aValue) {
    this.attr.ksubthres = eng(aValue, 1, 'vdmos_model.ksubthres(value)');
    return this;
};

VdmosModel.prototype.mtriode = function (aValue) {
    this.attr.mtriode = eng(aValue, 1, 'vdmos_model.mtriode(value)');
    return this;
};

VdmosModel.prototype.ron = function (aValue) {
    this.attr.ron = eng(aValue, 1, 'vdmos_model.ron(value)');
    return this;
};

VdmosModel.prototype.qg = function (aValue) {
    this.attr.qg = eng(aValue, 1, 'vdmos_model.qg(value)');
    return this;
};

VdmosModel.prototype.vds_max = function (aValue) {
    this.attr.vds_max = eng(aValue, 1, 'vdmos_model.vds_max(value)');
    return this;
};

VdmosModel.prototype.pchan = function (aValue) {
    // Set attribute pchan
    this.attr.pchan = aValue;
    return this;
};

VdmosModel.prototype.phi = function (aValue) {
    // Set attribute phi
    this.attr.phi = eng(aValue, 1, 'vdmos_model.phi(value)');
    return this;
};

VdmosModel.prototype.lambda = function (aValue) {
    // Set attribute lambda
    this.attr.lambda = eng(aValue, 1, 'vdmos_model.lambda(value)');
    return this;
};

VdmosModel.prototype.theta = function (aValue) {
    // Set attribute theta
    this.attr.theta = eng(aValue, 1, 'vdmos_model.theta(value)');
    return this;
};

VdmosModel.prototype.kf = function (aValue) {
    // Set attribute kf
    this.attr.kf = eng(aValue, 1, 'vdmos_model.kf(value)');
    return this;
};

VdmosModel.prototype.af = function (aValue) {
    // Set attribute af
    this.attr.af = eng(aValue, 1, 'vdmos_model.af(value)');
    return this;
};

VdmosModel.prototype.tnom = function (aValue) {
    // Set attribute tnom
    this.attr.tnom = eng(aValue, 1, 'vdmos_model.tnom(value)');
    return this;
};

VdmosModel.prototype.rq = function (aValue) {
    // Set attribute rq
    this.attr.rq = eng(aValue, 1, 'vdmos_model.rq(value)');
    return this;
};

VdmosModel.prototype.vq = function (aValue) {
    // Set attribute vq
    this.attr.vq = eng(aValue, 1, 'vdmos_model.vq(value)');
    return this;
};

VdmosModel.prototype.subshift = function (aValue) {
    // Set attribute subshift
    this.attr.subshift = eng(aValue, 1, 'vdmos_model.subshift(value)');
    return this;
};

VdmosModel.prototype.bv = function (aValue) {
    // Set attribute bv
    this.attr.bv = eng(aValue, 1, 'vdmos_model.bv(value)');
    return this;
};

VdmosModel.prototype.ibv = function (aValue) {
    // Set attribute ibv
    this.attr.ibv = eng(aValue, 1, 'vdmos_model.ibv(value)');
    return this;
};

VdmosModel.prototype.nbv = function (aValue) {
    // Set attribute nbv
    this.attr.nbv = eng(aValue, 1, 'vdmos_model.nbv(value)');
    return this;
};

VdmosModel.prototype.rds = function (aValue) {
    // Set attribute rds
    this.attr.rds = eng(aValue, 1, 'vdmos_model.rds(value)');
    return this;
};

VdmosModel.prototype.n = function (aValue) {
    // Set attribute n
    this.attr.n = eng(aValue, 1, 'vdmos_model.n(value)');
    return this;
};

VdmosModel.prototype.eg = function (aValue) {
    // Set attribute eg
    this.attr.eg = eng(aValue, 1, 'vdmos_model.eg(value)');
    return this;
};

VdmosModel.prototype.xti = function (aValue) {
    // Set attribute xti
    this.attr.xti = eng(aValue, 1, 'vdmos_model.xti(value)');
    return this;
};

VdmosModel.prototype.vj = function (aValue) {
    // Set attribute vj
    this.attr.vj = eng(aValue, 1, 'vdmos_model.vj(value)');
    return this;
};

VdmosModel.prototype.fc = function (aValue) {
    // Set attribute fc
    this.attr.fc = eng(aValue, 1, 'vdmos_model.fc(value)');
    return this;
};

VdmosModel.prototype.m = function (aValue) {
    // Set attribute m
    this.attr.m = eng(aValue, 1, 'vdmos_model.m(value)');
    return this;
};

VdmosModel.prototype.a = function (aValue) {
    // Set attribute a
    this.attr.a = eng(aValue, 1, 'vdmos_model.a(value)');
    return this;
};

VdmosModel.prototype.tcvth = function (aValue) {
    // Set attribute tcvth
    this.attr.tcvth = eng(aValue, 1, 'vdmos_model.tcvth(value)');
    return this;
};

VdmosModel.prototype.vtotc = function (aValue) {
    // Set attribute vtotc
    this.attr.vtotc = eng(aValue, 1, 'vdmos_model.vtotc(value)');
    return this;
};

VdmosModel.prototype.mu = function (aValue) {
    // Set attribute mu
    this.attr.mu = eng(aValue, 1, 'vdmos_model.mu(value)');
    return this;
};

VdmosModel.prototype.bex = function (aValue) {
    // Set attribute bex
    this.attr.bex = eng(aValue, 1, 'vdmos_model.bex(value)');
    return this;
};

VdmosModel.prototype.texp0 = function (aValue) {
    // Set attribute texp0
    this.attr.texp0 = eng(aValue, 1, 'vdmos_model.texp0(value)');
    return this;
};

VdmosModel.prototype.texp1 = function (aValue) {
    // Set attribute texp1
    this.attr.texp1 = eng(aValue, 1, 'vdmos_model.texp1(value)');
    return this;
};

VdmosModel.prototype.trd1 = function (aValue) {
    // Set attribute trd1
    this.attr.trd1 = eng(aValue, 1, 'vdmos_model.trd1(value)');
    return this;
};

VdmosModel.prototype.trd2 = function (aValue) {
    // Set attribute trd2
    this.attr.trd2 = eng(aValue, 1, 'vdmos_model.trd2(value)');
    return this;
};

VdmosModel.prototype.trg1 = function (aValue) {
    // Set attribute trg1
    this.attr.trg1 = eng(aValue, 1, 'vdmos_model.trg1(value)');
    return this;
};

VdmosModel.prototype.trg2 = function (aValue) {
    // Set attribute trg2
    this.attr.trg2 = eng(aValue, 1, 'vdmos_model.trg2(value)');
    return this;
};

VdmosModel.prototype.trs1 = function (aValue) {
    // Set attribute trs1
    this.attr.trs1 = eng(aValue, 1, 'vdmos_model.trs1(value)');
    return this;
};

VdmosModel.prototype.trs2 = function (aValue) {
    // Set attribute trs2
    this.attr.trs2 = eng(aValue, 1, 'vdmos_model.trs2(value)');
    return this;
};

VdmosModel.prototype.trb1 = function (aValue) {
    // Set attribute trb1
    this.attr.trb1 = eng(aValue, 1, 'vdmos_model.trb1(value)');
    return this;
};

VdmosModel.prototype.trb2 = function (aValue) {
    // Set attribute trb2
    this.attr.trb2 = eng(aValue, 1, 'vdmos_model.trb2(value)');
    return this;
};

VdmosModel.prototype.tksubthres1 = function (aValue) {
    // Set attribute tksubthres1
    this.attr.tksubthres1 = eng(aValue, 1, 'vdmos_model.tksubthres1(value)');
    return this;
};

VdmosModel.prototype.tksubthres2 = function (aValue) {
    // Set attribute tksubthres2
    this.attr.tksubthres2 = eng(aValue, 1, 'vdmos_model.tksubthres2(value)');
    return this;
};

VdmosModel.prototype.rthjc = function (aValue) {
    // Set attribute rthjc
    this.attr.rthjc = eng(aValue, 1, 'vdmos_model.rthjc(value)');
    return this;
};

VdmosModel.prototype.cthj = function (aValue) {
    // Set attribute cthj
    this.attr.cthj = eng(aValue, 1, 'vdmos_model.cthj(value)');
    return this;
};

VdmosModel.prototype.rthca = function (aValue) {
    // Set attribute rthca
    this.attr.rthca = eng(aValue, 1, 'vdmos_model.rthca(value)');
    return this;
};

VdmosModel.prototype.mfg = function (aValue) {
    // Set attribute mfg
    this.attr.mfg = aValue;
    return this;
};

VdmosModel.prototype.validate = function () {
    // Validate attributes
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: !true},
        kind: {type: "string", allowed: ['VDMOS'], required: true},

        pchan: {type: "boolean"},

        vto: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        kp: {type: "number", min: 0, max: 10000, eng: true, equation: true},
        phi: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        lambda: {type: "number", min: 0, max: 10, eng: true, equation: true},
        theta: {type: "number", min: 0, max: 10, eng: true, equation: true},
        rd: {type: "number", min: -1, max: 500, eng: true, equation: true},
        rs: {type: "number", min: 0, max: 500, eng: true, equation: true},
        rg: {type: "number", min: 0, max: 1e12, eng: true, equation: true},
        kf: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        af: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        tnom: {type: "number", min: -273.15, max: 1000, eng: true, equation: true},
        rq: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        vq: {type: "number", min: 0, max: 1000000, eng: true, equation: true},
        mtriode: {type: "number", min: 0, max: 100, eng: true, equation: true},
        subshift: {type: "number", min: 0, max: 100, eng: true, equation: true},
        ksubthres: {type: "number", min: 0, max: 10, eng: true, equation: true},
        bv: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        ibv: {type: "number", min: 0, max: 100, eng: true, equation: true},
        nbv: {type: "number", min: 0, max: 10, eng: true, equation: true},
        rds: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        rb: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        n: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tt: {type: "number", min: 0, max: 1, eng: true, equation: true},
        eg: {type: "number", min: 0, max: 10, eng: true, equation: true},
        xti: {type: "number", min: 0, max: 10, eng: true, equation: true},
        is: {type: "number", min: 0, max: 1, eng: true, equation: true},
        vj: {type: "number", informative: true, min: 0, max: 1000, eng: true, equation: true},
        fc: {type: "number", informative: true, min: 0, max: 1000, eng: true, equation: true},
        cjo: {type: "number", min: 0, max: 1, eng: true, equation: true},
        m: {type: "number", min: 0, max: 10, eng: true, equation: true},
        cgdmin: {type: "number", min: 0, max: 1, eng: true, equation: true},
        cgdmax: {type: "number", min: 0, max: 1, eng: true, equation: true},
        a: {type: "number", min: 0, max: 10, eng: true, equation: true},
        cgs: {type: "number", min: 0, max: 1, eng: true, equation: true},
        tcvth: {type: "number", min: 0, max: 1, eng: true, equation: true},
        vtotc: {type: "number", min: 0, max: 1, eng: true, equation: true},
        mu: {type: "number", min: -10, max: 10, eng: true, equation: true},
        bex: {type: "number", min: -10, max: 10, eng: true, equation: true},
        texp0: {type: "number", min: 0, max: 10, eng: true, equation: true},
        texp1: {type: "number", min: 0, max: 10, eng: true, equation: true},
        trd1: {type: "number", min: 0, max: 10, eng: true, equation: true},
        trd2: {type: "number", min: 0, max: 10, eng: true, equation: true},
        trg1: {type: "number", min: 0, max: 10, eng: true, equation: true},
        trg2: {type: "number", min: 0, max: 10, eng: true, equation: true},
        trs1: {type: "number", min: 0, max: 10, eng: true, equation: true},
        trs2: {type: "number", min: 0, max: 10, eng: true, equation: true},
        trb1: {type: "number", min: 0, max: 10, eng: true, equation: true},
        trb2: {type: "number", min: 0, max: 10, eng: true, equation: true},
        tksubthres1: {type: "number", min: 0, max: 10, eng: true, equation: true},
        tksubthres2: {type: "number", min: 0, max: 10, eng: true, equation: true},
        rthjc: {type: "number", min: 0, max: 10, eng: true, equation: true},
        cthj: {type: "number", min: 0, max: 1, eng: true, equation: true},
        rthca: {type: "number", min: 0, max: 1e12, eng: true, equation: true},

        vds: {type: "number", informative: true, min: 0, max: 1000, eng: true, equation: false},
        ron: {type: "number", informative: true, eng: true, equation: false},
        mfg: {type: "string", informative: true, eng: true, equation: false},
        qg: {type: "number", informative: true, eng: true, equation: false},
        vds_max: {type: "number", informative: true, eng: true, equation: false},
    });
};

VdmosModel.prototype.remove = function () {
    // Remove this device from netlist
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    VdmosModel.models.splice(VdmosModel.models.indexOf(this), 1);
    return this;
};

VdmosModel.prototype.render = function () {
    // Render spice netlist for this model
    this.validate();
    var spice = [];
    spice.push("* vdmos model " + this.attr.name);
    var s = [];
    s = [];
    for (const [key, value] of Object.entries(this.attr)) {
        if (key !== 'name' && key !== 'kind' && key !== 'pchan') {
            s.push(key + '=' + value);
        }
    }
    spice.push(".model Q" + this.attr.name + ' VDMOS ' + (this.attr.pchan ? 'PCHAN ' : ' ') + '(' + s.join(' ') + ')');
    return spice.join('\n');
};

globalThis.exports = {VdmosModel, vdmos_model};
globalThis.vdmos_model = vdmos_model;
Internal.VdmosModel = VdmosModel;
