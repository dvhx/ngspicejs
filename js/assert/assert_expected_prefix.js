// Assert that device's name starts with expected prefix (e.g. Resistor C1 is obvious error)
// linter: ngspicejs-lint --internal
"use strict";

function update_expected_prefix(aDevice, aName, aAllowThisPrefix) {
    // When using weird name, add it's prefix to expected_prefix array
    if (aAllowThisPrefix === true) {
        var prefix = aName.match(/^[A-Z]+/)[0];
        if (!aDevice.expected_prefix.includes(prefix)) {
            aDevice.expected_prefix.push(prefix);
        }
    }
}

function assert_expected_prefix(aName, aDevice) {
    // Assert that device's name starts with expected prefix (e.g. Resistor C1 is obvious error)
    assert_arguments_length(arguments, 2, 2, 'assert_expected_prefix(name,device)');
    if (aDevice.expected_prefix && (aDevice.expected_prefix.length > 0)) {
        var p, pr = aName.match(/^[A-Z]+/), ok = false;
        if (!pr) {
            throw new Exception('Device ' + aDevice.type + ' ' + aName + ' - name must start with letter');
        }
        pr = pr[0];
        for (p = 0; p < aDevice.expected_prefix.length; p++) {
            if (pr.startsWith(aDevice.expected_prefix[p])) {
                ok = true;
                break;
            }
        }
        if (!ok) {
            hint("To allow non-typical names use: " + aDevice.type + '().name("' + aName + '", true)...');
            hint("To allow non-typical names use: " + aDevice.type + '("' + aDevice.expected_prefix[0] + '1", ...).name("' + aName + '", true)...');
            hint("The purpose of this error is to prevent stupid errors like: resistor('C1', 1, 2, '100n');");
            throw new Exception('Device ' + aDevice.type + ' ' + aName + ' - name should start with ' + aDevice.expected_prefix.sort().join('... or ') + '... but starts with ' + pr + '. You can suppress this error with: (some device).name("' + aName + '", true);');
        }
    }
}

globalThis.exports = {assert_expected_prefix, update_expected_prefix};
Internal.assert_expected_prefix = assert_expected_prefix;
Internal.update_expected_prefix = update_expected_prefix;
