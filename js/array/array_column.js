// Return one column of a 2D array
// linter: ngspicejs-lint --internal
"use strict";

function array_column(aArray2D, aColumnIndex, aStartingRow) {
    // Return one column of a 2D array
    assert_arguments_length(arguments, 2, 3, 'array_column(array_2d,column_index,starting_row)');
    assert_array(aArray2D, 'array_2d', 'array_column(array_2d,column_index,starting_row)');
    return aArray2D.map((row) => row[aColumnIndex]).slice(aStartingRow || 0);
}

globalThis.exports = {array_column};
globalThis.array_column = array_column;
