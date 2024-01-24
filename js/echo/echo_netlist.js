// Print netlist
// linter: ngspicejs-lint --internal
"use strict";

function echo_netlist(aWithComments) {
    // Print netlist
    assert_arguments_length(arguments, 0, 1, 'echo_netlist(with_comments)');
    // with comments (as is)
    if (aWithComments) {
        echo(netlist_render(netlist_devices, netlist_line_markers, true, false));
        return;
    }
    // remove comments
    var i, s, lines = netlist_render(netlist_devices, netlist_line_markers, true, false).split('\n');
    echo('* first line is ignored');
    for (i = 0; i < lines.length; i++) {
        s = lines[i].trim();
        if (s.startsWith('*')) {
            continue;
        }
        echo(lines[i]);
    }
}

globalThis.exports = {echo_netlist};
globalThis.echo_netlist = echo_netlist;
