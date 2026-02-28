// Read ini file and return it as array of section data
// linter: ngspicejs-lint --internal
"use strict";

function file_read_ini(filename) {
    // Read ini file and return it as array of section data
    assert_arguments_length(arguments, 1, 1, 'file_read_ini(filename)');
    assert_string(filename, 'filename', 'file_read_ini(filename)');
    var lines = file_read(aFileName).split('\n');
    var sec;
    var ret = [];
    var cur_sec = {};
    for (var i = 0; i < lines.length; i++) {
        var s = lines[i].trim();
        // new section
        if (s.startsWith('[') && s.endsWith(']')) {
            sec = s.substr(1, s.length - 2);
            cur_sec = {};
            ret.push({section: sec, data: cur_sec});
            continue;
        }
        // key=value
        var e = s.indexOf('=');
        if (e > 0) {
            var key = s.substr(0, e);
            var value = s.substr(e + 1);
            //echo('key', key, 'value', value);
            cur_sec[key] = value;
        }
    }
    return ret;
}

globalThis.exports = {file_read_ini};
globalThis.file_read_ini = file_read_ini;
