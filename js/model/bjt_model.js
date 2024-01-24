// BJT model (for NPN and PNP tranzistors)
// linter: ngspicejs-lint --internal
"use strict";

function BjtModel(aNameOrObj) {
    // Constructor
    this.type = 'bjt_model';
    this.expected_prefix = [];
    netlist_devices.push(this);
    this.netlist_devices = netlist_devices;
    this.is_net_device = false;
    this.is_voltage_source = false;
    this.is_model = true;
    this.attr = {};
    BjtModel.models.push(this);
    // single attr value, e.g. bjt_model({name: 'D1', ...});
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
    throw new Exception('bjt_model only supports single string argument or single object argument');
}

function bjt_model(aNameOrObj) {
    // BJT model device (for NPN and PNP tranzistors)
    if (arguments.length === 1) {
        return new BjtModel(aNameOrObj);
    }
    throw new Exception('bjt_model only supports single string argument or single object argument');
}

BjtModel.models = [];

BjtModel.prototype.name = function (aName) {
    // Set name
    assert_name(aName, 'bjt_model');
    assert_name_unique(aName, this, this.netlist_devices);
    this.attr.name = aName;
    return this;
};

BjtModel.prototype.kind = function (aValue) {
    // Set kind
    assert_enum(aValue, ['NPN', 'PNP'], 'value', 'bjt_model.kind(value)');
    this.attr.kind = aValue;
    return this;
};

BjtModel.prototype.subs = function (aValue) {
    // Set substrate -1 or 1
    assert_enum(aValue, [-1, 1], 'value', 'bjt_model.subs(value)');
    this.attr.subs = aValue;
    return this;
};

BjtModel.prototype.is = function (aValue) {
    // Set is
    this.attr.is = eng(aValue, 1, 'bjt_model.is(value)');
    return this;
};

BjtModel.prototype.ibe = function (aValue) {
    // Set ibe
    this.attr.ibe = eng(aValue, 1, 'bjt_model.ibe(value)');
    return this;
};

BjtModel.prototype.ibc = function (aValue) {
    // Set ibc
    this.attr.ibc = eng(aValue, 1, 'bjt_model.ibc(value)');
    return this;
};

BjtModel.prototype.iss = function (aValue) {
    // Set iss
    this.attr.iss = eng(aValue, 1, 'bjt_model.iss(value)');
    return this;
};

BjtModel.prototype.bf = function (aValue) {
    // Set bf
    this.attr.bf = eng(aValue, 1, 'bjt_model.bf(value)');
    return this;
};

BjtModel.prototype.nf = function (aValue) {
    // Set nf
    this.attr.nf = eng(aValue, 1, 'bjt_model.nf(value)');
    return this;
};

BjtModel.prototype.va = function (aValue) {
    this.attr.va = eng(aValue, 1, 'bjt_model.va(value)');
    return this;
};

BjtModel.prototype.vaf = function (aValue) {
    this.attr.vaf = eng(aValue, 1, 'bjt_model.vaf(value)');
    return this;
};

BjtModel.prototype.ikf = function (aValue) {
    this.attr.ikf = eng(aValue, 1, 'bjt_model.ikf(value)');
    return this;
};

BjtModel.prototype.nkf = function (aValue) {
    this.attr.nkf = eng(aValue, 1, 'bjt_model.nkf(value)');
    return this;
};

BjtModel.prototype.nk = function (aValue) {
    this.attr.nk = eng(aValue, 1, 'bjt_model.nk(value)');
    return this;
};

BjtModel.prototype.ise = function (aValue) {
    this.attr.ise = eng(aValue, 1, 'bjt_model.ise(value)');
    return this;
};

BjtModel.prototype.ne = function (aValue) {
    this.attr.ne = eng(aValue, 1, 'bjt_model.ne(value)');
    return this;
};

BjtModel.prototype.br = function (aValue) {
    this.attr.br = eng(aValue, 1, 'bjt_model.br(value)');
    return this;
};

BjtModel.prototype.nr = function (aValue) {
    this.attr.nr = eng(aValue, 1, 'bjt_model.nr(value)');
    return this;
};

BjtModel.prototype.var = function (aValue) {
    this.attr.var = eng(aValue, 1, 'bjt_model.var(value)');
    return this;
};

BjtModel.prototype.vb = function (aValue) {
    this.attr.vb = eng(aValue, 1, 'bjt_model.vb(value)');
    return this;
};

BjtModel.prototype.ikr = function (aValue) {
    this.attr.ikr = eng(aValue, 1, 'bjt_model.ikr(value)');
    return this;
};

BjtModel.prototype.isc = function (aValue) {
    this.attr.isc = eng(aValue, 1, 'bjt_model.isc(value)');
    return this;
};

BjtModel.prototype.nc = function (aValue) {
    this.attr.nc = eng(aValue, 1, 'bjt_model.nc(value)');
    return this;
};

BjtModel.prototype.rb = function (aValue) {
    this.attr.rb = eng(aValue, 1, 'bjt_model.rb(value)');
    return this;
};

BjtModel.prototype.irb = function (aValue) {
    this.attr.irb = eng(aValue, 1, 'bjt_model.irb(value)');
    return this;
};

BjtModel.prototype.rbm = function (aValue) {
    this.attr.rbm = eng(aValue, 1, 'bjt_model.rbm(value)');
    return this;
};

BjtModel.prototype.re = function (aValue) {
    this.attr.re = eng(aValue, 1, 'bjt_model.re(value)');
    return this;
};

BjtModel.prototype.rc = function (aValue) {
    this.attr.rc = eng(aValue, 1, 'bjt_model.rc(value)');
    return this;
};

BjtModel.prototype.cje = function (aValue) {
    this.attr.cje = eng(aValue, 1, 'bjt_model.cje(value)');
    return this;
};

BjtModel.prototype.vje = function (aValue) {
    this.attr.vje = eng(aValue, 1, 'bjt_model.vje(value)');
    return this;
};

BjtModel.prototype.pe = function (aValue) {
    this.attr.pe = eng(aValue, 1, 'bjt_model.pe(value)');
    return this;
};

BjtModel.prototype.mje = function (aValue) {
    this.attr.mje = eng(aValue, 1, 'bjt_model.mje(value)');
    return this;
};

BjtModel.prototype.me = function (aValue) {
    this.attr.me = eng(aValue, 1, 'bjt_model.me(value)');
    return this;
};

BjtModel.prototype.tf = function (aValue) {
    this.attr.tf = eng(aValue, 1, 'bjt_model.tf(value)');
    return this;
};

BjtModel.prototype.xtf = function (aValue) {
    this.attr.xtf = eng(aValue, 1, 'bjt_model.xtf(value)');
    return this;
};

BjtModel.prototype.vtf = function (aValue) {
    this.attr.vtf = eng(aValue, 1, 'bjt_model.vtf(value)');
    return this;
};

BjtModel.prototype.itf = function (aValue) {
    this.attr.itf = eng(aValue, 1, 'bjt_model.itf(value)');
    return this;
};

BjtModel.prototype.ptf = function (aValue) {
    this.attr.ptf = eng(aValue, 1, 'bjt_model.ptf(value)');
    return this;
};

BjtModel.prototype.cjc = function (aValue) {
    this.attr.cjc = eng(aValue, 1, 'bjt_model.cjc(value)');
    return this;
};

BjtModel.prototype.vjc = function (aValue) {
    this.attr.vjc = eng(aValue, 1, 'bjt_model.vjc(value)');
    return this;
};

BjtModel.prototype.pc = function (aValue) {
    this.attr.pc = eng(aValue, 1, 'bjt_model.pc(value)');
    return this;
};

BjtModel.prototype.mjc = function (aValue) {
    this.attr.mjc = eng(aValue, 1, 'bjt_model.mjc(value)');
    return this;
};

BjtModel.prototype.xcjc = function (aValue) {
    this.attr.xcjc = eng(aValue, 1, 'bjt_model.xcjc(value)');
    return this;
};

BjtModel.prototype.tr = function (aValue) {
    this.attr.tr = eng(aValue, 1, 'bjt_model.tr(value)');
    return this;
};

BjtModel.prototype.cjs = function (aValue) {
    this.attr.cjs = eng(aValue, 1, 'bjt_model.cjs(value)');
    return this;
};

BjtModel.prototype.vjs = function (aValue) {
    this.attr.vjs = eng(aValue, 1, 'bjt_model.vjs(value)');
    return this;
};

BjtModel.prototype.ps = function (aValue) {
    this.attr.ps = eng(aValue, 1, 'bjt_model.ps(value)');
    return this;
};

BjtModel.prototype.mjs = function (aValue) {
    this.attr.mjs = eng(aValue, 1, 'bjt_model.mjs(value)');
    return this;
};

BjtModel.prototype.ms = function (aValue) {
    this.attr.ms = eng(aValue, 1, 'bjt_model.ms(value)');
    return this;
};

BjtModel.prototype.xtb = function (aValue) {
    this.attr.xtb = eng(aValue, 1, 'bjt_model.xtb(value)');
    return this;
};

BjtModel.prototype.eg = function (aValue) {
    this.attr.eg = eng(aValue, 1, 'bjt_model.eg(value)');
    return this;
};

BjtModel.prototype.xti = function (aValue) {
    this.attr.xti = eng(aValue, 1, 'bjt_model.xti(value)');
    return this;
};

BjtModel.prototype.kf = function (aValue) {
    this.attr.kf = eng(aValue, 1, 'bjt_model.kf(value)');
    return this;
};

BjtModel.prototype.af = function (aValue) {
    this.attr.af = eng(aValue, 1, 'bjt_model.af(value)');
    return this;
};

BjtModel.prototype.fc = function (aValue) {
    this.attr.fc = eng(aValue, 1, 'bjt_model.fc(value)');
    return this;
};

BjtModel.prototype.tnom = function (aValue) {
    this.attr.tnom = eng(aValue, 1, 'bjt_model.tnom(value)');
    return this;
};

BjtModel.prototype.tref = function (aValue) {
    this.attr.tref = eng(aValue, 1, 'bjt_model.tref(value)');
    return this;
};

BjtModel.prototype.tlev = function (aValue) {
    this.attr.tlev = eng(aValue, 1, 'bjt_model.tlev(value)');
    return this;
};

BjtModel.prototype.tlevc = function (aValue) {
    this.attr.tlevc = eng(aValue, 1, 'bjt_model.tlevc(value)');
    return this;
};

BjtModel.prototype.tre1 = function (aValue) {
    this.attr.tre1 = eng(aValue, 1, 'bjt_model.tre1(value)');
    return this;
};

BjtModel.prototype.tre2 = function (aValue) {
    this.attr.tre2 = eng(aValue, 1, 'bjt_model.tre2(value)');
    return this;
};

BjtModel.prototype.trc1 = function (aValue) {
    this.attr.trc1 = eng(aValue, 1, 'bjt_model.trc1(value)');
    return this;
};

BjtModel.prototype.trc2 = function (aValue) {
    this.attr.trc2 = eng(aValue, 1, 'bjt_model.trc2(value)');
    return this;
};

BjtModel.prototype.trb1 = function (aValue) {
    this.attr.trb1 = eng(aValue, 1, 'bjt_model.trb1(value)');
    return this;
};

BjtModel.prototype.trb2 = function (aValue) {
    this.attr.trb2 = eng(aValue, 1, 'bjt_model.trb2(value)');
    return this;
};

BjtModel.prototype.trbm1 = function (aValue) {
    this.attr.trbm1 = eng(aValue, 1, 'bjt_model.trbm1(value)');
    return this;
};

BjtModel.prototype.trbm2 = function (aValue) {
    this.attr.trbm2 = eng(aValue, 1, 'bjt_model.trbm2(value)');
    return this;
};

BjtModel.prototype.tbf1 = function (aValue) {
    this.attr.tbf1 = eng(aValue, 1, 'bjt_model.tbf1(value)');
    return this;
};

BjtModel.prototype.tbf2 = function (aValue) {
    this.attr.tbf2 = eng(aValue, 1, 'bjt_model.tbf2(value)');
    return this;
};

BjtModel.prototype.tbr1 = function (aValue) {
    this.attr.tbr1 = eng(aValue, 1, 'bjt_model.tbr1(value)');
    return this;
};

BjtModel.prototype.tbr2 = function (aValue) {
    this.attr.tbr2 = eng(aValue, 1, 'bjt_model.tbr2(value)');
    return this;
};

BjtModel.prototype.tikf1 = function (aValue) {
    this.attr.tikf1 = eng(aValue, 1, 'bjt_model.tikf1(value)');
    return this;
};

BjtModel.prototype.tikf2 = function (aValue) {
    this.attr.tikf2 = eng(aValue, 1, 'bjt_model.tikf2(value)');
    return this;
};

BjtModel.prototype.tikr1 = function (aValue) {
    this.attr.tikr1 = eng(aValue, 1, 'bjt_model.tikr1(value)');
    return this;
};

BjtModel.prototype.tikr2 = function (aValue) {
    this.attr.tikr2 = eng(aValue, 1, 'bjt_model.tikr2(value)');
    return this;
};

BjtModel.prototype.tirb1 = function (aValue) {
    this.attr.tirb1 = eng(aValue, 1, 'bjt_model.tirb1(value)');
    return this;
};

BjtModel.prototype.tirb2 = function (aValue) {
    this.attr.tirb2 = eng(aValue, 1, 'bjt_model.tirb2(value)');
    return this;
};

BjtModel.prototype.tnc1 = function (aValue) {
    this.attr.tnc1 = eng(aValue, 1, 'bjt_model.tnc1(value)');
    return this;
};

BjtModel.prototype.tnc2 = function (aValue) {
    this.attr.tnc2 = eng(aValue, 1, 'bjt_model.tnc2(value)');
    return this;
};

BjtModel.prototype.tne1 = function (aValue) {
    this.attr.tne1 = eng(aValue, 1, 'bjt_model.tne1(value)');
    return this;
};

BjtModel.prototype.tne2 = function (aValue) {
    this.attr.tne2 = eng(aValue, 1, 'bjt_model.tne2(value)');
    return this;
};

BjtModel.prototype.tnf1 = function (aValue) {
    this.attr.tnf1 = eng(aValue, 1, 'bjt_model.tnf1(value)');
    return this;
};

BjtModel.prototype.tnf2 = function (aValue) {
    this.attr.tnf2 = eng(aValue, 1, 'bjt_model.tnf2(value)');
    return this;
};

BjtModel.prototype.tnr1 = function (aValue) {
    this.attr.tnr1 = eng(aValue, 1, 'bjt_model.tnr1(value)');
    return this;
};

BjtModel.prototype.tnr2 = function (aValue) {
    this.attr.tnr2 = eng(aValue, 1, 'bjt_model.tnr2(value)');
    return this;
};

BjtModel.prototype.tvaf1 = function (aValue) {
    this.attr.tvaf1 = eng(aValue, 1, 'bjt_model.tvaf1(value)');
    return this;
};

BjtModel.prototype.tvaf2 = function (aValue) {
    this.attr.tvaf2 = eng(aValue, 1, 'bjt_model.tvaf2(value)');
    return this;
};

BjtModel.prototype.tvar1 = function (aValue) {
    this.attr.tvar1 = eng(aValue, 1, 'bjt_model.tvar1(value)');
    return this;
};

BjtModel.prototype.tvar2 = function (aValue) {
    this.attr.tvar2 = eng(aValue, 1, 'bjt_model.tvar2(value)');
    return this;
};

BjtModel.prototype.ctc = function (aValue) {
    this.attr.ctc = eng(aValue, 1, 'bjt_model.ctc(value)');
    return this;
};

BjtModel.prototype.cte = function (aValue) {
    this.attr.cte = eng(aValue, 1, 'bjt_model.cte(value)');
    return this;
};

BjtModel.prototype.cts = function (aValue) {
    this.attr.cts = eng(aValue, 1, 'bjt_model.cts(value)');
    return this;
};

BjtModel.prototype.tvjc = function (aValue) {
    this.attr.tvjc = eng(aValue, 1, 'bjt_model.tvjc(value)');
    return this;
};

BjtModel.prototype.tvje = function (aValue) {
    this.attr.tvje = eng(aValue, 1, 'bjt_model.tvje(value)');
    return this;
};

BjtModel.prototype.titf1 = function (aValue) {
    this.attr.titf1 = eng(aValue, 1, 'bjt_model.titf1(value)');
    return this;
};

BjtModel.prototype.titf2 = function (aValue) {
    this.attr.titf2 = eng(aValue, 1, 'bjt_model.titf2(value)');
    return this;
};

BjtModel.prototype.ttf1 = function (aValue) {
    this.attr.ttf1 = eng(aValue, 1, 'bjt_model.ttf1(value)');
    return this;
};

BjtModel.prototype.ttf2 = function (aValue) {
    this.attr.ttf2 = eng(aValue, 1, 'bjt_model.ttf2(value)');
    return this;
};

BjtModel.prototype.ttr1 = function (aValue) {
    this.attr.ttr1 = eng(aValue, 1, 'bjt_model.ttr1(value)');
    return this;
};

BjtModel.prototype.ttr2 = function (aValue) {
    this.attr.ttr2 = eng(aValue, 1, 'bjt_model.ttr2(value)');
    return this;
};

BjtModel.prototype.tmje1 = function (aValue) {
    this.attr.tmje1 = eng(aValue, 1, 'bjt_model.tmje1(value)');
    return this;
};

BjtModel.prototype.tmje2 = function (aValue) {
    this.attr.tmje2 = eng(aValue, 1, 'bjt_model.tmje2(value)');
    return this;
};

BjtModel.prototype.tmjc1 = function (aValue) {
    this.attr.tmjc1 = eng(aValue, 1, 'bjt_model.tmjc1(value)');
    return this;
};

BjtModel.prototype.tmjc2 = function (aValue) {
    this.attr.tmjc2 = eng(aValue, 1, 'bjt_model.tmjc2(value)');
    return this;
};

BjtModel.prototype.rco = function (aValue) {
    this.attr.rco = eng(aValue, 1, 'bjt_model.rco(value)');
    return this;
};

BjtModel.prototype.vo = function (aValue) {
    this.attr.vo = eng(aValue, 1, 'bjt_model.vo(value)');
    return this;
};

BjtModel.prototype.gamma = function (aValue) {
    this.attr.gamma = eng(aValue, 1, 'bjt_model.gamma(value)');
    return this;
};

BjtModel.prototype.qco = function (aValue) {
    this.attr.qco = eng(aValue, 1, 'bjt_model.qco(value)');
    return this;
};

BjtModel.prototype.vg = function (aValue) {
    this.attr.vg = eng(aValue, 1, 'bjt_model.vg(value)');
    return this;
};

BjtModel.prototype.cn = function (aValue) {
    this.attr.cn = eng(aValue, 1, 'bjt_model.cn(value)');
    return this;
};

BjtModel.prototype.d = function (aValue) {
    this.attr.d = eng(aValue, 1, 'bjt_model.d(value)');
    return this;
};

BjtModel.prototype.validate = function () {
    // Validate device
    device_attr_check(this, this.attr, {
        name: {type: "string", min: 1, max: 100, required: true, alphanumeric: true, startalpha: !true},
        kind: {type: "string", allowed: ['NPN', 'PNP'], required: true},

        subs: {type: "number", allowed: [-1, 1]},
        is: {type: "number", min: 0, max: 1, eng: true, equation: true},
        ibe: {type: "number", min: 0, max: 1, eng: true, equation: true},
        ibc: {type: "number", min: 0, max: 1, eng: true, equation: true},
        iss: {type: "number", min: 0, max: 1, eng: true, equation: true},
        bf: {type: "number", min: 0, max: 1e6, eng: true, equation: true},
        nf: {type: "number", min: 0, max: 10, eng: true, equation: true},
        va: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        vaf: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        ikf: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        nkf: {type: "number", min: 0, max: 1, eng: true, equation: true},
        nk: {type: "number", min: 0, max: 1, eng: true, equation: true},
        ise: {type: "number", min: 0, max: 10, eng: true, equation: true},
        ne: {type: "number", min: 0, max: 10, eng: true, equation: true},
        br: {type: "number", min: 0, max: 100, eng: true, equation: true},
        nr: {type: "number", min: 0, max: 10, eng: true, equation: true},
        var: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        vb: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        ikr: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        isc: {type: "number", min: 0, max: 100, eng: true, equation: true},
        nc: {type: "number", min: 0, max: 100, eng: true, equation: true},
        rb: {type: "number", min: 0, max: 1e12, eng: true, equation: true},
        irb: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        rbm: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        re: {type: "number", min: 0, max: 1e6, eng: true, equation: true},
        rc: {type: "number", min: 0, max: 1e6, eng: true, equation: true},
        cje: {type: "number", min: 0, max: 10, eng: true, equation: true},
        vje: {type: "number", min: 0, max: 10, eng: true, equation: true},
        pe: {type: "number", min: 0, max: 10, eng: true, equation: true},
        mje: {type: "number", min: 0, max: 10, eng: true, equation: true},
        me: {type: "number", min: 0, max: 10, eng: true, equation: true},
        tf: {type: "number", min: 0, max: 1, eng: true, equation: true},
        xtf: {type: "number", min: 0, max: 1e9, eng: true, equation: true},
        vtf: {type: "number", min: 0, max: Infinity, eng: true, equation: true},
        itf: {type: "number", min: 0, max: 1000, eng: true, equation: true},
        ptf: {type: "number", min: -360, max: 360, eng: true, equation: true},
        cjc: {type: "number", min: 0, max: 10, eng: true, equation: true},
        vjc: {type: "number", min: 0, max: 10, eng: true, equation: true},
        pc: {type: "number", min: 0, max: 10, eng: true, equation: true},
        mjc: {type: "number", min: 0, max: 10, eng: true, equation: true},
        xcjc: {type: "number", min: 0, max: 10, eng: true, equation: true},
        tr: {type: "number", min: 0, max: 10, eng: true, equation: true},
        cjs: {type: "number", min: 0, max: 10, eng: true, equation: true},
        vjs: {type: "number", min: 0, max: 10, eng: true, equation: true},
        ps: {type: "number", min: 0, max: 10, eng: true, equation: true},
        mjs: {type: "number", min: 0, max: 10, eng: true, equation: true},
        ms: {type: "number", min: 0, max: 10, eng: true, equation: true},
        xtb: {type: "number", min: 0, max: 10, eng: true, equation: true},
        eg: {type: "number", min: 0, max: 100, eng: true, equation: true},
        xti: {type: "number", min: 0, max: 100, eng: true, equation: true},
        kf: {type: "number", min: 0, max: 10, eng: true, equation: true},
        af: {type: "number", min: 0, max: 10, eng: true, equation: true},
        fc: {type: "number", min: 0, max: 10, eng: true, equation: true},
        tnom: {type: "number", min: -273, max: 150, eng: true, equation: true},
        tref: {type: "number", min: -273, max: 150, eng: true, equation: true},
        tlev: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tlevc: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tre1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tre2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        trc1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        trc2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        trb1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        trb2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        trbm1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        trbm2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tbf1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tbf2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tbr1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tbr2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tikf1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tikf2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tikr1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tikr2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tirb1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tirb2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tnc1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tnc2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tne1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tne2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tnf1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tnf2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tnr1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tnr2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tvaf1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tvaf2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tvar1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tvar2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        ctc: {type: "number", min: 0, max: 100, eng: true, equation: true},
        cte: {type: "number", min: 0, max: 100, eng: true, equation: true},
        cts: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tvjc: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tvje: {type: "number", min: 0, max: 100, eng: true, equation: true},
        titf1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        titf2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        ttf1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        ttf2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        ttr1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        ttr2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tmje1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tmje2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tmjc1: {type: "number", min: 0, max: 100, eng: true, equation: true},
        tmjc2: {type: "number", min: 0, max: 100, eng: true, equation: true},
        rco: {type: "number", min: 0, max: 100, eng: true, equation: true},
        vo: {type: "number", min: 0, max: 100, eng: true, equation: true},
        gamma: {type: "number", min: 0, max: 1, eng: true, equation: true},
        qco: {type: "number", min: 0, max: 1, eng: true, equation: true},
        vg: {type: "number", min: 0, max: 100, eng: true, equation: true},
        cn: {type: "number", min: 0, max: 100, eng: true, equation: true},
        d: {type: "number", min: 0, max: 100, eng: true, equation: true}
    });
};

BjtModel.prototype.remove = function () {
    // Remove this device from netlist
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    BjtModel.models.splice(BjtModel.models.indexOf(this), 1);
    return this;
};

BjtModel.prototype.render = function () {
    // Render spice netlist
    this.validate();
    var spice = [];
    spice.push("* bjt model " + this.attr.name);
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

globalThis.exports = {BjtModel, bjt_model};
globalThis.bjt_model = bjt_model;
Internal.BjtModel = BjtModel;
