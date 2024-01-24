// Take properties from source object and add them to the destination object
// linter: ngspicejs-lint --internal
"use strict";

function object_merge(aDst, aSrc) {
    // Take properties from source object and add them to the destination object
    assert_arguments_length(arguments, 2, 2, 'object_merge(dst,src)');
    assert_object(aDst, 'dst', 'object_merge(dst,src)');
    assert_object(aSrc, 'src', 'object_merge(dst,src)');
    for (const [k, v] of Object.entries(aSrc)) {
        aDst[k] = v;
    }
}

globalThis.exports = {object_merge};
globalThis.object_merge = object_merge;
