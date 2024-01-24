// Print anything, even circular structure
// linter: ngspicejs-lint --internal
"use strict";

function echo_json(aObject) {
    // Print anything, even circular structure
    //echo_json.counter = 0;

    function one(aObject, aPrefix, aSeen, aKey) {
        // Recursive printing function
        if (aSeen === undefined) {
            echo_json.counter++;
        }
        var tag = echo_json.counter + '.';
        aSeen = aSeen || [];
        aKey = aKey === undefined ? '' : aKey;
        aPrefix = aPrefix || '';
        // null
        if (aObject === null) {
            echo(aPrefix + (aKey ? '"' + aKey + '": ' : '') + 'null');
            return;
        }
        // undefined
        if (aObject === undefined) {
            echo(aPrefix + (aKey ? '"' + aKey + '": ' : '') + 'undefined');
            return;
        }
        // object
        var i, keys;
        var seen_index;
        if (typeof aObject === 'object') {
            seen_index = aSeen.indexOf(aObject);
            if (seen_index >= 0) {
                echo(aPrefix + (aKey !== '' ? '' + aKey + ': ' : '') + 'Seen object #' + tag + seen_index);
                return;
            }
            seen_index = aSeen.push(aObject);
        }
        var seen_index_str = seen_index >= 0 ? ' (Object #' + tag + seen_index + ')' : '';
        // array
        if (Array.isArray(aObject)) {
            echo(aPrefix + (aKey !== '' ? '' + aKey + ': ' : '') + 'Array (' + aObject.length + ' items):' + seen_index_str);
            for (i = 0; i < aObject.length; i++) {
                one(aObject[i], aPrefix + '    ', aSeen, '[' + i + ']');
            }
            return;
        }
        // object
        if (typeof aObject === 'object') {
            keys = Object.keys(aObject);
            echo(aPrefix + (aKey === '' ? '' : (Number.isInteger(aKey) ? '[' + aKey + ']: ' : '' + aKey + ': ')) + 'Object (' + keys.length + ' keys)' + (keys.length > 0 ? ':' : ' {}') + seen_index_str);
            for (i = 0; i < keys.length; i++) {
                if (keys[i] === 'netlist_devices' || keys[i] === 'sub_devices' || keys[i] === 'parent_devices') {
                    echo(aPrefix + '    "' + keys[i] + '": Array(' + aObject[keys[i]].length + ' items) ... omitted');
                } else {
                    one(aObject[keys[i]], aPrefix + '    ', aSeen, '"' + keys[i] + '"');
                }
            }
            return;
        }
        // number & others
        var len = typeof aObject === 'string' ? '[' + aObject.length + ']' : '';
        if (Number.isInteger(aKey)) {
            echo(aPrefix + '[' + aKey + ']: ' + (typeof aObject) + len + ' = ' + aObject);
        } else {
            echo(aPrefix + '' + aKey + ': ' + (typeof aObject) + len + ' = ' + aObject);
        }
    }
    one(aObject);
}

echo_json.counter = 0;

globalThis.exports = {echo_json};
globalThis.echo_json = echo_json;
