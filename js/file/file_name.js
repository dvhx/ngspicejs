// Return only filename without preceeding path
// linter: ngspicejs-lint --internal
"use strict";

function file_name(aPath) {
    // Return only filename without preceeding path
    assert_arguments_length(arguments, 1, 1, 'file_name(path)');
    assert_string(aPath, 'path', 'file_name(path)');
    var a = aPath.split('/');
    if (a.length > 0) {
        return a[a.length - 1];
    }
    return a[0];
}

globalThis.exports = {file_name};
globalThis.file_name = file_name;
