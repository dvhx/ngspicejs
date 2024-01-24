// Return true if file is directory
// linter: ngspicejs-lint --internal
"use strict";

function file_is_dir(aFileName) {
    // Return true if file is directory
    assert_arguments_length(arguments, 1, 1, 'file_is_dir(filename)');
    assert_string(aFileName, 'filename', 'file_is_dir(filename)');
    return file_exists(aFileName + '/');
}

globalThis.exports = {file_is_dir};
globalThis.file_is_dir = file_is_dir;
