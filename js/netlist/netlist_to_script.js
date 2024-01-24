// Convert current netlist to ngspice script
// linter: ngspicejs-lint --internal
"use strict";

function netlist_to_script(aComment) {
    // convert current netlist to ngspicejs script
    assert_arguments_length(arguments, 0, 1, 'netlist_to_script(comment)');
    if (aComment) {
        assert_string(aComment, 'comment', 'netlist_to_script(comment)');
    }
    var a = ['#!/usr/bin/env ngspicejs', '// ' + (aComment || 'ngspicejs script'), '// linter: ngspicejs-lint', '"use strict";', ''];
    netlist_devices.forEach((d) => a.push(d.type + '(' + JSON.stringify(d.attr) + ');'));
    return a;
}

globalThis.netlist_to_script = netlist_to_script;
globalThis.exports = {netlist_to_script};

