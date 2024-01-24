// Write 2D array into tsv file (tab separated values)
// linter: ngspicejs-lint --internal
"use strict";

function file_write_tsv(filename, arr) {
    // Write 2D array into tsv file (tab separated values)
    assert_arguments_length(arguments, 2, 2, 'file_write_tsv(filename,array)');
    assert_string(filename, 'filename', 'file_write_tsv(filename,array)');
    assert_array(arr, 'filename', 'file_write_tsv(filename,array)');
    file_write(filename, csv_encode(arr, '\t'));
}

globalThis.exports = {file_write_tsv};
globalThis.file_write_tsv = file_write_tsv;
