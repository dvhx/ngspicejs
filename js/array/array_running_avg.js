// Running average of an array
// linter: ngspicejs-lint --internal
"use strict";

function array_running_avg(arr, size) {
    // Return running average of an array
    assert_arguments_length(arguments, 1, 2, 'array_running_avg(array,size)');
    assert_array(arr, 'array', 'array_running_avg(array,size)');
    size = size || 5;
    var ret = [], buf = new Array(size);
    arr.forEach((v) => {
        buf.push(v);
        buf.shift();
        ret.push(array_avg(buf));
    });
    return ret;
}

globalThis.exports = {array_running_avg};
globalThis.array_running_avg = array_running_avg;
