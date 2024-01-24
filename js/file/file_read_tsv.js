// Read tsv file and return it as 2D array
// linter: ngspicejs-lint --internal
"use strict";

function file_read_tsv(filename) {
    // Read tsv file and return it as 2D array
    assert_arguments_length(arguments, 1, 1, 'file_read_tsv(filename)');
    assert_string(filename, 'filename', 'file_read_tsv(filename)');
    return file_read(filename).trim().split('\n').map((a) => a.split('\t'));
}

globalThis.exports = {file_read_tsv};
globalThis.file_read_tsv = file_read_tsv;
