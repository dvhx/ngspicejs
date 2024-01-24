// Transient analysis device
// linter: ngspicejs-lint --internal
"use strict";

function Tran(aStep, aInterval, aStart) {
    // Constructor
    assert_arguments_length(arguments, 0, 3, 'tran(step,interval,start)');
    Tran.tran.push(this);
    this.type = 'tran';
    this.modified = false;
    this.attr = {
        step: 100e-6,
        interval: 0.02,
        start: 0
    };
    if (arguments.length === 0) {
        return;
    }
    // single attr value, e.g. tran({start: 0, ...});
    if (arguments.length === 1 && typeof aStart === 'object') {
        this.attr = aStart;
        this.validate();
        return;
    }
    // multiple arguments, e.g. tran(0, 0.1, 0.001);
    if (aStep !== undefined && typeof aStep === 'number') {
        aStep = eng(aStep, 3, 'tran(start, interval, step)');
        this.step(aStep);
    }
    if (aInterval !== undefined) {
        aInterval = eng(aInterval, 2, 'tran(start, interval, step)');
        this.interval(aInterval);
    }
    if (aStart !== undefined) {
        aStart = eng(aStart, 1, 'tran(start, interval, step)');
        this.start(aStart);
    }
    this.validate();
}

Tran.tran = [];

function tran(aStep, aInterval, aStart) {
    // Transient analysis
    assert_arguments_length(arguments, 0, 3, 'tran(step,interval,start)');
    if (arguments.length === 1 && typeof aStart === 'object') {
        return new Tran(aStart);
    }
    return new Tran(aStep, aInterval, aStart);
}

Tran.prototype.step = function (aStep) {
    // Set step attribute
    assert_arguments_length(arguments, 1, 1, 'tran.step(seconds)');
    this.attr.step = eng(aStep, 1, 'Tran.step(value)');
    this.modified = true;
    this.validate();
    return this;
};

Tran.prototype.interval = function (aInterval) {
    // Set interval attribute
    assert_arguments_length(arguments, 1, 1, 'tran.interval(seconds)');
    this.attr.interval = eng(aInterval, 1, 'Tran.interval(value)');
    this.modified = true;
    this.validate();
    return this;
};

Tran.prototype.start = function (aStart) {
    // Set start attribute
    assert_arguments_length(arguments, 1, 1, 'tran.start(seconds)');
    this.attr.start = eng(aStart, 1, 'Tran.start(value)');
    this.modified = true;
    this.validate();
    return this;
};

Tran.prototype.validate = function () {
    // Validate attributes
    assert_arguments_length(arguments, 0, 0, 'tran.validate()');
    device_attr_check(this, this.attr, {
        step: {type: "number", min: 0, max: 1e8, eng: true},
        interval: {type: "number", min: 0, max: 1e9, eng: true},
        start: {type: "number", min: 0, max: 1e9, eng: true}
    });
    //device_attr_assign(this, this.attr);
};

Tran.prototype.run = function () {
    // Run transient analysis
    assert_arguments_length(arguments, 0, 0, 'tran.run()');

    this.validate();
    if (this.attr.start > this.attr.interval) {
        throw new Exception("Tran .start(" + this.attr.start + ") must be lower than .interval(" + this.attr.interval + ")");
    }

    this.ret = netlist_done();
    assert_netlist_has_net_devices('tran.run()');

    // if audio source is used, tran cannot be longer than audio source duration
    var s = this.attr.interval;
    netlist_devices.filter((d) => d.type === 'audio').forEach((d) => {
        var dur = d.get_duration();
        if (s > dur) {
            throw new Exception("Tran interval " + s + " cannot be longer than audio source " + d.attr.name + " duration " + dur);
        }
    });

    ngspice_command(`destroy all`);
    temperature_apply();
    ngspice_command(`unset ngbehavior`);
    Internal.netlist_snapshot_analysis = netlist_snapshot(netlist_devices);

    //var z = ngspice_command(`options savecurrents`);
    //var z = ngspice_command('save @D1[i]');
    //echo('z=', z);
    var t1 = Date.now();
    ngspice_command(`tran ${this.attr.step} ${this.attr.interval} ${this.attr.start}`);
    var t2 = Date.now();
    this.perf = t2 - t1;

    // process log
    ngspice_process_log(ngspice_log(), this.ret.netlist);

    // get data
    t2 = Date.now();
    var d = ngspice_data();
    var t3 = Date.now();
    this.perf_data = t3 - t2;
    assert_object_keys(d, ['tran1', 'const'], 'data', 'Tran.run');
    // wrap named nets with V() but not time
    var n;
    for (const [key, val] of Object.entries(d.tran1)) {
        if (key !== 'time' && key.match(/^[a-z_]{1}[a-z0-9_]+$/)) {
            n = 'V(' + key + ')';
            if (Object.hasOwn(n)) {
                throw new Exception('tran() has problem with key "' + key + '" because ' + n + ' already exists, please report this error');
            }
            d.tran1[n] = val;
            delete d.tran1[key]; //echo(key, val.length);
        }
    }
    this.data = d.tran1;
    var t4 = Date.now();
    this.perf_data2 = t4 - t3;

    // human vector names
    this.original_vectors = Object.keys(this.data).sort();
    human_vector_names(this.data);

    // devices may perform further data processing
    this.ret.netlist_devices.filter(a => a.process_data).forEach(a => a.process_data(this.data));
    this.modified = false;

    return this;
};

Tran.prototype.gain = function (aInputVector, aOutputVector) {
    // Calculate gain by comparing peak to peak voltage of 2 nets
    assert_arguments_length(arguments, 2, 2, 'tran.gain(input_vector,output_vector)');
    //assert_not_modified(this, 'tran.gain(input_vector,output_vector)', 'tran.run()', 'Example: tran().gain(2,3).run()) <-- here you have to call gaininterval() before run()');
    var a = is_net(aInputVector) ? 'V(' + aInputVector + ')' : aInputVector;
    var b = is_net(aOutputVector) ? 'V(' + aOutputVector + ')' : aOutputVector;
    assert_data_key(this, a);
    assert_data_key(this, b);
    // skip first 5 percent of data for transients
    var skip = Math.round(0.05 * this.data[b].length);
    return array_range(this.data[b].slice(skip)) / array_range(this.data[a].slice(skip));
};

Tran.prototype.gain_ideal = function (aInputVoltageAmplitude, aOutputVector) {
    // Calculate gain by comparing some ideal input amplitude voltage vs output amplitude
    assert_arguments_length(arguments, 2, 2, 'tran.gain_ideal(input_voltage_amplitude, output_vector)');
    if (typeof aInputVoltageAmplitude === 'string') {
        aInputVoltageAmplitude = aInputVoltageAmplitude.fromEng();
    }
    var b = is_net(aOutputVector) ? 'V(' + aOutputVector + ')' : aOutputVector;
    assert_data_key(this, b);
    // skip first 5 percent for transients
    var skip = Math.round(0.05 * this.data[b].length);
    return array_range(this.data[b].slice(skip)) / aInputVoltageAmplitude / 2;
};

Tran.prototype.lerp = function (aDataKey) {
    // Construct a lerp from data
    assert_arguments_length(arguments, 1, 1, 'tran.lerp(vector)');
    assert_not_modified(this, 'tran.lerp(data_key)', 'tran.run()', 'Example: tran().run().interval(0.02).lerp("V(1)") <-- here you have to call interval() before run()');
    assert_data_key(this, aDataKey);
    var x = this.data.time,
        y = this.data[aDataKey],
        i,
        xy = [];
    for (i = 0; i < x.length; i++) {
        xy.push([x[i], y[i]]);
    }
    return lerp(xy);
};

Tran.prototype.value_at = function (aDataKey, aTime) {
    // Get value at specified time
    assert_arguments_length(arguments, 2, 2, 'tran.value_at(data_key, time)');
    assert_not_modified(this, 'tran.value_at(data_key, time)', 'tran.run()', 'Example: tran().run().interval(0.02).value_at("V(1)", 0.01) <-- here you have to call interval() before run()');
    assert_string(aDataKey, 'data_key', 'tran.value_at(data_key, time)');
    assert_data_key(this, aDataKey);
    assert_data_key(this, 'time');
    return this.lerp(aDataKey).get(eng(aTime));
};

Tran.prototype.avg = function (aDataKey) {
    // Get average value of vector
    assert_arguments_length(arguments, 1, 1, 'tran.avg(data_key)');
    assert_data_key(this, aDataKey);
    assert_data_key(this, 'time');
    assert_string(aDataKey, 'data_key', 'tran.avg(data_key)');
    assert_not_modified(this, 'tran.avg(data_key)', 'tran.run()', 'Example: tran().run().interval(0.02).avg("V(1)") <-- here you have to call interval() before run()');
    return array_avg(this.data[aDataKey]);
};

Tran.prototype.rms = function (aDataKey) {
    // Get rms value of vector
    assert_arguments_length(arguments, 1, 1, 'tran.rms(data_key)');
    assert_data_key(this, aDataKey);
    assert_data_key(this, 'time');
    assert_string(aDataKey, 'data_key', 'tran.rms(data_key)');
    assert_not_modified(this, 'tran.rms(data_key)', 'tran.run()', 'Example: tran().run().interval(0.02).rms("V(1)") <-- here you have to call interval() before run()');
    return array_rms(this.data[aDataKey]);
};

Tran.prototype.chart = function (aVector, oChartOptions) {
    // Render tran chart of given vector and optional chart options
    assert_arguments_length(arguments, 1, 2, 'tran.chart(vector,chart_options)');
    assert_not_modified(this, 'tran.chart(vector,chart_options)', 'tran.run()', 'Example: tran().run().interval(0.02).chart("V(1)") <-- here you have to call interval() before run()');
    var vecs = Array.isArray(aVector) ? aVector : [aVector];
    var t = this;
    vecs.forEach(v => assert_data_key(t, v));
    assert_data_key(this, 'time');
    var o = oChartOptions || {};
    o = JSON.parse(JSON.stringify(o));
    var s = o.show === false ? false : true;
    delete o.show;
    var c = chart_xy(o);
    c.title(o.title || 'Transient analysis');
    c.label_x(o.label_x || 'Time/s');
    if (vecs.length === 1) {
        c.label_y(o.label_y || vecs[0]);
    }
    vecs.forEach(v => c.add_series(t.data.time, t.data[v], v));
    if (s) {
        c.show();
    }
    this.last_chart = c;
    return this;
};

Tran.prototype.csv = function () {
    // Convert transient data to csv table
    assert_arguments_length(arguments, 0, 0, 'tran.csv()');
    assert_not_modified(this, 'tran.csv()', 'tran.run()', 'Example: tran().run().interval(0.02).csv() <-- here you have to call interval() before run()');
    assert_data_key(this, 'time');
    // header is data keys but ensure time is always first column
    var keys = Object.keys(this.data).filter(a => a != 'time');
    keys.unshift('time');
    // csv array
    var i;
    var csv = [keys];
    // transpose data
    for (i = 0; i < keys.length; i++) {
        csv_insert(csv, i, 1, this.data[keys[i]]);
    }
    return csv;
};

Tran.prototype.f0 = function (aDataKey) {
    // Estimate fundamental frequency from transient analysis data
    assert_arguments_length(arguments, 1, 1, 'tran.f0(vector)');
    assert_not_modified(this, 'tran.f0()', 'tran.run()', 'Example: tran().f0("V(1)").run() <-- here you have to call run() before f0("V(1)")');
    assert_data_key(this, 'time');
    assert_data_key(this, aDataKey);
    var old = 0, sum = 0, n = 0;
    array_extrema(this.data[aDataKey]).filter((e) => e.max).map((e) => this.data.time[e.index]).forEach((t, index) => {
        if (index > 0) {
            sum += t - old;
            n++;
        }
        old = t;
    });
    return 1 / (sum / n);
};

globalThis.tran = tran;
Internal.Tran = Tran;
globalThis.exports = {Tran, tran};
