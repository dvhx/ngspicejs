// This is "lighter" version of "find_model()" that does not actually load the model only checks if it exists
// linter: ngspicejs-lint --internal
"use strict";

function assert_model_exists(aDevice, aKind, aModel) {
    // This is "lighter" version of "find_model()" that does not actually load the model only checks if it exists
    assert_arguments_length(arguments, 3, 3, 'assert_model_exists(device, kind, model)');
    assert_string(aKind);
    assert_string(aModel);
    // in cache
    if (model_cache[aModel]) {
        return;
    }
    // find model without actually creating it
    find_model(aDevice, aKind, aModel, true);
    delete model_cache[aModel];
}

globalThis.exports = {assert_model_exists};
Internal.assert_model_exists = assert_model_exists;
