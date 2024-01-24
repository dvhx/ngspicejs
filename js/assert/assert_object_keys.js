// Assert that object has all of the specified keys
// linter: ngspicejs-lint --internal
"use strict";

function assert_object_keys(aObject, aKeys, aVariableName, aFunctionName) {
    // Assert that object has all of the specified keys
    assert_arguments_length(arguments, 4, 4, 'assert_object_keys(object,keys,variable_name,function_name)');
    if (typeof aObject !== 'object') {
        throw new Exception(aVariableName + ' in function ' + aFunctionName + ' should be object but is ' + typeof aObject);
    }
    var i;
    for (i = 0; i < aKeys.length; i++) {
        if (!Object.hasOwn(aObject, aKeys[i])) {
            throw new Exception('Object "' + aVariableName + '" in function ' + aFunctionName + ' has no expected property "' + aKeys[i] + '", available properties are: ' + Object.keys(aObject).join(', '));
        }
    }
}

globalThis.exports = {assert_object_keys};
Internal.assert_object_keys = assert_object_keys;
