// Read csv file and return it as 2D array (optionally as array of objects)
// linter: ngspicejs-lint --internal
"use strict";

function file_read_csv(filename,as_assoc) {
    // Read csv file and return it as 2D array (optionally as array of objects)
    assert_arguments_length(arguments, 1, 2, 'file_read_csv(filename,as_assoc)');
    assert_string(filename, 'filename', 'file_read_csv(filename,as_assoc)');
    return csv_decode(file_read(filename).trim(), as_assoc);
}

globalThis.exports = {file_read_csv};
globalThis.file_read_csv = file_read_csv;
