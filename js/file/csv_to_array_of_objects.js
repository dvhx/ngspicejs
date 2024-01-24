// Convert CSV table to array of objects using header as property name
// linter: ngspicejs-lint --internal
"use strict";

function csv_to_array_of_objects(aCsvTable) {
    // Convert CSV table to array of objects using header as property name
    assert_arguments_length(arguments, 1, 1, 'csv_to_array_of_objects(array_2d)');
    assert_array(aCsvTable, 'array_2d', 'csv_to_array_of_objects(array_2d)');
    var i, h, header = aCsvTable[0], o, all = [];
    for (i = 1; i < aCsvTable.length; i++) {
        o = {};
        if (aCsvTable[i].length > header.length) {
            throw new Exception("CSV row #" + i + " is shorter than header");
        }
        for (h = 0; h < header.length; h++) {
            o[header[h].trim()] = aCsvTable[i][h];
        }
        all.push(o);
    }
    return all;
}

globalThis.exports = {csv_to_array_of_objects};
globalThis.csv_to_array_of_objects = csv_to_array_of_objects;

