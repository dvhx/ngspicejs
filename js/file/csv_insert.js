// Insert data to csv data (from given col/row down)
// linter: ngspicejs-lint --internal
"use strict";

function csv_insert(aCsv, aCol, aRow, aData) {
    // Insert data to csv data (from given col/row down)
    assert_arguments_length(arguments, 4, 4, 'csv_insert(array_2d,column,row,data)');
    assert_array(aCsv, 'array_2d', 'csv_insert(array_2d,column,row,data)');
    assert_array(aCsv[0], 'array_2d[0]', 'csv_insert(array_2d,column,row,data)');
    assert_integer(aCol, 'column', 'csv_insert(array_2d,column,row,data)', 0, aCsv[0].length);
    assert_integer(aRow, 'row', 'csv_insert(array_2d,column,row,data)', 0, aCsv.length);
    assert_array(aData, 'data', 'csv_insert(array_2d,column,row,data)');
    var i;
    for (i = 0; i < aData.length; i++) {
        aCsv[aRow + i] = aCsv[aRow + i] || [];
        aCsv[aRow + i][aCol] = aData[i];
    }
}

globalThis.exports = {csv_insert};
globalThis.csv_insert = csv_insert;
