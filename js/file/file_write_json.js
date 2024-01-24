// Write data to a json file
// linter: ngspicejs-lint --internal
"use strict";

function file_write_json(filename, data, aIndent) {
    // Write data to a json file
    assert_arguments_length(arguments, 2, 3, 'file_write_json(filename,data,indent)');
    assert_string(filename, 'filename', 'file_write_json(filename,data,indent)');
    if (aIndent !== undefined) {
        assert_integer(aIndent, 'indent', 'file_write_json(filename,data,indent)');
    }
    if (typeof aIndent === 'number') {
        file_write(filename, JSON.stringify(data, undefined, aIndent));
    } else {
        file_write(filename, JSON.stringify(data));
    }
}

globalThis.exports = {file_write_json};
globalThis.file_write_json = file_write_json;
