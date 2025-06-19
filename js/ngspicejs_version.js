// Return ngspicejs version
// linter: ngspicejs-lint --internal
"use strict";

function ngspicejs_version(oMin, oMax) {
    // Return ngspicejs version, throw exception if current version is outside allowed range of versions
    assert_arguments_length(arguments, 0, 2, 'ngspicejs_version(min,max)');
    var v = 3;
    if (Number.isInteger(oMin) && (v < oMin)) {
        throw new Exception('This script requires minimal ngspicejs version ' + oMin + ' but current ngspicejs version is ' + v);
    }
    if (Number.isInteger(oMax) && (v > oMax)) {
        throw new Exception('This script requires maximal ngspicejs version ' + oMax + ' but current ngspicejs version is ' + v);
    }
    return v;
}

globalThis.exports = {ngspicejs_version};
globalThis.ngspicejs_version = ngspicejs_version;
