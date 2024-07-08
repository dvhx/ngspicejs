// Return all pairs of connected nets as {net1:{net2:true,net3:true},net2:...}
// linter: ngspicejs-lint --internal
"use strict";

function topology_edges(aElements) {
    // Return all pairs of connected nets as {net1:{net2:true,net3:true},net2:...}
    var edges = {}, i, j, a, b;
    // find all connections between two nets
    aElements.filter((e) => e.is_net_device).forEach((e) => {
        var n = Object.values(e.get_nets());
        for (i = 0; i < n.length - 1; i++) {
            for (j = i + 1; j < n.length; j++) {
                a = n[i];
                b = n[j];
                edges[a] = edges[a] || {};
                edges[a][b] = true;
                edges[b] = edges[b] || {};
                edges[b][a] = true;
            }
        }
    });
    return edges;
}

globalThis.topology_edges = topology_edges;
globalThis.exports = {topology_edges};


