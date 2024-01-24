// Read csv file and return it as 2D array
// linter: ngspicejs-lint --internal
"use strict";

function file_read_csv(filename) {
    // Read csv file and return it as 2D array
    assert_arguments_length(arguments, 1, 1, 'file_read_csv(filename)');
    assert_string(filename, 'filename', 'file_read_csv(filename)');
    return csv_decode(file_read(filename).trim());
}

globalThis.exports = {file_read_csv};
globalThis.file_read_csv = file_read_csv;
