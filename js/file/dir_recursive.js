// Return array of filenames and dirs in given path recursively
// linter: ngspicejs-lint --internal
"use strict";

function dir_recursive(aPath) {
    // Return array of filenames and dirs in given path recursively
    assert_arguments_length(arguments, 1, 1, 'dir_recursive(path)');
    assert_string(aPath, 'path', 'dir_recursive(path)');
    var all = [];
    function one(p) {
        var d = dir(p);
        d.forEach((fn) => {
            all.push(fn);
            if (file_is_dir(fn)) {
                one(fn);
            }
        });
    }
    one(aPath);
    return all;
}

globalThis.exports = {dir_recursive};
globalThis.dir_recursive = dir_recursive;
