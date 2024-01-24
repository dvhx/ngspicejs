// Assert that netlist didn't change since last analysis, if it did, it means user forgot to ran analysis (why changing netlist if you not gonna run analysis?)
// linter: ngspicejs-lint --internal
"use strict";

function assert_netlist_snapshot_unchanged() {
    // Assert that netlist didn't change since last analysis, if it did, it means user forgot to ran analysis (why changing netlist if you not gonna run analysis?)
    assert_arguments_length(arguments, 0, 0, 'assert_netlist_snapshot_unchanged()');
    if (Internal.netlist_snapshot_analysis) {
        var snap = Internal.netlist_snapshot(netlist_devices);
        var changes = Internal.netlist_snapshot_compare(Internal.netlist_snapshot_analysis, snap);
        /*
        echo_json(Internal.netlist_snapshot_analysis);
        echo_json(snap);
        */
        if (changes.length > 0) {
            warn('netlist changed (' + changes.join(', ') + ') but no further analysis was used, this is probably error!');
        }
    }
}

Internal.assert_netlist_snapshot_unchanged = assert_netlist_snapshot_unchanged;
