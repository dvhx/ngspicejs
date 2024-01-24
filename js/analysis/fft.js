// FFT analysis
// linter: ngspicejs-lint --internal
"use strict";

function Fft(aInterval, aStart, aFstop, aWindow) {
    // Constructor
    assert_arguments_length(arguments, 0, 4, 'fft(interval,start,stop,window)');
    Fft.fft.push(this);
    this.type = 'fft';
    this.attr = {
        interval: 0.1,
        start: 0,
        fstop: 20e3,
        window: 'hanning'
    };
    // fully chained?
    if (arguments.length === 0) {
        return;
    }
    // single object argument
    if (arguments.length === 1 && typeof aInterval === 'object') {
        this.attr = aInterval;
        this.validate();
        return;
    }
    // multiple arguments
    if (aInterval !== undefined) {
        aInterval = eng(aInterval, 2, 'fft(interval, start, fstop, window)');
        this.interval(aInterval);
    }
    if (aStart !== undefined) {
        aStart = eng(aStart, 1, 'fft(interval, start, fstop, window)');
        this.start(aStart);
    }
    if (aFstop !== undefined) {
        aFstop = eng(aFstop, 1, 'fft(interval, start, fstop, window)');
        this.fstop(aFstop);
    }
    if (aWindow !== undefined) {
        this.window(aWindow);
    }
}

Fft.counter = 0;
Fft.fft = [];

function fft(aInterval, aStart, aFstop, aWindow) {
    // Fast Fourier Transformation
    assert_arguments_length(arguments, 0, 4, 'fft(interval,start,stop,window)');
    if (arguments.length === 1 && typeof aInterval === 'object') {
        return new Fft(aInterval);
    }
    return new Fft(aInterval, aStart, aFstop, aWindow);
}

Fft.prototype.interval = function (aValue) {
    // Set interval
    assert_arguments_length(arguments, 1, 1, 'Fft.interval(value)');
    this.attr.interval = eng(aValue, 1, 'Fft.interval(value)');
    this.modified = true;
    this.validate();
    return this;
};

Fft.prototype.start = function (aValue) {
    // Set start time
    assert_arguments_length(arguments, 1, 1, 'Fft.start(value)');
    this.attr.start = eng(aValue, 1, 'Fft.start(value)');
    this.modified = true;
    this.validate();
    return this;
};

Fft.prototype.fstop = function (aValue) {
    // Set ending frequency
    assert_arguments_length(arguments, 1, 1, 'Fft.fstop(value)');
    this.attr.fstop = eng(aValue, 1, 'Fft.fstop(value)');
    this.modified = true;
    this.validate();
    return this;
};

Fft.prototype.window = function (aValue) {
    // Set window function
    assert_arguments_length(arguments, 1, 1, 'Fft.window(value)');
    this.attr.window = aValue;
    this.modified = true;
    this.validate();
    return this;
};

Fft.prototype.validate = function () {
    // Validate attributes
    assert_arguments_length(arguments, 0, 0, 'fft.validate()');
    device_attr_check(this, this.attr, {
        interval: {type: "number", min: 0, max: 1e9, eng: true},
        start: {type: "number", min: 0, max: 1e9, eng: true},
        fstop: {type: "number", min: 0, max: 1e9, eng: true, zero: false},
        window: {type: "string", min: 4, max: 11, allowed: ['none', 'rectangular', 'bartlet', 'blackman', 'hanning', 'hamming', 'gaussian', 'flattop']}
    });
};

Fft.prototype.run = function (aVector) {
    // Run FFT analysis
    assert_arguments_length(arguments, 1, 1, 'fft.run(vector)');
    assert_netlist_has_net_devices('fft.run(' + aVector + ')');
    assert_string(aVector, 'vector', 'fft.run(vector)', 'Argument of fft.run(vector) must be a vector not "' + aVector + '", available vectors are: ' + available_vectors());

    this.validate();
    if (this.attr.start > this.attr.interval) {
        throw new Exception("FFT .start(" + this.attr.start + ") must be lower than .interval(" + this.attr.interval + ")");
    }

    this.ret = netlist_done();
    this.last_vector = aVector;

    var step = (1 / this.attr.fstop) / 2, // shannon
        mode = '',
        voltmeter,
        m,
        something,
        ugly_name;

    // normal vector?
    m = aVector.toString().match(/^V\(([A-Z0-9_]+)\)$/);
    something = m && m[1];

    // voltmeter?
    voltmeter = Voltmeter.voltmeters.find((a) => a.attr.name === something);

    Internal.netlist_snapshot_analysis = netlist_snapshot(netlist_devices);

    // run spice
    ngspice_command('destroy all');
    temperature_apply();
    ngspice_command(`tran ${step} ${this.attr.interval} ${this.attr.start}`);

    // handle voltmeters
    if (voltmeter) {
        // V(voltmeter_name)
        mode = 'voltmeter';
        if (voltmeter.attr.anode.toString() !== '0' && voltmeter.attr.cathode.toString() !== '0') {
            ugly_name = 'V(' + voltmeter.attr.anode + ') V(' + voltmeter.attr.cathode + ')';
        } else if (voltmeter.attr.anode.toString() !== '0') {
            ugly_name = 'V(' + voltmeter.attr.anode + ')';
        } else {
            ugly_name = 'V(' + voltmeter.attr.cathode + ')';
        }
    } else {
        // handle ugly names
        ugly_name = ugly_vector_name(aVector);
        if (ugly_name.match(/\$/)) {
            warn('Doing FFT of a vector that contains $ sign may not be supported in ngspice (vector ' + aVector + ' = ' + ugly_name + ', see https://sourceforge.net/p/ngspice/bugs/654/)');
        }
    }

    // actual fft
    ngspice_command(`linearize ${ugly_name}`);
    ngspice_command(`set specwindow=${this.attr.window}`);
    ngspice_command(`fft ${ugly_name}`);

    // process log
    ngspice_process_log(ngspice_log(), '??? fft');

    // get data
    var d = ngspice_data();
    assert_object_keys(d, ['tran1', 'tran2', 'sp2', 'const'], 'data', 'Fft.run');
    this.data = d.sp2;
    //echo('data keys', Object.keys(this.data));

    // handle voltmeters
    if (mode === 'voltmeter') {
        // convert v(anode)-v(cathode) to V(V1)
        if (voltmeter.attr.anode.toString() !== '0' && voltmeter.attr.cathode.toString() !== '0') {
            //echo('floating voltmeter', aVector);
            d.sp2[aVector] = array_sub(d.sp2['v(' + voltmeter.attr.anode + ')'], d.sp2['v(' + voltmeter.attr.cathode + ')']);
            delete d.sp2['v(' + voltmeter.attr.anode + ')'];
            delete d.sp2['v(' + voltmeter.attr.cathode + ')'];
        } else {
            //echo('grounded voltmeter', aVector);
            if (voltmeter.attr.anode.toString() !== '0') {
                d.sp2[aVector] = d.sp2['v(' + voltmeter.attr.anode + ')'];
                delete d.sp2['v(' + voltmeter.attr.anode + ')'];
            } else {
                d.sp2[aVector] = d.sp2['v(' + voltmeter.attr.cathode + ')'];
                delete d.sp2['v(' + voltmeter.attr.cathode + ')'];
            }
        }
    } else {
        // handle ugly vector names
        human_vector_names(this.data);
    }

    // devices may perform further data processing
    this.ret.netlist_devices.filter((a) => a.process_data && a.type !== 'voltmeter').forEach((a) => a.process_data(this.data));

    // check vector name
    if (!this.data[aVector]) {
        hint('Available vectors are: ' + Object.keys(this.data).sort().join(' '));
        throw new Exception('fft could not find vector ' + aVector + ' (' + ugly_name + ')');
    }

    // interpolate last value so that frequency and data ends exactly at the fstop
    var fs = this.attr.fstop;
    var f1 = this.data.frequency.at(-2);
    var f2 = this.data.frequency.at(-1);
    var q = (fs - f1) / (f2 - f1);
    var v1 = this.data[aVector].at(-2);
    var v2 = this.data[aVector].at(-1);
    var vs = [
        v1[0] + q * (v2[0] - v1[0]),
        v1[1] + q * (v2[1] - v1[1])
    ];
    this.data.frequency[this.data.frequency.length - 1] = fs;
    v2[0] = vs[0];
    v2[1] = vs[1];
    this.modified = false;
    return this;
};

Fft.prototype.main_vector_name = function () {
    // FFT data contains frequency and a complex voltage, return the name of the complex voltage vector
    assert_arguments_length(arguments, 0, 0, 'fft.main_vector_name()');
    return Object.keys(this.data).filter((a) => a !== 'frequency')[0];
};

Fft.prototype.extrema = function () {
    // Find all extrema (even miniscule jitter), both min and max
    assert_arguments_length(arguments, 0, 0, 'fft.extrema()');
    assert_not_modified(this, 'fft.extrema()', 'fft.run(vector)', 'Example: fft().run("V(1)").fstop(2000).extrema() <-- here you have to call fstop() before run()');
    assert_data_key(this, 'frequency');
    if ((Object.keys(this.data).length !== 2) || !Array.isArray(this.data.frequency)) {
        throw new Exception('fft.peaks() expects fft.data to have 2 fields (frequency, complex voltage)');
    }
    var key = this.main_vector_name(),
        v = array_modulus(this.data[key]),
        e = array_extrema(v);
    // put frequency in the result, for convenience
    for (var i = 0; i < e.length; i++) {
        e[i].frequency = this.data.frequency[e[i].index];
    }
    return e;
};

Fft.prototype.peaks = function (aPercentile) {
    // Find all max peaks taller than 1% of highest peak (use aPercentile=0.01 for 1%)
    assert_arguments_length(arguments, 0, 1, 'fft.peaks(percentile)');
    assert_not_modified(this, 'fft.peaks(percentile)', 'fft.run(vector)', 'Example: fft().run("V(1)").fstop(2000).peaks(0.01) <-- here you have to call fstop() before run()');
    assert_data_key(this, 'frequency');
    aPercentile = aPercentile || 0.01;
    var p = this.extrema();
    // find tallest peak
    var m = 0;
    p.forEach(a => m = Math.max(a.value, m));
    // Keep max peaks that are at least 1% of maximum
    p = p.filter(a => (a.max && a.value > aPercentile * m));
    // mark fundamental frequency
    for (var i = 0; i < p.length; i++) {
        p[i].fundamental = p[i].value === m;
    }
    return p;
};

Fft.prototype.f0 = function () {
    // Find fundamental frequency in data (entire component, not just frequency)
    assert_arguments_length(arguments, 0, 0, 'fft.f0()');
    assert_not_modified(this, 'fft.f0()', 'fft.run(vector)', 'Example: fft().run("V(1)").fstop(2000).f0() <-- here you have to call fstop() before run()');
    assert_data_key(this, 'frequency');
    return this.peaks().filter(a => a.fundamental)[0];
};

Fft.prototype.lerp = function () {
    // Convert data to lerp
    assert_arguments_length(arguments, 0, 0, 'fft.lerp()');
    var i, xy = [], key = this.main_vector_name();
    for (i = 0; i < this.data.frequency.length; i++) {
        xy.push([this.data.frequency[i], complex(this.data[key][i][0], this.data[key][i][1]).modulus()]);
    }
    return lerp(xy);
};

Fft.prototype.value_at = function (aFreq) {
    // Return main vector modulus at given frequency
    assert_arguments_length(arguments, 1, 1, 'fft.value_at(frequency)');
    var i, f, f1, f2, v1, v2, d1, d2, key = this.main_vector_name();
    for (i = 0; i < this.data.frequency.length; i++) {
        f = this.data.frequency[i];
        if (f >= aFreq) {
            f1 = this.data.frequency[i - 1];
            f2 = this.data.frequency[i];
            d1 = complex(this.data[key][i - 1][0], this.data[key][i - 1][1]);
            d2 = complex(this.data[key][i][0], this.data[key][i][1]);
            v1 = d1.modulus();
            v2 = d2.modulus();
            break;
        }
    }
    //echo('f1', f1, 'f2', f2, 'd1', d1, 'd2', d2, 'v1', v1, 'v2', v2);
    return lerp([[f1, v1], [f2, v2]]).get(aFreq);
};

Fft.prototype.max_value_between = function (aFreq1, aFreq2) {
    // Return maximal main vector value between 2 frequencies
    assert_arguments_length(arguments, 2, 2, 'fft.max_value_between(f1,f2)');
    assert_number(aFreq1, 'f1', 'fft.max_value_between(f1,f2)');
    assert_number(aFreq2, 'f1', 'fft.max_value_between(f1,f2)');
    var i, f, i1, i2, key = this.main_vector_name();
    for (i = 0; i < this.data.frequency.length; i++) {
        f = this.data.frequency[i];
        if (f >= aFreq1) {
            if (!i1) {
                i1 = i;
            }
            if (f >= aFreq2) {
                i2 = i;
                break;
            }
        }
    }
    if (i1 === i2) {
        return array_max(array_modulus([this.data[key][i1]]));
    }
    return array_max(array_modulus(this.data[key].slice(i1, i2)));
};

Fft.prototype.thd = function (aF0, aNumberOfHarmonics) {
    // Calculate THD from data, only first N peaks
    assert_arguments_length(arguments, 1, 2, 'fft.thd(f0,number_of_harmonics)');
    assert_not_modified(this, 'fft.thd(f0,number_of_peaks)', 'fft.run(vector)', 'Example: fft().run("V(1)").fstop(2000).thd(440,5) <-- here you have to call fstop() before run()');
    assert_data_key(this, 'frequency');
    if (aF0 * aNumberOfHarmonics > array_max(this.data.frequency)) {
        hint('You need to choose fundamental frequency and number of peaks such that the available data contains all peaks, use fft.fstop(' + round_up(aF0 * aNumberOfHarmonics, 0) + ')');
        example('If your fundamental frequency is 1kHz and you want 10 peaks, your FFT data must go up to 11kHz at least!');
        throw new Exception("fft.thd(f0,n) - last peak " + aF0 * aNumberOfHarmonics + ' is larger than max available frequency ' + array_max(this.data.frequency));
    }
    if (aF0 <= 1) {
        warn('fft.thd(f0,number_of_peaks) called with unusually low f0=' + aF0);
    }
    aNumberOfHarmonics = aNumberOfHarmonics || 10;
    var l = this.lerp(), i, f, v, all = 0, higher = 0, fund, a = 0;
    for (i = 0; i < aNumberOfHarmonics; i++) {
        f = aF0 + i * aF0;
        v = l.get(f);
        all += v;
        if (i === 0) {
            fund = v;
        }
        if (i > 0) {
            a += v * v;
            higher += v;
        }
    }
    return Math.sqrt(a) / fund;
};

Fft.prototype.chart = function (aVector, oChartOptions) {
    // Render chart of given vector with optional chart options
    assert_arguments_length(arguments, 0, 2, 'fft.chart(vector,chart_options)');
    // If vector is not specified, use the same vector used in fft.run(vector)
    if (typeof aVector === 'object' && oChartOptions === undefined) {
        oChartOptions = aVector;
        aVector = this.last_vector;
    }
    aVector = aVector || this.last_vector;
    assert_not_modified(this, 'fft.chart(vector,options)', 'fft.run(vector)', 'Example: fft().run("V(1)").fstop(2000).chart("V(1)") <-- here you have to call fstop() before run()');
    assert_data_key(this, aVector);
    assert_data_key(this, 'frequency');
    var o = oChartOptions || {};
    var fun = o.fun || array_modulus;
    o = JSON.parse(JSON.stringify(o));
    var s = o.show === false ? false : true;
    delete o.show;
    delete o.fun;
    var dat = fun(this.data[aVector]);
    var c = chart_xy(o);
    c.title(o.title || 'FFT analysis');
    c.label_x(o.label_x || 'f/Hz');
    c.label_y(o.label_y || aVector);
    c.add_series(this.data.frequency, dat, aVector + (fun === array_db ? '/dB' : ''));
    if (!Object.hasOwn(o, 'min_y') && !fun) {
        c.min_y(0);
    }
    if (s) {
        c.show();
    }
    this.last_chart = c;
    return this;
};

Fft.prototype.chart_db = function (aVector, oChartOptions) {
    // Render ac chart of given vector and optional chart options
    assert_arguments_length(arguments, 0, 2, 'fft.chart_db(vector,chart_options)');
    var o = oChartOptions || {};
    var fun = o.fun || array_db;
    o = JSON.parse(JSON.stringify(o));
    o.fun = fun;
    o.label_y = o.label_y || ((aVector || this.last_vector) + '/dB');
    return this.chart(aVector, o);
};

Fft.prototype.csv = function () {
    // Convert FFT data to csv table
    assert_arguments_length(arguments, 1, 2, 'fft.csv()');
    assert_not_modified(this, 'fft.csv()', 'fft.run(vector)', 'Example: fft().run("V(1)").fstop(2000).csv() <-- here you have to call fstop() before run()');
    assert_data_key(this, 'frequency');
    // ensure header starts with frequency
    var keys = Object.keys(this.data).filter(a => a != 'frequency');
    keys.unshift('frequency');
    // csv array
    var i;
    var csv = [keys];
    // transpose data
    var frequency_column = csv[0].indexOf('frequency');
    for (i = 0; i < csv[0].length; i++) {
        if (i === frequency_column) {
            csv_insert(csv, i, 1, this.data[csv[0][i]]);
        } else {
            csv_insert(csv, i, 1, array_modulus(this.data[csv[0][i]]));
        }
    }
    return csv;
};

Fft.prototype.harmonic_ratio = function (aF0, aNumberOfHarmonics, aModulo, aModuloMatch, oPeakWidth) {
    // Calculate ratio of various harmonics, e.g. (196, 10, 2, 0) for even harmonics, (196, 10, 2, 1) for odd harmonics
    oPeakWidth = oPeakWidth || 0;
    assert_arguments_length(arguments, 4, 5, 'fft.harmonic_ratio(f0,number_of_harmonics,modulo,modulo_match,peak_width)');
    assert_not_modified(this, 'fft.harmonic_ratio(f0,number_of_harmonics,modulo,modulo_match)', 'fft.run(vector)', 'Example: fft().run("V(1)").fstop(2000).harmonic_ratio(200,10,2,0) <-- here you have to call fstop() before run()');
    assert_data_key(this, 'frequency');
    if (aF0 * aNumberOfHarmonics > array_max(this.data.frequency)) {
        hint('You need to choose fundamental frequency and number of peaks such that the available data contains all peaks, use fft.fstop(' + round_up(aF0 * aNumberOfHarmonics, 0) + ')');
        example('If your fundamental frequency is 1kHz and you want 10 peaks, your FFT data must go up to 11kHz at least!');
        throw new Exception("fft.harmonic_ratio(f0,n,modulo,modulo_match) - last peak " + aF0 * aNumberOfHarmonics + ' is larger than max available frequency ' + array_max(this.data.frequency));
    }
    if (aF0 <= 1) {
        warn('fft.thd(f0,number_of_peaks) called with unusually low f0=' + aF0);
    }
    aNumberOfHarmonics = aNumberOfHarmonics || 10;
    var l = this.lerp(), i, f, v, all = 0, higher = 0, fund, a = 0;
    for (i = 0; i < aNumberOfHarmonics; i++) {
        f = aF0 + i * aF0;
        v = l.get(f);
        if (oPeakWidth > 0) {
            var v2 = this.max_value_between(f - oPeakWidth, f + oPeakWidth);
            v = v2;
        }
        if (i > 0) {
            all += v;
        }
        if (i === 0) {
            fund = v;
        }
        if ((i > 0) && (i % aModulo === aModuloMatch)) {
            a += v;
            higher += v;
        }
    }
    a = a / all;
    if (a < 0 || a > 1) {
        throw new Exception('fft.harmonic_ratio should be between 0 and 1 but it was ' + a);
    }
    return a;
};

Fft.prototype.even = function (aF0, aNumberOfHarmonics) {
    // Calculate ratio of even harmonics
    assert_arguments_length(arguments, 2, 2, 'fft.even(f0,number_of_harmonics)');
    assert_not_modified(this, 'fft.even(f0,number_of_harmonics)', 'fft.run(vector)', 'Example: fft().run("V(1)").fstop(2000).even(200,10) <-- here you have to call fstop() before run()');
    assert_data_key(this, 'frequency');
    return this.harmonic_ratio(aF0, aNumberOfHarmonics, 2, 1, 3); // 1 because of fundamental is "first"
};

Fft.prototype.odd = function (aF0, aNumberOfHarmonics) {
    // Calculate ratio of odd harmonics
    assert_arguments_length(arguments, 2, 3, 'fft.odd(f0,number_of_harmonics)');
    assert_not_modified(this, 'fft.odd(f0,number_of_harmonics)', 'fft.run(vector)', 'Example: fft().run("V(1)").fstop(2000).odd(200,10) <-- here you have to call fstop() before run()');
    assert_data_key(this, 'frequency');
    return this.harmonic_ratio(aF0, aNumberOfHarmonics, 2, 0, 3);
};

globalThis.exports = {Fft, fft};
globalThis.fft = fft;
Internal.fft = fft;
Internal.Fft = Fft;
