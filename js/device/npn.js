// NPN BJT transistor
// linter: ngspicejs-lint --internal
"use strict";

function NPN(aName, aC, aB, aE, aModel) {
    // Constructor
    assert_arguments_length(arguments, 0, 5, 'npn(name,c,b,e,model)');
    this.type = 'npn';
    this.expected_prefix = ['Q', 'T'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = false;
    this.attr = {};
    // single attr value, e.g. npn({name: 'D1', anode: 1, cathode: 2, model: '1N5819'});
    if (arguments.length === 1 && typeof aName === 'object') {
        object_merge(this.attr, aName);
        this.validate();
        return;
    }
    // 4 arguments, e.g. npn('D1', 1, 0, '1N5819');
    if (aName !== undefined) {
        this.name(aName);
    }
    if (aC !== undefined) {
        this.c(aC);
    }
    if (aB !== undefined) {
        this.b(aB);
    }
    if (aE !== undefined) {
        this.e(aE);
    }
    if (aModel !== undefined) {
        this.model(aModel);
    }
}

function npn(aName, aC, aB, aE, aModel) {
    // Add npn to netlist
    assert_arguments_length(arguments, 0, 5, 'npn(name,c,b,e,model)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new NPN(aName);
    }
    return new NPN(aName, aC, aB, aE, aModel);
}

NPN.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 1, 'npn.name(name,allow_this_prefix)');
    assert_name(aName, 'npn');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

NPN.prototype.c = function (aNet) {
    // Set collector net
    assert_arguments_length(arguments, 1, 1, 'npn.c(net)');
    assert_net(aNet, 'net', 'npn.c(net)');
    this.attr.c = aNet;
    return this;
};

NPN.prototype.b = function (aNet) {
    // Set base net
    assert_arguments_length(arguments, 1, 1, 'npn.b(net)');
    assert_net(aNet, 'net', 'npn.b(net)');
    this.attr.b = aNet;
    return this;
};

NPN.prototype.e = function (aNet) {
    // Set emitter net
    assert_arguments_length(arguments, 1, 1, 'npn.e(net)');
    assert_net(aNet, 'net', 'npn.e(net)');
    this.attr.e = aNet;
    return this;
};

NPN.prototype.model = function (aModel) {
    // Set model name
    assert_arguments_length(arguments, 1, 1, 'npn.model(name)');
    assert_string(aModel, 'model', 'npn.model(model)');
    this.attr.model = aModel;
    assert_model_exists(this, this.type.toUpperCase(), aModel);
    return this;
};

NPN.prototype.get_model = function () {
    // Get model device specified by this device
    assert_arguments_length(arguments, 0, 0, 'npn.get_model()');
    assert_string(this.attr.model, this.attr.name + ' ' + this.type + '.attr.model');
    var m = find_model(this, this.type.toUpperCase(), this.attr.model);
    if (!m) {
        hint('Unlike spice, models needs to be defined before they are used!');
        throw new Exception('Unknown ' + this.type.toUpperCase() + ' model type ' + this.attr.model);
    }
    return m;
};

NPN.prototype.area = function (aValue) {
    // Emitter area
    assert_arguments_length(arguments, 1, 1, 'npn.area(value)');
    this.attr.area = eng(aValue, 1, 'npn.area(value)');
    return this;
};

NPN.prototype.areab = function (aValue) {
    // Set base area
    assert_arguments_length(arguments, 1, 1, 'npn.areab(value)');
    this.attr.areab = eng(aValue, 1, 'npn.areab(value)');
    return this;
};

NPN.prototype.areac = function (aValue) {
    // Set collector area
    assert_arguments_length(arguments, 1, 1, 'npn.areac(value)');
    this.attr.areac = eng(aValue, 1, 'npn.areac(value)');
    return this;
};

NPN.prototype.ns = function (aNet) {
    // Set substrate net
    assert_arguments_length(arguments, 1, 1, 'npn.ns(value)');
    assert_net(aNet, 'net', 'npn.ns(net)');
    this.attr.ns = aNet;
    return this;
};

NPN.prototype.tj = function (aValue) {
    // Set junction temperature node for WBIC
    assert_arguments_length(arguments, 1, 1, 'npn.tj(value)');
    this.attr.tj = eng(aValue, 1, 'npn.tj(value)');
    return this;
};

NPN.prototype.m = function (aValue) {
    // Set multiplier
    assert_arguments_length(arguments, 1, 1, 'npn.m(value)');
    this.attr.m = eng(aValue, 1, 'npn.m(value)');
    return this;
};

NPN.prototype.off = function (aValue) {
    // Set initial condition for DC analysis
    assert_arguments_length(arguments, 1, 1, 'npn.off(value)');
    this.attr.off = eng(aValue, 1, 'npn.off(value)');
    return this;
};

NPN.prototype.ic_vbe = function (aValue) {
    // Set ic_vbe (requires UIC in tran)
    assert_arguments_length(arguments, 1, 1, 'npn.ic_vbe(value)');
    this.attr.ic_vbe = eng(aValue, 1, 'npn.ic_vbe(aValue)');
    return this;
};

NPN.prototype.ic_vce = function (aValue) {
    // Set ic_bve (requires UIC in tran)
    assert_arguments_length(arguments, 1, 1, 'npn.ic_vce(value)');
    this.attr.ic_vce = eng(aValue, 1, 'npn.ic_vce(aValue)');
    return this;
};

NPN.prototype.temp = function (aValue) {
    // Set temperature
    assert_arguments_length(arguments, 1, 1, 'npn.temp(value)');
    this.attr.temp = eng(aValue, 1, 'npn.temp(value)');
    return this;
};

NPN.prototype.dtemp = function (aValue) {
    // Set relative temperature
    assert_arguments_length(arguments, 1, 1, 'npn.dtemp(value)');
    this.attr.dtemp = eng(aValue, 1, 'npn.dtemp(value)');
    return this;
};

NPN.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'npn.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        c: {type: "net", required: true},
        b: {type: "net", required: true},
        e: {type: "net", required: true},
        ns: {type: "net", required: false},
        model: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: false},
        tj: {type: 'number', min: 0, max: 1000, eng: true, equation: true},
        area: {type: 'number', min: 0, max: 1000, eng: true, equation: true},
        areac: {type: 'number', min: 0, max: 1000, eng: true, equation: true},
        areab: {type: 'number', min: 0, max: 1000, eng: true, equation: true},
        m: {type: 'number', min: 0, max: 1000, eng: true, equation: true},
        off: {type: 'number', min: 0, max: 1000, eng: true, equation: true},
        ic_vbe: {type: 'number', min: 0, max: 1000, eng: true, equation: true},
        ic_vce: {type: 'number', min: 0, max: 1000, eng: true, equation: true},
        temp: {type: 'number', min: 0, max: 1000, eng: true, equation: true},
        dtemp: {type: 'number', min: -1000, max: 1000, eng: true, equation: true}
    });
    device_attr_assign(this, this.attr);
};

NPN.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'npn.get_nets()');
    var o = {
        c: this.attr.c,
        b: this.attr.b,
        e: this.attr.e
    };
    if (this.attr.ns || (this.attr.ns === 0)) {
        o.ns = this.attr.ns;
    }
    return o;
};

NPN.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'npn.get_value()');
    return this.attr.model;
};

NPN.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'npn.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

NPN.prototype.render = function () {
    // Render spice netlist for this device
    assert_arguments_length(arguments, 0, 0, 'npn.render()');
    var a = [], is_bjt, is_sub, KIND = this.type.toUpperCase(),
        m = find_model(this, KIND, this.attr.model);
    if (!m) {
        throw new Exception('Unknown ' + KIND + ' model type ' + m.type);
    }
    is_bjt = m.type === 'bjt_model';
    is_sub = m.type === 'sub_model' || m.type === 'spice_model';
    if (!is_bjt && !is_sub) {
        throw new Exception(KIND + ' model type ' + m.type + ' not supported, only bjt_model, sub_model, spice_model are supported');
    }

    // QXXXXXXX nc nb ne <ns> <tj> mname <area=val> <areac=val>
    // + <areab=val> <m=val> <off> <ic=vbe,vce> <temp = val>
    // + <dtemp=val>
    if (is_bjt) {
        a.push("Q_" + this.attr.name);
    }
    if (is_sub) {
        a.push("x_" + this.attr.name);
    }
    a.push(this.attr.c);
    a.push(this.attr.b);
    a.push(this.attr.e);
    if (this.attr.ns !== undefined) {
        a.push(this.attr.ns);
    }
    if (this.attr.tj !== undefined) {
        a.push(this.attr.tj);
    }
    // model name
    if (is_bjt) {
        a.push('Q' + this.attr.model);
    }
    if (is_sub) {
        a.push(this.attr.model);
    }
    if (this.attr.area !== undefined) {
        a.push('area=' + this.attr.area);
    }
    if (this.attr.areac !== undefined) {
        a.push('areac=' + this.attr.areac);
    }
    if (this.attr.areab !== undefined) {
        a.push('areab=' + this.attr.areab);
    }
    if (this.attr.m !== undefined) {
        a.push('m=' + this.attr.m);
    }
    if (this.attr.off !== undefined) {
        a.push('off=' + this.attr.off);
    }
    if (this.attr.ic_vbe !== undefined || this.attr.ic_vce !== undefined) {
        if (this.attr.ic_vbe === undefined || this.attr.ic_vce === undefined) {
            error('In BJT transistor ' + this.attr.name + " both ic_vbe and ic_vce must be set!");
        }
        a.push('ic=' + this.attr.ic_vbe + ',' + this.attr.ic_vce);
    }
    if (this.attr.temp !== undefined) {
        a.push('temp=' + this.attr.temp);
    }
    if (this.attr.dtemp !== undefined) {
        a.push('dtemp=' + this.attr.dtemp);
    }
    a = a.join(' ');

    return a;
};

globalThis.exports = {NPN,npn};
Internal.NPN = NPN;
globalThis.npn = npn;
Internal.device_constructor.npn = npn;
