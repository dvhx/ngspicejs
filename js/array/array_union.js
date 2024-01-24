// Return union of 2 arrays, for [1,2,3,4] and [3,4,5,6] it returns [3,4]
// linter: ngspicejs-lint --internal
"use strict";

function array_union(a, b) {
    // Return union of 2 arrays, for [1,2,3,4] and [3,4,5,6] it returns [3,4]
    assert_arguments_length(arguments, 2, 2, 'array_union(a,b)');
    assert_array(a, 'a', 'array_union(a,b)');
    assert_array(b, 'b', 'array_union(a,b)');
    var o = {};
    var r = [];
    var i;
    for (i = 0; i < a.length; i++) {
        o[a[i]] = true;
    }
    for (i = 0; i < b.length; i++) {
        if (o[b[i]]) {
            r.push(b[i]);
        }
    }
    return r;
}

globalThis.exports = {array_union};
globalThis.array_union = array_union;
