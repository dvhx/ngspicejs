// Return file extension (e.g. .html)
// linter: ngspicejs-lint --internal
"use strict";

function file_ext(filename) {
    // Return file extension (e.g. .html)
    assert_arguments_length(arguments, 1, 1, 'file_ext(filename)');
    assert_string(filename, 'filename', 'file_ext(filename)');
    var fn = file_name(filename), e, a;
    if (fn.substr(0, 1) === '.') {
        fn = fn.substr(1);
    }
    a = fn.split('.');
    if (a.length === 1) {
        return "";
    }
    if (a.length > 0) {
        e = '.' + a[a.length - 1];
        return e === fn ? '' : e;
    }
    return '';
}

globalThis.exports = {file_ext};
globalThis.file_ext = file_ext;
