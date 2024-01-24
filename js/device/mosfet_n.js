// N-channel MOSFET transistor
// linter: ngspicejs-lint --internal
"use strict";

function MosfetN(aName, aD, aG, aS, aModel) {
    // Constructor
    this.type = 'mosfet_n';
    this.expected_prefix = ['T', 'Q', 'MOSFET', 'M'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = false;
    this.attr = {};
    assert_arguments_length(arguments, 0, 5, 'mosget_n(name,d,g,s,model)');
    // single attr value, e.g. mosfet_n({name: 'D1', anode: 1, cathode: 2, model: '1N5819'});
    if (arguments.length === 1 && typeof aName === 'object') {
        object_merge(this.attr, aName);
        this.validate();
        return;
    }
    // individual arguments
    if (aName !== undefined) {
        this.name(aName);
    }
    if (aD !== undefined) {
        this.d(aD);
    }
    if (aG !== undefined) {
        this.g(aG);
    }
    if (aS !== undefined) {
        this.s(aS);
    }
    if (aModel !== undefined) {
        this.model(aModel);
    }
}

function mosfet_n(aName, aD, aG, aS, aModel) {
    // Add mosfet_n to netlist
    assert_arguments_length(arguments, 0, 5, 'mosget_n(name,d,g,s,model)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new MosfetN(aName);
    }
    return new MosfetN(aName, aD, aG, aS, aModel);
}

MosfetN.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'mosfet_n.name(name,allow_this_prefix)');
    assert_name(aName, 'mosfet_n');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

MosfetN.prototype.d = function (aNet) {
    // Set drain net
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.d(net)');
    assert_net(aNet, 'net', 'mosfet_n.d(net)');
    this.attr.d = aNet;
    return this;
};

MosfetN.prototype.g = function (aNet) {
    // Set gate net
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.g(net)');
    assert_net(aNet, 'net', 'mosfet_n.g(net)');
    this.attr.g = aNet;
    return this;
};

MosfetN.prototype.s = function (aNet) {
    // Set source net
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.s(net)');
    assert_net(aNet, 'net', 'mosfet_n.s(net)');
    this.attr.s = aNet;
    return this;
};

MosfetN.prototype.substrate = function (aNet) {
    // Set substrate net
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.substrate(net)');
    assert_net(aNet, 'net', 'mosfet_n.substrate(net)');
    this.attr.substrate = aNet;
    return this;
};

MosfetN.prototype.model = function (aModel) {
    // Set model name
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.model(value)');
    assert_string(aModel, 'model', 'mosfet_n.model(model)');
    this.attr.model = aModel;
    assert_model_exists(this, this.type.toUpperCase(), aModel);
    return this;
};

MosfetN.prototype.get_model = function () {
    // Get model device specified by this device
    assert_arguments_length(arguments, 0, 0, 'mosfet_n.get_model()');
    assert_string(this.attr.model, this.attr.name + ' ' + this.type + '.attr.model');
    var m = find_model(this, this.type.toUpperCase(), this.attr.model);
    if (!m) {
        hint('Unlike spice, models needs to be defined before they are used!');
        throw new Exception('Unknown ' + this.type.toUpperCase() + ' model type ' + this.attr.model);
    }
    return m;
};

MosfetN.prototype.m = function (aValue) {
    // Set m parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.m(value)');
    this.attr.m = eng(aValue, 1, 'mosfet_n.m(value)');
    return this;
};

MosfetN.prototype.l = function (aValue) {
    // Set l parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.l(value)');
    this.attr.l = eng(aValue, 1, 'mosfet_n.l(value)');
    return this;
};

MosfetN.prototype.w = function (aValue) {
    // Set w parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.w(value)');
    this.attr.w = eng(aValue, 1, 'mosfet_n.w(value)');
    return this;
};

MosfetN.prototype.ad = function (aValue) {
    // Set ad parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.ad(value)');
    this.attr.ad = eng(aValue, 1, 'mosfet_n.ad(value)');
    return this;
};

MosfetN.prototype.as = function (aValue) {
    // Set as parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.as(value)');
    this.attr.as = eng(aValue, 1, 'mosfet_n.as(value)');
    return this;
};

MosfetN.prototype.pd = function (aValue) {
    // set pd parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.pd(value)');
    this.attr.pd = eng(aValue, 1, 'mosfet_n.pd(value)');
    return this;
};

MosfetN.prototype.ps = function (aValue) {
    // Set ps parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.ps(value)');
    this.attr.ps = eng(aValue, 1, 'mosfet_n.ps(value)');
    return this;
};

MosfetN.prototype.nrd = function (aValue) {
    // Set nrd parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.nrd(value)');
    this.attr.nrd = eng(aValue, 1, 'mosfet_n.nrd(value)');
    return this;
};

MosfetN.prototype.nrs = function (aValue) {
    // Set nrs parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.nrs(value)');
    this.attr.nrs = eng(aValue, 1, 'mosfet_n.nrs(value)');
    return this;
};

MosfetN.prototype.off = function (aValue) {
    // Set off parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.off(value)');
    this.attr.off = eng(aValue, 1, 'mosfet_n.off(value)');
    return this;
};

MosfetN.prototype.ic_vds = function (aValue) {
    // Set ic_vds parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.ic_vds(value)');
    this.attr.ic_vds = eng(aValue, 1, 'mosfet_n.ic_vds(value)');
    return this;
};

MosfetN.prototype.ic_vgs = function (aValue) {
    // Set ic_vgs parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.ic_vgs(value)');
    this.attr.ic_vgs = eng(aValue, 1, 'mosfet_n.ic_vgs(value)');
    return this;
};

MosfetN.prototype.ic_vbs = function (aValue) {
    // Set ic_vbs parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.ic_vbs(value)');
    this.attr.ic_vbs = eng(aValue, 1, 'mosfet_n.ic_vbs(value)');
    return this;
};

MosfetN.prototype.temp = function (aValue) {
    // Set temp parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.temp(value)');
    this.attr.temp = eng(aValue, 1, 'mosfet_n.temp(value)');
    return this;
};

MosfetN.prototype.delvto = function (aValue) {
    // Set delvto parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.delvto(value)');
    this.attr.delvto = eng(aValue, 1, 'mosfet_n.delvto(value)');
    return this;
};

MosfetN.prototype.mulu0 = function (aValue) {
    // Set mulu0 parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_n.mulu0(value)');
    this.attr.mulu0 = eng(aValue, 1, 'mosfet_n.mulu0(value)');
    return this;
};

MosfetN.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'mosfet_n.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        d: {type: "net", required: true},
        g: {type: "net", required: true},
        s: {type: "net", required: true},
        substrate: {type: "net", note: "Substrate (bulk) node"},
        model: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: false},
        m: {type: "number", min: 0.001, max: 1000, note: "Multiplier parameter, simulates M parallel devices", eng: true, equation: true},
        l: {type: "number", min: 1e-12, max: 0.1, note: "Channel length in meters", eng: true, equation: true},
        w: {type: "number", min: 1e-12, max: 0.1, note: "Channel width in meters", eng: true, equation: true},
        ad: {type: "number", min: 0, max: 1, note: "Drain diffusion area in square meters", eng: true, equation: true},
        as: {type: "number", min: 0, max: 1, note: "Source diffusion area in square meters", eng: true, equation: true},
        pd: {type: "number", min: 0, max: 1, note: "Perimeter of drain junction in meters", eng: true, equation: true},
        ps: {type: "number", min: 0, max: 1, note: "Perimeter of source junction in meters", eng: true, equation: true},
        nrd: {type: "number", min: 0, max: 1, note: "Number of equivalent squares of drain diffusions", eng: true, equation: true},
        nrs: {type: "number", min: 0, max: 1, note: "Number of equivalent squares of source diffusions", eng: true, equation: true},
        off: {type: "number", note: "Initial condition on the device for DC analysis", eng: true, equation: true},
        ic_vds: {type: "number", min: -1000, max: 1000, note: "Initial Vds condition for UIC of TRAN analysis", eng: true, equation: true},
        ic_vgs: {type: "number", min: -1000, max: 1000, note: "Initial Vgs condition for UIC of TRAN analysis", eng: true, equation: true},
        ic_vbs: {type: "number", min: -1000, max: 1000, note: "Initial Vbs (substrate/bulk to source voltage) condition for UIC of TRAN analysis", eng: true, equation: true},
        temp: {type: "number", min: -273, max: 1000, note: "Temperature, valid only for model level 1,2,3 and 6", eng: true, equation: true},
        delvto: {type: "number", min: 0, max: 100, note: "Threshold voltage shift, BSIM3/BSIM4/BSIMSOI only", eng: true, equation: true},
        mulu0: {type: "number", min: 0, max: 100, note: "Low-field mobility multiplier (U0), BSIM3/BSIM4/BSIMSOI only", eng: true, equation: true},
    });
    device_attr_assign(this, this.attr);
};

MosfetN.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'mosfet_n.get_nets()');
    var o = {
        d: this.attr.d,
        g: this.attr.g,
        s: this.attr.s,
    };
    if (this.attr.substrate || (this.attr.substrate === 0)) {
        o.substrate = this.attr.substrate;
    }
    return o;
};

MosfetN.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'mosfet_n.get_value()');
    return this.attr.model;
};

MosfetN.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'mosfet_n.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

MosfetN.prototype.render = function () {
    // Render spice netlist for this mosfet_n
    assert_arguments_length(arguments, 0, 0, 'mosfet_n.render()');
    var spice = ["* mosfet_n " + this.attr.name];
    var a = [];
    var m = find_model(this, 'MOSFET_N', this.attr.model);
    var is_mos = m.type === 'mos_model' || m.type === 'vdmos_model';
    var is_sub = m.type === 'sub_model' || m.type === 'spice_model';
    if (!is_mos && !is_sub) {
        throw new Exception('Unknown MOSFET_N model type ' + m.type);
    }
    // MXXXXXXX nd ng ns nb mname <m=val> <l=val> <w=val>
    // + <ad=val> <as=val> <pd=val> <ps=val> <nrd=val>
    // + <nrs=val> <off> <ic=vds,vgs,vbs> <temp=t>
    if (is_sub) {
        a.push('x_' + this.attr.name);
    }
    if (is_mos) {
        a.push('M_' + this.attr.name);
    }
    a.push(this.attr.d);
    a.push(this.attr.g);
    a.push(this.attr.s);
    if (is_mos) {
        a.push(this.attr.substrate || this.attr.s);
    } else {
        if (this.attr.substrate) {
            a.push(this.attr.substrate);
        }
    }
    if (is_sub) {
        a.push(this.attr.model);
    }
    if (is_mos) {
        a.push('Q' + this.attr.model);
    }
    if (is_mos || is_sub) {
        if (this.attr.m !== undefined) {
            a.push('m=' + this.attr.m);
        }
        if (this.attr.l !== undefined) {
            a.push('l=' + this.attr.l);
        }
        if (this.attr.w !== undefined) {
            a.push('w=' + this.attr.w);
        }
        if (this.attr.ad !== undefined) {
            a.push('ad=' + this.attr.ad);
        }
        if (this.attr.as !== undefined) {
            a.push('as=' + this.attr.as);
        }
        if (this.attr.pd !== undefined) {
            a.push('pd=' + this.attr.pd);
        }
        if (this.attr.ps !== undefined) {
            a.push('ps=' + this.attr.ps);
        }
        if (this.attr.nrd !== undefined) {
            a.push('nrd=' + this.attr.nrd);
        }
        if (this.attr.nrs !== undefined) {
            a.push('nrs=' + this.attr.nrs);
        }
        if (this.attr.off !== undefined) {
            a.push(this.attr.off);
        }
        if (this.attr.ic_vds !== undefined || this.attr.ic_vgs !== undefined || this.attr.ic_vbs !== undefined) {
            a.push('ic=' + this.attr.ic_vds + ',' + this.attr.ic_vgs + ',' + this.attr.ic_vbs);
        }
        if (this.attr.temp !== undefined) {
            a.push('temp=' + this.attr.temp);
        }
        if (this.attr.delvto !== undefined) {
            a.push('delvto=' + this.attr.delvto);
        }
        if (this.attr.mulu0 !== undefined) {
            a.push('mulu0=' + this.attr.mulu0);
        }
    }
    spice.push(a.join(' '));
    return spice.join('\n');
};

globalThis.exports = {MosfetN, mosfet_n};
Internal.MosfetN = MosfetN;
globalThis.mosfet_n = mosfet_n;
Internal.device_constructor.mosfet_n = mosfet_n;
