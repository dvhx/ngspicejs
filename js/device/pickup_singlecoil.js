// Singlecoil pickup
// linter: ngspicejs-lint --internal
"use strict";

function pickup_singlecoil(aName, aAnode, aCathode) {
    // Add singlecoil pickup to netlist
    assert_arguments_length(arguments, 0, 3, 'pickup_singlecoil(name, anode, cathode)');
    var p;
    if (arguments.length !== 1 && typeof aName === 'object') {
        p = pickup(aName);
        p.subtype = 'humbucker';
        return p;
    }
    p = pickup({
        name: aName,
        anode: aAnode,
        cathode: aCathode,
        l: 2.85,
        rs: 5361,
        cp: 258e-12,
        rp: 245000,
        v: 0.1,
        f: 196,
        damping: 69.3,
        phase: 0,
        overtones: 0
    });
    p.subtype = 'singlecoil';
    return p;
}

globalThis.exports = {pickup_singlecoil};
globalThis.pickup_singlecoil = pickup_singlecoil;
//Internal.device_constructor.pickup_singlecoil = pickup_singlecoil;
