// Decode CSV-encoded string and return 2D array
// linter: ngspicejs-lint --internal
"use strict";

function csv_decode(text) {
    // Decode CSV-encoded string and return 2D array
    assert_arguments_length(arguments, 1, 1, 'csv_decode(text)');
    assert_string(text, 'text', 'csv_decode(text)');
    var p = '';
    var row = [''];
    var ret = [row];
    var i = 0;
    var r = 0;
    var s = true;
    var l;
    for (var n = 0; n < text.length; n++) {
        l = text.charAt(n);
        if ('"' === l) {
            if (s && l === p) {
                row[i] += l;
            }
            s = !s;
        } else if (',' === l && s) {
            l = row[++i] = '';
        } else if ('\n' === l && s) {
            if ('\r' === p) {
                row[i] = row[i].slice(0, -1);
            }
            row = ret[++r] = [l = ''];
            i = 0;
        } else {
            row[i] += l;
        }
        p = l;
    }
    return ret;
}

globalThis.exports = {csv_decode};
globalThis.csv_decode = csv_decode;
