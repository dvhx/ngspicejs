// P-channel MOSFET transistor
// linter: ngspicejs-lint --internal
"use strict";

function MosfetP(aName, aD, aG, aS, aModel) {
    // Constructor
    assert_arguments_length(arguments, 0, 5, 'mosget_p(name,d,g,s,model)');
    this.type = 'mosfet_p';
    this.expected_prefix = ['T', 'Q', 'M', 'MOSFET'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = false;
    this.attr = {};
    // single attr value, e.g. mosfet_p({name: 'D1', anode: 1, cathode: 2, model: '1N5819'});
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

function mosfet_p(aName, aD, aG, aS, aModel) {
    // Add mosfet_p to netlist
    assert_arguments_length(arguments, 0, 5, 'mosget_p(name,d,g,s,model)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new MosfetP(aName);
    }
    return new MosfetP(aName, aD, aG, aS, aModel);
}

MosfetP.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'mosfet_p.name(name,allow_this_prefix)');
    assert_name(aName, 'mosfet_p');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

MosfetP.prototype.d = function (aNet) {
    // Set drain net
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.d(net)');
    assert_net(aNet, 'net', 'mosfet_p.d(net)');
    this.attr.d = aNet;
    return this;
};

MosfetP.prototype.g = function (aNet) {
    // Set gate net
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.g(net)');
    assert_net(aNet, 'net', 'mosfet_p.g(net)');
    this.attr.g = aNet;
    return this;
};

MosfetP.prototype.s = function (aNet) {
    // Set source net
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.s(net)');
    assert_net(aNet, 'net', 'mosfet_p.s(net)');
    this.attr.s = aNet;
    return this;
};

MosfetP.prototype.model = function (aModel) {
    // Set model
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.model(name)');
    assert_string(aModel, 'model', 'mosfet_p.model(model)');
    this.attr.model = aModel;
    assert_model_exists(this, this.type.toUpperCase(), aModel);
    return this;
};

MosfetP.prototype.get_model = function () {
    // Get model device specified by this device
    assert_arguments_length(arguments, 0, 0, 'mosfet_p.get_model()');
    assert_string(this.attr.model, this.attr.name + ' ' + this.type + '.attr.model');
    var m = find_model(this, this.type.toUpperCase(), this.attr.model);
    if (!m) {
        hint('Unlike spice, models needs to be defined before they are used!');
        throw new Exception('Unknown ' + this.type.toUpperCase() + ' model type ' + this.attr.model);
    }
    return m;
};

MosfetP.prototype.substrate = function (aNet) {
    // Set substrate net
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.substrate(net)');
    assert_net(aNet, 'net', 'mosfet_p.substrate(net)');
    this.attr.substrate = aNet;
    return this;
};

MosfetP.prototype.m = function (aValue) {
    // Set m parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.m(value)');
    this.attr.m = eng(aValue, 1, 'mosfet_p.m(value)');
    return this;
};

MosfetP.prototype.l = function (aValue) {
    // Set l parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.l(value)');
    this.attr.l = eng(aValue, 1, 'mosfet_p.l(value)');
    return this;
};

MosfetP.prototype.w = function (aValue) {
    // Set w parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.w(value)');
    this.attr.w = eng(aValue, 1, 'mosfet_p.w(value)');
    return this;
};

MosfetP.prototype.ad = function (aValue) {
    // Set ad parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.ad(value)');
    this.attr.ad = eng(aValue, 1, 'mosfet_p.ad(value)');
    return this;
};

MosfetP.prototype.as = function (aValue) {
    // Set as parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.as(value)');
    this.attr.as = eng(aValue, 1, 'mosfet_p.as(value)');
    return this;
};

MosfetP.prototype.pd = function (aValue) {
    // Set pd parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.pd(value)');
    this.attr.pd = eng(aValue, 1, 'mosfet_p.pd(value)');
    return this;
};

MosfetP.prototype.ps = function (aValue) {
    // Set ps parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.ps(value)');
    this.attr.ps = eng(aValue, 1, 'mosfet_p.ps(value)');
    return this;
};

MosfetP.prototype.nrd = function (aValue) {
    // Set nrd parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.nrd(value)');
    this.attr.nrd = eng(aValue, 1, 'mosfet_p.nrd(value)');
    return this;
};

MosfetP.prototype.nrs = function (aValue) {
    // Set nrs parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.nrs(value)');
    this.attr.nrs = eng(aValue, 1, 'mosfet_p.nrs(value)');
    return this;
};

MosfetP.prototype.off = function (aValue) {
    // Set off parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.off(value)');
    this.attr.off = eng(aValue, 1, 'mosfet_p.off(value)');
    return this;
};

MosfetP.prototype.ic_vds = function (aValue) {
    // Set ic_vds parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.ic_vds(value)');
    this.attr.ic_vds = eng(aValue, 1, 'mosfet_p.ic_vds(value)');
    return this;
};

MosfetP.prototype.ic_vgs = function (aValue) {
    // Set ic_vgs parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.ic_vgs(value)');
    this.attr.ic_vgs = eng(aValue, 1, 'mosfet_p.ic_vgs(value)');
    return this;
};

MosfetP.prototype.ic_vbs = function (aValue) {
    // Set ic_vbs parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.ic_vbs(value)');
    this.attr.ic_vbs = eng(aValue, 1, 'mosfet_p.ic_vbs(value)');
    return this;
};

MosfetP.prototype.temp = function (aValue) {
    // Set temp parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.temp(value)');
    this.attr.temp = eng(aValue, 1, 'mosfet_p.temp(value)');
    return this;
};

MosfetP.prototype.delvto = function (aValue) {
    // Set delvto parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.delvto(value)');
    this.attr.delvto = eng(aValue, 1, 'mosfet_p.delvto(value)');
    return this;
};

MosfetP.prototype.mulu0 = function (aValue) {
    // Set mulu0 parameter
    assert_arguments_length(arguments, 1, 1, 'mosfet_p.mulu0(value)');
    this.attr.mulu0 = eng(aValue, 1, 'mosfet_p.mulu0(value)');
    return this;
};

MosfetP.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'mosfet_p.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        d: {type: "net", required: true},
        g: {type: "net", required: true},
        s: {type: "net", required: true},
        substrate: {type: "net"},
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

MosfetP.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'mosfet_p.get_nets()');
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

MosfetP.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'mosfet_p.get_value()');
    return this.attr.model;
};


MosfetP.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'mosfet_p.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

MosfetP.prototype.render = function () {
    // Render spice netlist for this mosfet_p
    assert_arguments_length(arguments, 0, 0, 'mosfet_p.render()');
    var spice = ["* mosfet_p " + this.attr.name];
    var a = [];
    var m = find_model(this, 'MOSFET_P', this.attr.model);
    var is_mos = m.type === 'mos_model' || m.type === 'vdmos_model';
    var is_sub = m.type === 'sub_model' || m.type === 'spice_model';
    if (!is_mos && !is_sub) {
        throw new Exception('Unknown MOSFET_P model type ' + m.type);
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
    if (this.attr.substrate) {
        a.push(this.attr.substrate);
    }
    if (is_sub) {
        a.push(this.attr.model);
    }
    if (is_mos) {
        a.push('Q' + this.attr.model);
    }
    if (is_mos) {
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

globalThis.exports = {MosfetP, mosfet_p};
Internal.MosfetP = MosfetP;
globalThis.mosfet_p = mosfet_p;
Internal.device_constructor.mosfet_p = mosfet_p;
