// Linearize vector (times,values) at given sample rate, e.g. 44100
// linter: ngspicejs-lint --internal
"use strict";

function linearize(aTimes, aValues, aSampleRate, aCustomWarning) {
    // Linearize vector (times,values) at given sample rate, e.g. 44100
    assert_arguments_length(arguments, 3, 4, 'linearize(times,values,sample_rate,custom_warning)');
    assert_array(aTimes, 'times', 'linearize(times,values,sample_rate,custom_warning)');
    assert_array(aValues, 'values', 'linearize(times,values,sample_rate,custom_warning)');
    assert_number(aSampleRate, 'sample_rate', 'linearize(times,values,sample_rate,custom_warning)');
    var t1 = aTimes[0];
    var t2 = aTimes.at(-1);
    var dt = 1 / aSampleRate;
    var n = Math.ceil((t2 - t1) / dt) + 1;
    var ret = new Array(n);
    var i, t, i1 = 0, i2 = 1, c1 = aTimes[i1], c2 = aTimes[i2], v1 = aValues[i1], v2 = aValues[i2], v,
        dv = v2 - v1, dc = c2 - c1,
        low = 0;
    for (i = 0; i < n; i++) {
        t = t1 + i * dt;
        while (t > c2) {
            i1++;
            c1 = aTimes[i1];
            v1 = aValues[i1];
            i2++;
            c2 = aTimes[i2];
            v2 = aValues[i2];
            dc = c2 - c1;
            dv = v2 - v1;
            if (dc > dt + 0.000001) {
                low = Math.max(low, dc);
            }
            if (!c2) {
                c2 = c1;
                break;
                //hint('times=' + aTimes.length + ' values=' + aValues.length + ' sample_rate=' + aSampleRate);
                //hint('i1=' + i1 + ' i2=' + i2 + ' c1=' + c1 + ' c2=' + c2 + ' v1=' + v1 + ' v2=' + v2);
                //throw new Exception("linearize() failed");
            }
        }
        v = v1 + (t - c1) * dv / dc;
        ret[i] = v;
    }
    if (low) {
        warn('Sampling rate too low (max step ' + low.toEng() + 's, sample rate ' + aSampleRate + ' requires step ' + dt.toEng() + 's)' + (aCustomWarning ? ' ' + aCustomWarning : ''));
    }
    return ret;
}

globalThis.exports = {linearize};
globalThis.linearize = linearize;
