// AC analysis
// linter: ngspicejs-lint --internal
"use strict";

function Ac(aFstart, aFstop, aPoints, aVariation) {
    // Constructor
    assert_arguments_length(arguments, 0, 4, 'ac(fstart,fstop,points,variation)');
    if (Ac.ac.length > 10) {
        Ac.ac.length = 0;
    }
    Ac.ac.push(this);
    this.type = 'ac';
    this.modified = false;
    this.attr = {
        variation: 'dec',
        points: 40,
        fstart: 1,
        fstop: 20e3
    };
    // single attr value, e.g. ac({name: 'D1', ...});
    if (arguments.length === 1 && typeof aFstart === 'object') {
        this.attr = aFstart;
        this.validate();
        return;
    }
    // multiple arguments, e.g. ac('X1', 1, 0, 'ABC');
    if (aFstart !== undefined && typeof aFstart === 'number') {
        this.fstart(aFstart);
    }
    if (aFstop !== undefined) {
        this.fstop(aFstop);
    }
    if (aPoints !== undefined) {
        this.points(aPoints);
    }
    if (aVariation !== undefined) {
        this.variation(aVariation);
    }
}

Ac.ac = [];

function ac(aFstart, aFstop, aPoints, aVariation) {
    // AC analysis
    assert_arguments_length(arguments, 0, 4, 'ac(fstart,fstop,points,variation)');
    if (arguments.length === 1 && typeof aFstart === 'object') {
        return new Ac(aFstart);
    }
    return new Ac(aFstart, aFstop, aPoints, aVariation);
}

Ac.prototype.fstart = function (aFstart) {
    // Set starting frequency
    assert_arguments_length(arguments, 1, 1, 'ac.fstart(value)');
    this.attr.fstart = eng(aFstart, 1, 'ac.fstart(value)');
    this.modified = true;
    this.validate();
    return this;
};

Ac.prototype.fstop = function (aFstop) {
    // Set ending frequency
    assert_arguments_length(arguments, 1, 1, 'ac.fstop(value)');
    this.attr.fstop = eng(aFstop, 1, 'ac.fstop(value)');
    this.modified = true;
    this.validate();
    return this;
};

Ac.prototype.points = function (aPoints) {
    // Set number of points per "variation"
    assert_arguments_length(arguments, 1, 1, 'ac.points(value)');
    this.attr.points = eng(aPoints, 1, 'ac.points(value)');
    this.modified = true;
    this.validate();
    return this;
};

Ac.prototype.variation = function (aVariation) {
    // Set type of variation (dec, lin, oct)
    assert_arguments_length(arguments, 1, 1, 'ac.variation(value)');
    this.attr.variation = aVariation;
    this.modified = true;
    this.validate();
    return this;
};

Ac.prototype.validate = function () {
    // Validate attributes
    assert_arguments_length(arguments, 0, 0, 'ac.validate()');
    device_attr_check(this, this.attr, {
        fstart: {type: "number", min: 0, max: 1e9, eng: true, zero: false},
        fstop: {type: "number", min: 0, max: 1e9, eng: true, zero: false},
        points: {type: "number", min: 1, max: 10000, integer: true},
        variation: {type: "string", min: 3, max: 3, allowed: ['dec', 'lin', 'oct']}
    });
};

Ac.prototype.fixed_fstop = function (aFStart, aFStop, aPoints, aVariation) {
    // Increase actual fstop so that it ends in requested fstop, not approximate fstop
    // in ngspice when you use AC from f1 to f2 with DEC variation, it will
    // not end in f2 but ~30% lower, this returns f2 such that AC result includes
    // original f2, e.g. for (16, 20000, 5) this returns 25358
    assert_arguments_length(arguments, 4, 4, 'ac.fixed_stop(fstart,fstop,points,variation)');
    var f1 = aFStart;
    var f2 = aFStop;
    var i = f1;
    var j;
    var o = i;
    var z;
    var m;
    switch (aVariation) {
    case "lin": return aFStop;
    case "dec": m = 10; break;
    case "oct": m = 8; break;
    default:
        throw new Exception("AC fixed_fstop() called for wrong variation " + aVariation);
    }
    while (i < 2 * f2) {
        i *= m;
        z = o;
        for (j = 0; j < aPoints + 1; j++) {
            if (z >= aFStop) {
                return Math.ceil(z);
            }
            z *= Math.pow(10, 1 / aPoints);
        }
        o = i;
    }
    return aFStop;
};

Ac.prototype.run = function () {
    // Run AC analysis
    assert_arguments_length(arguments, 0, 0, 'ac.run()');
    this.ret = netlist_done();
    this.validate();
    if (this.attr.fstop < this.attr.fstart) {
        throw new Exception('AC attribute fstart (' + this.attr.fstart + ') cannot be larger than fstop (' + this.attr.fstop + ')');
    }
    assert_netlist_has_net_devices('ac.run()');
    Internal.netlist_snapshot_analysis = netlist_snapshot(netlist_devices);
    // fix fstop
    var real_fstop = this.attr.fstop;
    real_fstop = this.fixed_fstop(this.attr.fstart, this.attr.fstop, this.attr.points, this.attr.variation);
    // run
    ngspice_command(`destroy all`);
    temperature_apply();
    var cmd = `ac ${this.attr.variation} ${this.attr.points} ${this.attr.fstart} ${real_fstop}`;
    ngspice_command(cmd);
    ngspice_process_log(ngspice_log(), cmd);
    // process data
    var d = ngspice_data();
    assert_object_keys(d, ['ac1', 'const'], 'data', 'ac.run()');
    // complex frequency makes no sense (for now), so assume AC frequency is always real
    var i = 0;
    for (i = 0; i < d.ac1.frequency.length; i++) {
        if (d.ac1.frequency[i][1] !== 0) {
            throw new Exception('ac.run() returned data where imaginary part of frequency is non-zero, I have no idea what to do with it, please report this error!');
        }
    }
    d.ac1.frequency = array_real(d.ac1.frequency);
    // wrap named nets with V() but not frequency
    var n;
    for (const [key, val] of Object.entries(d.ac1)) {
        if (key !== 'frequency' && key.match(/^[a-z_]{1}[a-z0-9_]+$/)) {
            n = 'V(' + key + ')';
            if (Object.hasOwn(n)) {
                throw new Exception('AC resulted in duplicate net name ' + key + ', please report this issue');
            }
            d.ac1[n] = val;
            delete d.ac1[key]; //echo(key, val.length);
        }
    }
    this.data = d.ac1;
    // human vector names
    this.original_vectors = Object.keys(this.data).sort();
    human_vector_names(this.data);
    // devices may perform further data processing
    this.ret.netlist_devices.filter(a => a.process_data).forEach(a => a.process_data(this.data));
    this.modified = false;
    return this;
};

Ac.prototype.chart = function (aVector, oChartOptions) {
    // Render AC chart of given vector and optional chart options
    assert_arguments_length(arguments, 1, 2, 'ac.chart(vector,chart_options)');
    assert_not_modified(this, 'ac.chart(vector,chart_options)', 'ac.run()', 'Example: ac().run().fstop(22000).chart("V(1)") <-- here you have to call fstop() before run()');
    var vecs = Array.isArray(aVector) ? aVector : [aVector];
    var t = this;
    vecs.forEach(v => assert_data_key(t, v));
    assert_data_key(this, 'frequency');
    var o = oChartOptions || {};
    var fun = o.fun || array_modulus;
    o = JSON.parse(JSON.stringify(o));
    var s = o.show === false ? false : true;
    delete o.show;
    delete o.fun;
    var c = chart_xy(o);
    c.title(o.title || 'AC analysis');
    c.label_x(o.label_x || 'Frequency/Hz');
    if (vecs.length === 1) {
        c.label_y(o.label_y || vecs[0]);
    }
    vecs.forEach(v => c.add_series(t.data.frequency, fun(t.data[v]), v + (fun === array_db ? '/dB' : '')));
    if (!Object.hasOwn(o, 'min_y') && (fun !== array_db)) {
        c.min_y(0);
    }
    if (s) {
        c.show();
    }
    this.last_chart = c;
    return this;
};

Ac.prototype.chart_db = function (aVector, oChartOptions) {
    // Render ac chart of given vector and optional chart options, convert to decibels
    assert_arguments_length(arguments, 1, 2, 'ac.chart_db(vector,chart_options)');
    var o = oChartOptions || {};
    o = JSON.parse(JSON.stringify(o));
    o.fun = o.fun;
    o.fun = o.fun || array_db;
    o.label_y = o.label_y || ((aVector || this.last_vector) + '/dB');
    return this.chart(aVector, o);
};

Ac.prototype.csv = function () {
    // Convert AC data to csv table, you can use file_write_csv to save it to file
    assert_arguments_length(arguments, 0, 0, 'ac.csv()');
    assert_not_modified(this, 'ac.csv()', 'ac.run()', 'Example: ac().run().fstop(2000).csv() <-- here you have to call fstop() before run()');
    assert_data_key(this, 'frequency');
    // ensure header starts with frequency
    var keys = Object.keys(this.data).filter(a => a != 'frequency');
    keys.unshift('frequency');
    // csv array
    var i;
    var csv = [keys];
    // transpose data
    var frequency_column = keys.indexOf('frequency');
    for (i = 0; i < keys.length; i++) {
        if (i === frequency_column) {
            csv_insert(csv, i, 1, this.data[csv[0][i]]);
        } else {
            csv_insert(csv, i, 1, array_modulus(this.data[csv[0][i]]));
        }
    }
    return csv;
};

Ac.prototype.lerp = function (aDataKey) {
    // Construct a lerp from data
    assert_arguments_length(arguments, 1, 1, 'ac.lerp(data_key)');
    assert_not_modified(this, 'ac.lerp(data_key)', 'ac.run()', 'Example: ac().run().fstop(20000).lerp("V(1)") <-- here you have to call interval() before run()');
    assert_data_key(this, aDataKey);
    var x = this.data.frequency,
        y = array_modulus(this.data[aDataKey]),
        i,
        xy = [];
    for (i = 0; i < x.length; i++) {
        xy.push([x[i], y[i]]);
    }
    return lerp(xy);
};

Ac.prototype.value_at = function (aDataKey, aFrequency) {
    // Get value at specified frequency
    assert_not_modified(this, 'ac.value_at(data_key, freq)', 'ac.run()', 'Example: ac().run().fstop(20000).value_at("V(1)", 440) <-- here you have to call interval() before run()');
    assert_arguments_length(arguments, 2, 2, 'ac.value_at(data_key, freq)');
    assert_string(aDataKey, 'data_key', 'ac.value_at(data_key, freq)');
    assert_data_key(this, aDataKey);
    assert_data_key(this, 'frequency');
    return this.lerp(aDataKey).get(eng(aFrequency));
};

globalThis.exports = {Ac, ac};
globalThis.ac = ac;
Internal.Ac = Ac;
