// Encode 2D array into csv file format
// linter: ngspicejs-lint --internal
"use strict";

function csv_encode(arr, separator) {
    // Encode 2D array into csv file format
    assert_arguments_length(arguments, 1, 2, 'csv_encode(array,separator)');
    assert_array(arr, 'arr', 'csv_encode(array,separator)');
    if (arguments.length === 2) {
        assert_string(separator, 'separator', 'csv_encode(array,separator)');
    }
    separator = separator || ',';
    return arr.map(
      function (line) {
        return line.map(function (val) {
            var s = val.toString().replace(/\"/g, '""'); //"
            if (s.match(/[\"\,]/)) { //"
                s = '"' + s + '"';
            }
          return s;
        }).join(separator);
      }).join('\n');
}

globalThis.exports = {csv_encode};
globalThis.csv_encode = csv_encode;
