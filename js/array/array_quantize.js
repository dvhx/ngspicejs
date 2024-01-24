// Quantize array values range into discreet values from 0 to aCount-1
// linter: ngspicejs-lint --internal
"use strict";

function array_quantize(aData, aCount) {
    // Quantize array values range into discreet values from 0 to aCount-1
    assert_arguments_length(arguments, 2, 2, 'array_quantize(array,count)');
    assert_array(aData, 'array', 'array_quantize(array,count)');
    return array_normalize(aData, 0, aCount - 1).map(Math.round);
}

globalThis.exports = {array_quantize};
globalThis.array_quantize = array_quantize;
