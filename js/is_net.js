// Return true if value is valid net name
// linter: ngspicejs-lint --internal
"use strict";

function is_net(aValue) {
    // Return true if value is valid net name
    assert_arguments_length(arguments, 1, 1, 'is_net(net)');
    if (aValue === undefined) {
        return false;
    }
    if (Number.isInteger(aValue)) {
        return true;
    }
    if (['time', 'frequency'].includes(aValue)) {
        return false;
    }
    if (typeof aValue === 'string') {
        aValue = aValue.replace('#branch', '');
        if (aValue.match(/^[0-9\.]{1,100}$/)) {
            return false;
        }
        var s = aValue.match(/^[a-z0-9_]{1,100}$/);
        if (s) {
            s = s[0];
        }
        if (aValue !== s) {
            return false;
        }
        return true;
    }
    return false;
}

globalThis.exports = {is_net};
globalThis.is_net = is_net;
