// Converting number 4700 to engineering form 4k7
// linter: ngspicejs-lint --internal
"use strict";

Number.prototype.fromEng = function () {
    // Number is already from eng
    return this;
};

Number.prototype.toEng = function (oDigits, oKeepDotZero) {
    // Converts 4.7e-6 to 4.7u
    var dig = oDigits === undefined ? 1 : oDigits;
    var a = Math.abs(this);
    if (a === 0) {
        return '0';
    }
    var m = a > 1 ? 0.001 : 1000;
    var n = a > 1 ? 3 : -3;
    var e = 0;
    var sign = this < 0 ? '-' : '';
    //echo(this, '.toEng() a', a, 'm', m, 'e', e, 'sign', sign);
    while (a < 1 || a >= 1000) {
        a *= m;
        e += n;
        //echo('a', a, 'm', m, 'e', e);
    }
    var s = {
        '-18': 'a',
        '-15': 'f',
        '-12': 'p',
        '-9': 'n',
        '-6': 'u',
        '-3': 'm',
        '0': '',
        '3': 'k',
        '6': 'M',
        '9': 'G',
        '12': 'T',
    };
    var oa = a;
    a = a.toFixed(dig);
    //echo(a);
    // fix 1000.000m to 1.000
    if (dig) {
        if (a === '1000.' + '0000000000'.substr(0, dig)) {
            oa /= 1000;
            a = oa.toFixed(dig);
            e -= n;
        }
    }
    if (!oKeepDotZero) {
        var z = '\.00000000000000000'.substr(0, dig + 1);
        a = a.replace(z, '');
    }
    if (e === 0) {
        return sign + a;
    }
    if (s[e]) {
        return sign + a + s[e];
    }
    return sign + a + 'e' + e;
};

globalThis.exports = {};
