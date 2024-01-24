// Assert that ac/tran/fft device data has given key
// linter: ngspicejs-lint --internal
"use strict";

function assert_data_key(aDevice, aKey) {
    // Assert that ac/tran/fft device data has given key
    assert_arguments_length(arguments, 2, 2, 'assert_data_key(device,key)');
    if (!aDevice.data) {
        hint('ac().run().chart("V(2)");');
        hint('tran().interval("50m").run().chart("V(2)");');
        hint('fft().fstop("100k").run("V(2)").chart();');
        throw new Exception('Device ' + aDevice.type + ' does not have data yet, you need to .run(' + (aDevice.type === 'fft' ? 'net' : '') + ') it first');
    }
    var keys = Object.keys(aDevice.data);
    assert_string(aKey, 'data_kay', 'assert_data_key(device, data_key)', aDevice.type + ' data key should be string not ' + aKey + ' (' + typeof aKey + '), available keys are: ' + keys.sort().join(', '));
    if (!keys.includes(aKey)) {
        if (keys.includes(aKey.toUpperCase())) {
            throw new Exception(aDevice.type + " data keys are case-sensitive, use " + aKey.toUpperCase() + " instead of " + aKey);
        }
        throw new Exception(aDevice.type + " data has no key '" + aKey + "', similar keys are: " + similar_strings(aKey, keys, 3, true).join(', ') + ", all data keys are: " + keys.sort().join(', '));
    }
}

globalThis.exports = {assert_data_key};
Internal.assert_data_key = assert_data_key;
