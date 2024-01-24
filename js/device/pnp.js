// PNP BJT transistor
// linter: ngspicejs-lint --internal
"use strict";

function PNP(aName, aC, aB, aE, aModel) {
    // Constructor
    this.type = 'pnp';
    this.expected_prefix = ['Q', 'T'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = false;
    this.attr = {};
    assert_arguments_length(arguments, 0, 5, 'pnp(name,c,b,e,model)');
    // single attr value, e.g. pnp({name: 'D1', anode: 1, cathode: 2, model: '1N5819'});
    if (arguments.length === 1 && typeof aName === 'object') {
        object_merge(this.attr, aName);
        this.validate();
        return;
    }
    // individual arguments
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

function pnp(aName, aC, aB, aE, aModel) {
    // Add PNP transistor to netlist
    assert_arguments_length(arguments, 0, 5, 'pnp(name,c,b,e,model)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new PNP(aName);
    }
    return new PNP(aName, aC, aB, aE, aModel);
}

PNP.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'pnp.name(name,allow_this_prefix)');
    assert_name(aName, 'pnp');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

PNP.prototype.c = function (aNet) {
    // Set collector net
    assert_arguments_length(arguments, 1, 1, 'pnp.c(net)');
    assert_net(aNet, 'net', 'pnp.c(net)');
    this.attr.c = aNet;
    return this;
};

PNP.prototype.b = function (aNet) {
    // Set base net
    assert_arguments_length(arguments, 1, 1, 'pnp.b(net)');
    assert_net(aNet, 'net', 'pnp.b(net)');
    this.attr.b = aNet;
    return this;
};

PNP.prototype.e = function (aNet) {
    // Set emitter net
    assert_arguments_length(arguments, 1, 1, 'pnp.e(net)');
    assert_net(aNet, 'net', 'pnp.e(net)');
    this.attr.e = aNet;
    return this;
};

PNP.prototype.model = function (aModel) {
    // Set model name
    assert_arguments_length(arguments, 1, 1, 'pnp.model(name)');
    assert_string(aModel, 'model', 'pnp.model(model)');
    this.attr.model = aModel;
    assert_model_exists(this, this.type.toUpperCase(), aModel);
    return this;
};

PNP.prototype.get_model = function () {
    // Get model device specified by this device
    assert_arguments_length(arguments, 0, 0, 'pnp.get_model()');
    assert_string(this.attr.model, this.attr.name + ' ' + this.type + '.attr.model');
    var m = find_model(this, this.type.toUpperCase(), this.attr.model);
    if (!m) {
        hint('Unlike spice, models needs to be defined before they are used!');
        throw new Exception('Unknown ' + this.type.toUpperCase() + ' model type ' + this.attr.model);
    }
    return m;
};

PNP.prototype.area = function (aValue) {
    // Set emitter area
    assert_arguments_length(arguments, 1, 1, 'pnp.area(value)');
    this.attr.area = eng(aValue, 1, 'npn.area(value)');
    return this;
};

PNP.prototype.areab = function (aValue) {
    // Set base area
    assert_arguments_length(arguments, 1, 1, 'pnp.areab(value)');
    this.attr.areab = eng(aValue, 1, 'npn.areab(value)');
    return this;
};

PNP.prototype.areac = function (aValue) {
    // Set base area
    assert_arguments_length(arguments, 1, 1, 'pnp.areac(value)');
    this.attr.areac = eng(aValue, 1, 'npn.areac(value)');
    return this;
};

PNP.prototype.ns = function (aNet) {
    // Substrate node
    assert_arguments_length(arguments, 1, 1, 'pnp.ns(value)');
    assert_net(aNet, 'net', 'npn.ns(net)');
    this.attr.ns = aNet;
    return this;
};

PNP.prototype.tj = function (aValue) {
    // Junction temperature node for WBIC
    assert_arguments_length(arguments, 1, 1, 'pnp.tj(value)');
    this.attr.tj = eng(aValue, 1, 'npn.tj(value)');
    return this;
};

PNP.prototype.m = function (aValue) {
    // Multiplier
    assert_arguments_length(arguments, 1, 1, 'pnp.m(value)');
    this.attr.m = eng(aValue, 1, 'npn.m(value)');
    return this;
};

PNP.prototype.off = function (aValue) {
    // Initial condition for DC analysis
    assert_arguments_length(arguments, 1, 1, 'pnp.off(value)');
    this.attr.off = eng(aValue, 1, 'npn.off(value)');
    return this;
};

PNP.prototype.ic = function (aVbe,aVce) {
    // Requires UIC in tran
    assert_arguments_length(arguments, 2, 2, 'pnp.ic(vbe,vce)');
    this.attr.ic_vbe = eng(aVbe, 1, 'npn.ic(aVbe,aVce)');
    this.attr.ic_vce = eng(aVce, 2, 'npn.ic(aVbe,aVce)');
    return this;
};

PNP.prototype.temp = function (aValue) {
    // Temperature
    assert_arguments_length(arguments, 1, 1, 'pnp.temp(value)');
    this.attr.temp = eng(aValue, 1, 'npn.temp(value)');
    return this;
};

PNP.prototype.dtemp = function (aValue) {
    // Relative temperature
    assert_arguments_length(arguments, 1, 1, 'pnp.dtemp(value)');
    this.attr.dtemp = eng(aValue, 1, 'npn.dtemp(value)');
    return this;
};

PNP.prototype.m = function (aValue) {
    // Multiplier
    assert_arguments_length(arguments, 1, 1, 'pnp.m(value)');
    this.attr.m = eng(aValue, 1, 'npn.m(value)');
    return this;
};

PNP.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'pnp.validate()');
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
        dtemp: {type: 'number', min: 0, max: 1000, eng: true, equation: true}
    });
    device_attr_assign(this, this.attr);
};

PNP.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'pnp.get_nets()');
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

PNP.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'pnp.get_value()');
    return this.attr.model;
};

PNP.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'pnp.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

PNP.prototype.render = function () {
    // Render spice netlist for this device
    assert_arguments_length(arguments, 0, 0, 'pnp.render()');
    var a = [], is_bjt, is_sub, KIND = this.type.toUpperCase(),
        m = find_model(this, KIND, this.attr.model),
        only_for_bjt = ['tj', 'area', 'areac', 'areab', 'm', 'off', 'ic_vbe', 'ic_vce', 'temp', 'dtemp'];
    if (!m) {
        throw new Exception('Unknown ' + KIND + ' model type ' + m.type);
    }
    is_bjt = m.type === 'bjt_model';
    is_sub = m.type === 'sub_model' || m.type === 'spice_model';
    if (!is_bjt && !is_sub) {
        throw new Exception(KIND + ' model type ' + m.type + ' not supported, only bjt_model, sub_model, spice_model are supported');
    }
    if (is_sub) {
        only_for_bjt.forEach((s) => {
            if (Object.hasOwn(this.attr, s)) {
                throw new Exception(KIND + " transistor with " + m.type + " cannot use parameter " + s + ", only bjt_model can use it");
            }
        });
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
    if (is_bjt) {
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
            a.push(this.attr.off);
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
    }
    a = a.join(' ');

    return a;
};

globalThis.exports = {PNP,pnp};
Internal.PNP = PNP;
globalThis.pnp = pnp;
Internal.device_constructor.pnp = pnp;
