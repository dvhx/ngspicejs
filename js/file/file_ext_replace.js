// Replace file extension with new one
// linter: ngspicejs-lint --internal
"use strict";

function file_ext_replace(filename, extension) {
    // Replace file extension with new one
    assert_arguments_length(arguments, 2, 2, 'file_ext_replace(filename,new_extension)');
    assert_string(filename, 'filename', 'file_ext_replace(filename,new_extension)');
    if (arguments.length >= 2) {
        assert_string(extension, 'new_extension', 'file_ext_replace(filename,new_extension)');
    }
    extension = extension || '';
    var old = file_ext(filename);
    if (old) {
        filename = filename.substr(0, filename.length - old.length);
    }
    return filename + extension;
}

globalThis.exports = {file_ext_replace};
globalThis.file_ext_replace = file_ext_replace;
