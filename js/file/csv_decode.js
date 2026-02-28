// Decode CSV-encoded string and return 2D array (optionally as array of objects)
// linter: ngspicejs-lint --internal
"use strict";

function csv_to_obj(aCsvTable) {
    var header = aCsvTable[0];
    var ret = [];
    aCsvTable.forEach((r,row) => {
        if (row > 0) {
            var o = {};
            header.forEach((c,col) => o[c] = r[col]);
            ret.push(o);
        }
    });
    return ret;
}

function csv_decode(text,as_assoc) {
    // Decode CSV-encoded string and return 2D array (optionally as array of objects)
    assert_arguments_length(arguments, 1, 2, 'csv_decode(text,as_assoc)');
    assert_string(text, 'text', 'csv_decode(text,as_assoc)');
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
    if (as_assoc) {
        return csv_to_obj(ret);
    }
    return ret;
}

globalThis.exports = {csv_decode};
globalThis.csv_decode = csv_decode;
