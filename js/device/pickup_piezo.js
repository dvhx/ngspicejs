// 27mm piezo pickup
// linter: ngspicejs-lint --internal
"use strict";

function pickup_piezo(aName, aAnode, aCathode) {
    // Add 27mm piezo pickup to netlist
    assert_arguments_length(arguments, 0, 3, 'pickup_piezo(name, anode, cathode)');
    var p;
    if (arguments.length !== 1 && typeof aName === 'object') {
        p = pickup(aName);
        p.subtype = 'piezo';
        return p;
    }
    p = pickup({
        name: aName,
        anode: aAnode,
        cathode: aCathode,
        l: 0,
        c: eng('20n'),
        rs: 150,
        cp: eng('5p'),
        rp: eng('2G'),
        v: 0.1,
        f: 196,
        damping: 69.3,
        phase: 0,
        overtones: 0
    });
    p.subtype = 'piezo';
    return p;
}

globalThis.exports = {pickup_piezo};
globalThis.pickup_piezo = pickup_piezo;
//Internal.device_constructor.pickup_piezo = pickup_piezo;
