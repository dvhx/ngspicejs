// Create netlist snapshots and compare them (to warn about modified but not ran analyses)
// linter: ngspicejs-lint --internal
"use strict";

function netlist_snapshot(aNetlistDevices) {
    // Create independent netlist snapshot for later comparison using netlist_snapshot_compare(a,b)
    assert_arguments_length(arguments, 1, 1, 'netlist_snapshot(netlist_devices)');
    var o = {}, name;
    aNetlistDevices.forEach((d) => {
        name = d.attr && d.attr.name;
        if (o[name]) {
            throw new Exception('Cannot create netlist snapshot, duplicate device name "' + name + '"');
        }
        o[name] = {
            type: d.type,
            hash: JSON.stringify([d.type, d.expected_prefix, d.attr])
        };
    });
    return o;
}

function netlist_snapshot_compare(aSnapshot1, aSnapshot2) {
    // Compare two snapshots and return array of changes, e.g. ['Added R2', 'Removed U1', 'Modified C3']
    assert_arguments_length(arguments, 2, 2, 'netlist_snapshot_compare(snapshot1,snapshot2)');
    var changes = [];
    var a = Object.keys(aSnapshot1).sort();
    var b = Object.keys(aSnapshot2).sort();
    var removed = a.filter((u) => !b.includes(u));
    if (removed.length > 0) {
        changes.push('Removed ' + removed.join(', '));
    }
    var added = b.filter((u) => !a.includes(u));
    if (added.length > 0) {
        changes.push('Added ' + added.join(', '));
    }
    b.forEach((u) => {
        if (aSnapshot1[u] && aSnapshot2[u]) {
            if (aSnapshot1[u].hash !== aSnapshot2[u].hash) {
                changes.push('Modified ' + u);
            }
        }
    });
    return changes;
}

Internal.netlist_snapshot = netlist_snapshot;
Internal.netlist_snapshot_compare = netlist_snapshot_compare;
