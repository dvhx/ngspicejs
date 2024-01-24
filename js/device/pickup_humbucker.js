// Humbucker pickup
// linter: ngspicejs-lint --internal
"use strict";

function pickup_humbucker(aName, aAnode, aCathode) {
    // Add humbucker pickup to netlist
    assert_arguments_length(arguments, 0, 3, 'pickup_humbucker(name, anode, cathode)');
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
        l: 5.4,
        rs: 8550,
        cp: 1.5e-11,
        rp: 10e6,
        v: 0.1,
        f: 196,
        damping: 69.3,
        phase: 0,
        overtones: 0
    });
    p.subtype = 'humbucker';
    return p;
}

globalThis.exports = {pickup_humbucker};
globalThis.pickup_humbucker = pickup_humbucker;
//Internal.device_constructor.pickup_humbucker = pickup_humbucker;
