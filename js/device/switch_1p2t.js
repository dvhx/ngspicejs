// Single pole double throw switch 1P2T
// linter: ngspicejs-lint --internal
"use strict";

function Switch1P2T(aName, aInput, aOutput1, aOutput2, aState, aRon, aRoff, aTimeline) {
    // Constructor
    assert_arguments_length(arguments, 0, 8, 'switch_1p2t(name,input,output1,output2,state,ron,roff,timeline)');
    this.type = 'switch_1p2t';
    this.expected_prefix = ['S', 'SW'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = false;
    this.attr = {state: 1, ron: 0.01, roff: 100e9, timeline: []};
    // all attr as object in first argument
    if (arguments.length === 1 && typeof aName === 'object') {
        object_merge(this.attr, aName);
        this.validate();
        return;
    }
    // individual arguments
    if (aName !== undefined) {
        this.name(aName);
    }
    if (aInput !== undefined) {
        this.input(aInput);
    }
    if (aOutput1 !== undefined) {
        this.output1(aOutput1);
    }
    if (aOutput2 !== undefined) {
        this.output2(aOutput2);
    }
    if (aState !== undefined) {
        this.state(aState);
    }
    if (aRon !== undefined) {
        this.ron(aRon);
    }
    if (aRoff !== undefined) {
        this.roff(aRoff);
    }
    if (aTimeline !== undefined) {
        this.timeline(aTimeline);
    }
}

function switch_1p2t(aName, aInput, aOutput1, aOutput2, aState, aRon, aRoff, aTimeline) {
    // Add switch_1p2t to netlist
    assert_arguments_length(arguments, 0, 8, 'switch_1p2t(name,input,output1,output2,state,ron,roff,timeline)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Switch1P2T(aName);
    }
    return new Switch1P2T(aName, aInput, aOutput1, aOutput2, aState, aRon, aRoff, aTimeline);
}

Switch1P2T.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 1, 'switch_1p2t.name(name,allow_this_prefix)');
    assert_name(aName, 'switch_1p2t');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Switch1P2T.prototype.input = function (aNet) {
    // Set input net name
    assert_arguments_length(arguments, 1, 1, 'switch_1p2t.input(net)');
    assert_net(aNet, 'net', 'switch_1p2t.input(net)');
    this.attr.input = aNet;
    return this;
};

Switch1P2T.prototype.output1 = function (aNet) {
    // Set output1 net name
    assert_arguments_length(arguments, 1, 1, 'switch_1p2t.output1(net)');
    assert_net(aNet, 'net', 'switch_1p2t.output1(net)');
    this.attr.output1 = aNet;
    return this;
};

Switch1P2T.prototype.output2 = function (aNet) {
    // Set output2 net name
    assert_arguments_length(arguments, 1, 1, 'switch_1p2t.output1(net)');
    assert_net(aNet, 'net', 'switch_1p2t.output2(net)');
    this.attr.output2 = aNet;
    return this;
};

Switch1P2T.prototype.state = function (aState) {
    // Set switch state (1=input connected to output1, 2=input connected to output2)
    assert_arguments_length(arguments, 1, 1, 'switch_1p2t.state(value)');
    if (aState !== 1 && aState !== 2) {
        throw new Exception('1P2T switch ' + this.attr.name + ' state can only be 1 or 2 but given was ' + aState + ' (' + typeof aState + ')');
    }
    this.attr.state = aState;
    this.attr.timeline = [[0, aState]];
    return this;
};

Switch1P2T.prototype.ron = function (aValue) {
    // Set ON resistance
    assert_arguments_length(arguments, 1, 1, 'switch_1p2t.ron(value)');
    this.attr.ron = eng(aValue, 'value', 'switch_1p2t.ron(value)');
    return this;
};

Switch1P2T.prototype.roff = function (aValue) {
    // Set OFF resistance
    assert_arguments_length(arguments, 1, 1, 'switch_1p2t.roff(value)');
    this.attr.roff = eng(aValue, 'value', 'switch_1p2t.roff(value)');
    return this;
};

Switch1P2T.prototype.timeline = function (aTimesAndStates) {
    // Set timeline as array of times and states, e.g. [[0, 1], [0.01, 2]]
    assert_arguments_length(arguments, 1, 1, 'switch_1p2t.timeline(times_and_states)');
    assert_array_of_complex(aTimesAndStates, 'times_and_states', 'switch_1p2t.timeline(times_and_states)', true);
    this.attr.timeline = aTimesAndStates;
    return this;
};

Switch1P2T.prototype.state_at = function (aState, aTime) {
    // Add one state and one time to timeline
    if (aTime === 0) {
        this.state(aState);
        return this;
    }
    assert_arguments_length(arguments, 2, 2, 'switch_1p2t.state_at(state,time)');
    assert_enum(aState, [1, 2], 'state', 'switch_1p2t.state_at(state,time)');
    this.attr.timeline.push([eng(aTime), aState]);
    return this;
};

Switch1P2T.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'switch_1p2t.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        input: {type: "net", required: true},
        output1: {type: "net", required: true},
        output2: {type: "net", required: true},
        state: {type: "number", allowed: [1, 2], required: true},
        ron: {type: "number", min: 0, max: 1e15, required: true, eng: true, equation: true},
        roff: {type: "number", min: 0, max: 1e15, required: true, eng: true, equation: true},
        timeline: {type: "array_of_complex", required: true}
    });
    device_attr_assign(this, this.attr);
    if (this.attr.timeline.length <= 0) {
        throw new Exception('switch_1p2t ' + this.attr.name + ' does not have timeline, you can use ' + this.attr.name + '.state(0).state_at(1, "5m").state_at(0, "10m")');
    }
};

Switch1P2T.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'switch_1p2t.get_nets()');
    return {
        input: this.attr.input,
        output1: this.attr.output1,
        output2: this.attr.output2
    };
};

Switch1P2T.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'switch_1p2t.get_value()');
    this.validate();
    return this.attr.state;
};

Switch1P2T.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'switch_1p2t.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Switch1P2T.prototype.render = function () {
    // Render spice netlist
    assert_arguments_length(arguments, 0, 0, 'switch_1p2t.render()');
    function pwl_constant_states(aPwl, aStateTranslation) {
        // Convert PWL to states that are constant until next point
        assert_array_of_complex(aPwl, 'pwl', 'pwl_constant_states(pwl)');
        var i, r = [], dur = 1e-3, last;
        for (i = 0; i < aPwl.length; i++) {
            if (i > 0) {
                r.push([aPwl[i][0], aStateTranslation[aPwl[i - 1][1]]]);
            }
            if (i < aPwl.length - 1) {
                dur = (aPwl[i + 1][0] - aPwl[i][0]) / 1000;
            }
            r.push([aPwl[i][0] + (i > 0 ? dur : 0), aStateTranslation[aPwl[i][1]]]);
        }
        // add extra point because of the bug in ngspice: https://sourceforge.net/p/ngspice/bugs/631/
        last = r[r.length - 1];
        r.push([last[0] + 1, last[1]]);
        return r;
    }
    var spice = [];
    spice.push("* " + device_summary(this));
    // sub
    spice.push(".subckt sub_switch_1p2t_" + this.attr.name + " in1 out1 out2");
    spice.push(" R1 in1 out1 R = pwl(time, " + pwl_constant_states(this.attr.timeline, {1: this.attr.ron, 2: this.attr.roff}).join(',') + ")");
    spice.push(" R2 in1 out2 R = pwl(time, " + pwl_constant_states(this.attr.timeline, {1: this.attr.roff, 2: this.attr.ron}).join(',') + ")");
    spice.push(".ends sub_switch_1p2t_" + this.attr.name);
    spice.push("x_" + this.attr.name + " " + this.attr.input + " " + this.attr.output1 + " " + this.attr.output2 + " sub_switch_1p2t_" + this.attr.name);
    return spice.join('\n');
};

globalThis.exports = {Switch1P2T, switch_1p2t};
Internal.Switch1P2T = Switch1P2T;
globalThis.switch_1p2t = switch_1p2t;
Internal.device_constructor.switch_1p2t = switch_1p2t;
