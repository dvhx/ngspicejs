// Find local extrema in array, return array of {index, value, min, max}
// linter: ngspicejs-lint --internal
"use strict";

function array_extrema(a) {
    // Find local extrema in array, return array of {index, value, min, max}
    assert_arguments_length(arguments, 1, 1, 'array_extrema()');
    assert_array(a, 'arr', 'array_extrema(arr)');
    if (Array.isArray(a[0]) && (a[0].length === 2)) {
        a = array_modulus(a);
    }
    var i, o = a[0], d, od, last_i, last_o, r = [];
    for (i = 0; i < a.length; i++) {
        d = a[i] - o;
        if (Math.sign(d) !== Math.sign(od) && i > 0) {
            if ((i === last_i + 1) && (o === last_o)) {
                //echo(i, o, 'peaked');
            } else {
                if (i > 1 && last_i) {
                    //echo_json({i, o, last_i, last_o});
                    r.push({index: i - 1, value: o, min: Math.sign(od) < 0, max: Math.sign(od) > 0});
                }
            }
            last_i = i;
            last_o = o;
        }
        o = a[i];
        od = d;
    }
    return r;
}

globalThis.exports = {array_extrema};
globalThis.array_extrema = array_extrema;
