// Converting engineering string "4k7" to number 4700
// linter: ngspicejs-lint --internal
"use strict";

String.prototype.toEng = function (oDigits, oKeepDotZero) {
    // Convert it to number first and then back to eng
    return this.fromEng().toEng(oDigits, oKeepDotZero);
};

String.prototype.fromEng = function (aCustomErrorMessage) {
    // Converting engineering string "4k7" to number 4700
    var s = this.toString(), m, a, b, c, d, z = s.at(-1);
    // obvious unit at the end
    if (z === 's' || z === 'F' || z === 'R' || z === 'V' || z === 'A' || z === 'H') {
        throw new Exception(aCustomErrorMessage + " (don't use units, use '" + s.substr(0, s.length - 1) + "' instead of '" + s + "')");
    }
    // -1
    m = s.match(/^[+\-]{0,1}[0-9]+$/);
    if (m) {
        return parseInt(m[0]);
    }
    // -12e-3
    m = s.match(/^[+\-]{0,1}[0-9]+([eE]{0,1}[+\-]{0,1}[0-9]+)*$/);
    if (m) {
        return parseFloat(m[0]);
    }
    // -123.56e-5
    m = s.match(/^[+\-]{0,1}[0-9]+[.]*[0-9]+([eE]{0,1}[+\-]{0,1}[0-9]+)*$/);
    if (m) {
        return parseFloat(m[0]);
    }
    // -123k5
    var multiplier = {
            '': 1,
            k: 1e3,
            M: 1e6,
            G: 1e9,
            T: 1e12,
            m: 1e-3,
            u: 1e-6,
            n: 1e-9,
            p: 1e-12,
            f: 1e-15,
            a: 1e-18
        };
    m = s.match(/^([+\-]{0,1}[0-9]+)([kMGTmunpfa])([0-9]+)$/);
    if (m) {
        a = m[1];
        b = m[3];
        c = parseFloat(a + '.' + b);
        d = multiplier[m[2]];
        //echo('a', a, 'b', b, 'c', c, 'd', d, 'm', m);
        return c * d;
    }
    // -1k
    m = s.match(/^([+\-]{0,1}[0-9]+)([kMGTmunpfa])$/);
    if (m) {
        a = m[1];
        c = parseFloat(a);
        d = multiplier[m[2]];
        //echo('a', a, 'b', b, 'c', c, 'd', d, 'm', m);
        return c * d;
    }
    // -1.23k
    m = s.match(/^([+\-]{0,1}[0-9]+[.]{1}[0-9]+)([kMGTmunpfa])$/);
    if (m) {
        //echo_json(m);
        d = multiplier[m[2]];
        return m[1] * d;
    }
    // error
    var allowed = ", allowed suffixes are: m,u,n,p,f,a,k,M,G,T";
    throw new Exception(aCustomErrorMessage || "Unsupported engineering format '" + s + "'" + allowed);
};

globalThis.exports = {};
