// Damerau-Levenshtein distance between strings
// linter: ngspicejs-lint --internal
"use strict";

function levenshtein(aWord1, aWord2) {
    // Return Damerau-Levenshtein distance between strings
    if (aWord1 === '' || aWord2 === '') {
        return Math.max(aWord1.length, aWord2.length);
    }
    var x, cur = [], prev = [], a, b, c, d, y, m, c1, c2;
    for (x = 0; x <= aWord1.length; x++) {
        cur.push(0);
        prev.push(x);
    }
    for (y = 1; y <= aWord2.length; y++) {
        cur[0] = y;
        for (x = 1; x <= aWord1.length; x++) {
            a = prev[x] + 1;
            b = cur[x - 1] + 1;
            c = prev[x - 1];
            c1 = aWord1.charAt(x - 1).toLowerCase();
            c2 = aWord2.charAt(y - 1).toLowerCase();
            d = c;
            if (c1 !== c2) {
                d = c + 2;
            }
            m = Math.min(a, b, d);
            cur[x] = m;
        }
        prev = cur.slice(); // slice is shallow
    }
    return cur.slice(-1)[0]; // slice is shallow
}

globalThis.levenshtein = levenshtein;
globalThis.exports = {levenshtein};
