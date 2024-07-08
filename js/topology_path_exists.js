// Return all pairs of connected nets as {net1:{net2:true,net3:true},net2:...}
// linter: ngspicejs-lint --internal
"use strict";

function topology_path_exists(aEdges, aFromNet, aToNet, oStopNets) {
    // Return true if direct path exists from one net to another
    // oStopNets is optional array of nets where search stops:
    // For example you want to know in amplifier there is a path from input to output
    // but you need to stop search at the input net and output net because the path would
    // be found through battery or load instead of insides of the amplifier
    var seen = {}, found = false, sp = {};
    if (Array.isArray(oStopNets)) {
        oStopNets.forEach((n) => sp[n] = true);
    }
    aFromNet = aFromNet.toString();
    aToNet = aToNet.toString();
    function one(aNet) {
        // recursion
        if (aNet === aToNet) {
            found = true;
            return;
        }
        if (found) {
            return;
        }
        if (aNet !== aFromNet && aNet !== aToNet) {
            if (sp[aNet]) {
                return;
            }
        }
        if (!seen[aNet]) {
            seen[aNet] = true;
            Object.keys(aEdges[aNet]).forEach((n) => one(n));
        }
    }
    one(aFromNet, []);
    return found;
}

globalThis.topology_path_exists = topology_path_exists;
globalThis.exports = {topology_path_exists};

