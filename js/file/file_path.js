// Return only file path, without filename
// linter: ngspicejs-lint --internal
"use strict";

function file_path(aPath) {
    // Return only file path, without filename
    assert_arguments_length(arguments, 1, 1, 'file_path(path)');
    assert_string(aPath, 'path', 'file_path(path)');
    var a = aPath.split('/');
    return a.slice(0, a.length - 1).join('/');
}

globalThis.exports = {file_path};
globalThis.file_path = file_path;
