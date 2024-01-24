// Write 2D array into csv file
// linter: ngspicejs-lint --internal
"use strict";

function file_write_csv(filename, arr2d) {
    // Write 2D array into csv file
    assert_arguments_length(arguments, 2, 2, 'file_write_csv(filename,arr2d)');
    assert_string(filename, 'filename', 'file_write_csv(filename,arr2d)');
    if (!Array.isArray(arr2d) && typeof arr2d === 'object') {
        if (Array.isArray(arr2d.time)) {
            hint('given arr2d look like tran data, use tran.csv() to obtain tran data in csv format');
            hint('Example: file_write_csv("1.csv", tran().run().csv())');
        }
        if (Array.isArray(arr2d.frequency)) {
            hint('given arr2d look like ac or fft data, use ac.csv() or fft.csv() to obtain tran data in csv format');
            hint('Example: file_write_csv("1.csv", ac().run().csv())');
            hint('Example: file_write_csv("2.csv", fft().run("V(1)").csv())');
        }
    }
    assert_array(arr2d, 'arr2d', 'file_write_csv(filename,arr2d)');
    file_write(filename, csv_encode(arr2d));
}

globalThis.exports = {file_write_csv};
globalThis.file_write_csv = file_write_csv;
