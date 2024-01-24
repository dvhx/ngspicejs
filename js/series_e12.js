// Generate E-series of preferred numbers
// linter: ngspicejs-lint --internal
"use strict";

function series(aMin, aMax, aValues, oEng, oDigits) {
    // Return E12 series of preferred numbers from min to max value, e.g. from 10 to 10M
    assert_arguments_length(arguments, 3, 5, 'series(min,max,values,eng,digits)');
    oDigits = oDigits || 1;
    aMin = eng(aMin);
    aMax = eng(aMax);
    var k = Math.pow(10, Math.floor(Math.log10(aMin)));
    var n = 0;
    var i;
    var r = [];
    //echo('n', n, 'min', aMin, 'max', aMax);
    while (n <= aMax) {
        for (i = 0; i < aValues.length; i++) {
            n = k * aValues[i];
            //echo('k', k, 'n', n);
            if (k >= 10) {
                n = round_to(n, oDigits + 1);
            }
            //echo('n2', n);
            if (n >= aMin && n <= aMax) {
                //echo(n.toEng());
                r.push(n);
            }
        }
        k *= 10;
    }
    if (oEng) {
        return r.map((a) => a.toEng(oDigits));
    }
    return r;
}

function series_e96(aMin, aMax, oEng) {
    // Return E96 series of preferred values from aMin to aMax
    assert_arguments_length(arguments, 2, 3, 'series_e48(min,max,eng)');
    return series(aMin, aMax, [1.00, 1.02, 1.05, 1.07, 1.10, 1.13, 1.15, 1.18, 1.21, 1.24, 1.27, 1.30, 1.33, 1.37, 1.40, 1.43, 1.47, 1.50, 1.54, 1.58, 1.62, 1.65, 1.69, 1.74, 1.78, 1.82, 1.87, 1.91, 1.96, 2.00, 2.05, 2.10, 2.15, 2.21, 2.26, 2.32, 2.37, 2.43, 2.49, 2.55, 2.61, 2.67, 2.74, 2.80, 2.87, 2.94, 3.01, 3.09, 3.16, 3.24, 3.32, 3.40, 3.48, 3.57, 3.65, 3.74, 3.83, 3.92, 4.02, 4.12, 4.22, 4.32, 4.42, 4.53, 4.64, 4.75, 4.87, 4.99, 5.11, 5.23, 5.36, 5.49, 5.62, 5.76, 5.90, 6.04, 6.19, 6.34, 6.49, 6.65, 6.81, 6.98, 7.15, 7.32, 7.50, 7.68, 7.87, 8.06, 8.25, 8.45, 8.66, 8.87, 9.09, 9.31, 9.53, 9.76], oEng, 2);
}

function series_e48(aMin, aMax, oEng) {
    // Return E48 series of preferred values from aMin to aMax
    assert_arguments_length(arguments, 2, 3, 'series_e48(min,max,eng)');
    return series(aMin, aMax, [1.00, 1.05, 1.10, 1.15, 1.21, 1.27, 1.33, 1.40, 1.47, 1.54, 1.62, 1.69, 1.78, 1.87, 1.96, 2.05, 2.15, 2.26, 2.37, 2.49, 2.61, 2.74, 2.87, 3.01, 3.16, 3.32, 3.48, 3.65, 3.83, 4.02, 4.22, 4.42, 4.64, 4.87, 5.11, 5.36, 5.62, 5.90, 6.19, 6.49, 6.81, 7.15, 7.50, 7.87, 8.25, 8.66, 9.09, 9.53], oEng, 2);
}

function series_e24(aMin, aMax, oEng) {
    // Return E24 series of preferred values from aMin to aMax
    assert_arguments_length(arguments, 2, 3, 'series_e24(min,max,eng)');
    return series(aMin, aMax, [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1], oEng, 2);
}

function series_e12(aMin, aMax, oEng) {
    // Return E12 series of preferred values from aMin to aMax
    assert_arguments_length(arguments, 2, 3, 'series_e12(min,max,eng)');
    return series(aMin, aMax, [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2], oEng);
}

function series_e6(aMin, aMax, oEng) {
    // Return E6 series of preferred values from aMin to aMax
    assert_arguments_length(arguments, 2, 3, 'series_e6(min,max,eng)');
    return series(aMin, aMax, [1.0, 1.5, 2.2, 3.3, 4.7, 6.8], oEng);
}

function series_e3(aMin, aMax, oEng) {
    // Return E3 series of preferred values from aMin to aMax
    assert_arguments_length(arguments, 2, 3, 'series_e3(min,max,eng)');
    return series(aMin, aMax, [1.0, 2.2, 4.7], oEng);
}

globalThis.exports = {series_e3, series_e6, series_e12, series_e24, series_e48, series_e96};
globalThis.series_e3 = series_e3;
globalThis.series_e6 = series_e6;
globalThis.series_e12 = series_e12;
globalThis.series_e24 = series_e24;
globalThis.series_e48 = series_e48;
globalThis.series_e96 = series_e96;
