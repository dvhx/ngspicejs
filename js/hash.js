// DJB2 string hash function, reduces string to uint32 number
// linter: ngspicejs-lint --internal
"use strict";

function hash(str) {
    // DJB2 string hash function, reduces string to uint32 number
    var len = str.length;
    var h = 5381;
    for (var i = 0; i < len; i++) {
        h = h * 33 ^ str.charCodeAt(i);
    }
    return h >>> 0;
}

globalThis.hash = hash;
globalThis.exports = {hash};
