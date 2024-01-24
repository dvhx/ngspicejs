// Assert that arguments have correct number of items
// linter: ngspicejs-lint --internal
"use strict";

function assert_arguments_length(aArguments, aMinLength, aMaxLength, aFunctionName) {
    // Assert that arguments have correct number of items
    var al = aArguments.length;
    if (al >= aMinLength && al <= aMaxLength) {
        return;
    }
    if (aArguments && (aArguments[0] === api)) {
        throw new Exception('Function "' + aFunctionName + '" requires ' + (aMinLength === aMaxLength ? aMinLength : (aMinLength + " to " + aMaxLength)) + ' arguments');
    }
    if (aMinLength !== undefined && aMinLength === aMaxLength && al !== aMinLength) {
        hint_args(aFunctionName, aArguments);
        throw new Exception(aFunctionName + " requires exactly " + aMinLength + " arguments but " + al + " was given");
    }
    if (aMinLength !== undefined && al < aMinLength) {
        hint_args(aFunctionName, aArguments);
        throw new Exception(aFunctionName + " requires at least " + aMinLength + " arguments but " + al + " was given");
    }
    if (aMaxLength !== undefined && al > aMaxLength) {
        hint_args(aFunctionName, aArguments);
        throw new Exception(aFunctionName + " requires at most " + aMaxLength + " arguments but " + al + " was given");
    }
}

globalThis.exports = {assert_arguments_length};
Internal.assert_arguments_length = assert_arguments_length;
