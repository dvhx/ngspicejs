// Read json file
// linter: ngspicejs-lint --internal
"use strict";

function file_read_json(aFilename) {
    // Read json file
    assert_arguments_length(arguments, 1, 1, 'file_read_json(filename)');
    assert_string(aFilename, 'filename', 'file_read_json(filename)');
    var s = file_read(aFilename);
    try {
        return JSON.parse(s);
    } catch (e) {
        // show where in json error occured
        if (s.length < 100000) {
            var m = e.toString().match(/ in JSON at position ([0-9]+)/);
            if (m) {
                var pos = parseInt(m[1], 10);
                var lines = s.split('\n');
                var n = 0;
                var row = 0;
                var col = 0;
                for (var i = 0; i < lines.length; i++) {
                    if (n + lines[i].length + 1 > pos - 1) {
                        row = i;
                        col = pos - n - 1;
                        break;
                    }
                    n += lines[i].length + 1;
                }
                hint('File "' + aFilename + '", line ' + row + ', char ' + col);
                if (lines[row-1]) {
                    hint(lines[row-1]);
                }
                if (lines[row]) {
                    hint(lines[row]);
                }
                hint((new Array(col)).fill(' ').join('') + '\x1b[93m\x1b[1m^\x1b[0m');
                if (lines[row + 1]) {
                    hint(lines[row + 1]);
                }
            }
        }
        throw new Exception("file_read_json('" + aFilename + "') - Cannot parse JSON: " + e);
    }
}

globalThis.exports = {file_read_json};
globalThis.file_read_json = file_read_json;
