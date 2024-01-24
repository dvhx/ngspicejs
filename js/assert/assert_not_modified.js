// Assert that analysis is not in "modified but not run" stage, e.g. tran().run().interval('10m').chart('V(1)')
// linter: ngspicejs-lint --internal
"use strict";

function assert_not_modified(aDevice, aMethod, aWhatRunFirst, aHint) {
    // Assert that analysis is not in "modified but not run" stage, e.g. tran().run().interval('10m').chart('V(1)')
    assert_arguments_length(arguments, 2, 4, 'assert_not_modified(device,method,what_run_first,hint)');
    if (!aDevice.hasOwnProperty('modified')) {
        return;
    }
    if (typeof aDevice.modified !== 'boolean') {
        if (aHint) {
            hint(aHint);
        }
        throw new Exception('assert_not_modified(device,method) requires device to have .modified boolean');
    }
    if (aDevice.modified) {
        if (aHint) {
            hint(aHint);
        }
        var s = aWhatRunFirst ? ', use ' + aWhatRunFirst + ' before calling ' + aMethod : ', when called ' + aMethod;
        throw new Exception('Device ' + aDevice.type + ' was modified' + s);
    }
}

globalThis.exports = {assert_not_modified};
Internal.assert_not_modified = assert_not_modified;
