// BatterySensitivity analysis
// linter: ngspicejs-lint --internal
"use strict";

function BatterySensitivity(aBatteryName, aInput, aOutput, aVMin, aVMax) {
    // Constructor
    assert_arguments_length(arguments, 0, 5, 'battery_sensitivity(battery_name, input, output, vmin, vmax)');
    this.type = 'battery_sensitivity';
    this.attr = {};
    if (BatterySensitivity.battery_sensitivity.length > 10) {
        BatterySensitivity.battery_sensitivity.length = 0;
    }
    BatterySensitivity.battery_sensitivity.push(this);
    // all attr as object in first argument
    if (arguments.length === 1 && typeof aBatteryName === 'object') {
        this.attr = aBatteryName;
        this.validate();
        return;
    }
    // individual arguments
    if (aBatteryName !== undefined) {
        this.battery_name(aBatteryName);
    }
    if (aInput !== undefined) {
        this.input(aInput);
    }
    if (aOutput !== undefined) {
        this.output(aOutput);
    }
    if (aVMin !== undefined) {
        this.vmin(aVMin);
    }
    if (aVMax !== undefined) {
        this.vmax(aVMax);
    }
}

function battery_sensitivity(aBatteryName, aInput, aOutput, aVMin, aVMax) {
    // Battery sensitivity analysis (gain as a function of supply voltage)
    assert_arguments_length(arguments, 0, 5, 'battery_sensitivity(battery_name, input, output, vmin, vmax)');
    if (arguments.length === 1 && typeof aBatteryName === 'object') {
        return new BatterySensitivity(aBatteryName);
    }
    return new BatterySensitivity(aBatteryName, aInput, aOutput, aVMin, aVMax);
}

BatterySensitivity.prototype.battery_name = function (aBatteryName) {
    // Set battery name
    assert_arguments_length(arguments, 1, 1, 'battery_sensitivity.battery_name(string)');
    assert_name(aBatteryName, 'battery_sensitivity');
    this.attr.battery_name = aBatteryName;
    this.modified = true;
    return this;
};

BatterySensitivity.prototype.input = function (aNet) {
    // Set input net name
    assert_arguments_length(arguments, 1, 1, 'battery_sensitivity.input(net)');
    assert_net(aNet, 'net', 'battery_sensitivity.input(net)');
    assert_net_case(aNet, 'net', 'battery_sensitivity.input(net)');
    this.attr.input = aNet;
    this.modified = true;
    return this;
};

BatterySensitivity.prototype.output = function (aNet) {
    // Set output net name
    assert_arguments_length(arguments, 1, 1, 'battery_sensitivity.output(net)');
    assert_net(aNet, 'net', 'battery_sensitivity.output(net)');
    assert_net_case(aNet, 'net', 'battery_sensitivity.output(net)');
    this.attr.output = aNet;
    this.modified = true;
    return this;
};

BatterySensitivity.prototype.vmin = function (aVoltage) {
    // Set minimal battery voltage
    assert_arguments_length(arguments, 1, 1, 'battery_sensitivity.vmin(voltage)');
    this.attr.vmin = eng(aVoltage);
    this.modified = true;
    return this;
};

BatterySensitivity.prototype.vmax = function (aVoltage) {
    // Set maximal battery voltage
    assert_arguments_length(arguments, 1, 1, 'battery_sensitivity.vmax(voltage)');
    this.attr.vmax = eng(aVoltage);
    this.modified = true;
    return this;
};

BatterySensitivity.prototype.validate = function () {
    // Validate parameters
    assert_arguments_length(arguments, 0, 0, 'battery_sensitivity.validate()');
    device_attr_check(this, this.attr, {
        battery_name: {type: "string", min: 0, max: 100, alphanumeric: true, startalpha: false, required: true},
        input: {type: "net", required: true},
        output: {type: "net", required: true},
        vmin: {type: "number", min: -1e12, max: 1e12, required: true},
        vmax: {type: "number", min: -1e12, max: 1e12, required: true}
    });
    device_attr_assign(this, this.attr);
    if (this.attr.vmax < this.attr.vmin) {
        throw new Exception('Battery sensitivity attribute vmin (' + this.attr.vmin + ') cannot be larger than vmax (' + this.attr.vmax + ')');
    }
};

BatterySensitivity.prototype.run = function () {
    // Run analysis
    assert_arguments_length(arguments, 0, 0, 'battery_sensitivity.run()');
    this.validate();
    var v, g, x = [], y = [], b = netlist_devices.filter((a) => a.attr.name === this.attr.battery_name)[0];
    if (!b) {
        throw new Exception('BatterySensitivity cannot find battery ' + this.attr.battery_name);
    }
    var step = (this.attr.vmax - this.attr.vmin) / 30;
    var v0 = b.attr.v;
    for (v = this.attr.vmin; v <= this.attr.vmax; v += step) {
        // change U1 voltage
        b.v(v);
        // measure gain
        g = tran().run().gain(this.attr.input, this.attr.output);
        if (g === Infinity) {
            throw new Exception("Gain was infinity while doing battery sensitivity, this usually means that input (" + this.attr.input + ") has zero amplitude");
        }
        // add it to table
        x.push(v);
        y.push(g);
    }
    this.data = {x: x, y: y};
    // restore original voltage
    b.v(v0);
    Internal.netlist_snapshot_analysis = netlist_snapshot(netlist_devices);
    this.modified = false;
    return this;
};

BatterySensitivity.battery_sensitivity = [];

BatterySensitivity.prototype.chart = function (oChartOptions) {
    // Show chart
    assert_arguments_length(arguments, 0, 1, 'battery_sensitivity.chart(chart_options)');
    assert_data_key(this, 'x');
    assert_data_key(this, 'y');
    this.last_chart = chart_xy(oChartOptions)
        .title('Battery sensitivity')
        .label_x(this.attr.battery_name + '/V')
        .label_y('Gain')
        .add_series(this.data.x, this.data.y, 'Gain')
        .show();
    return this;
};

BatterySensitivity.prototype.csv = function () {
    // Convert data to csv table
    assert_arguments_length(arguments, 0, 0, 'battery_sensitivity.csv()');
    assert_not_modified(this, 'battery_sensitivity.csv()', 'battery_sensitivity.run()', 'Example: battery_sensitivity().run().vmin(4.5).csv() <-- here you have to call vmin(4.5) before run()');
    assert_data_key(this, 'x');
    assert_data_key(this, 'y');
    var csv = [[this.attr.battery_name, 'gain']];
    csv_insert(csv, 0, 1, this.data.x);
    csv_insert(csv, 1, 1, this.data.y);
    return csv;
};

BatterySensitivity.prototype.lerp = function () {
    // Construct a lerp from data
    assert_arguments_length(arguments, 0, 0, 'battery_sensitivity.csv()');
    assert_not_modified(this, 'battery_sensitivity.csv()', 'battery_sensitivity.run()', 'Example: battery_sensitivity().run().vmin(4.5).csv() <-- here you have to call vmin(4.5) before run()');
    assert_data_key(this, 'x');
    assert_data_key(this, 'y');
    return lerp(this.data.x, this.data.y);
};

BatterySensitivity.prototype.value_at = function (aVoltage) {
    // Get value at specified voltage
    assert_arguments_length(arguments, 1, 1, 'battery_sensitivity.value_at(voltage)');
    assert_not_modified(this, 'battery_sensitivity.csv()', 'battery_sensitivity.run()', 'Example: battery_sensitivity().run().vmin(4.5).csv() <-- here you have to call vmin(4.5) before run()');
    assert_data_key(this, 'x');
    assert_data_key(this, 'y');
    return this.lerp().get(eng(aVoltage));
};

globalThis.exports = {battery_sensitivity, BatterySensitivity};
globalThis.battery_sensitivity = battery_sensitivity;
Internal.BatterySensitivity = BatterySensitivity;
