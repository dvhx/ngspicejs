// Write .m file with samples usable in audio sources
// linter: ngspicejs-lint --internal
"use strict";

function file_write_m(aFileName, aTimes, aValues, oComment, oDigits) {
    // Write .m file with samples usable in audio sources
    assert_arguments_length(arguments, 3, 5, 'file_write_m(filename,times,values,comment,digits)');
    assert_string(aFileName, 'filename', 'file_write_m(filename,times,values,comment,digits)');
    assert_array_of_numbers(aTimes, 'times', 'file_write_m(filename,times,values,comment,digits)', false);
    assert_array_of_numbers(aValues, 'voltages', 'file_write_m(filename,times,values,comment,digits)', false);
    assert_array_same_length(aTimes, aValues, 'file_write_m(filename,times,values,comment,digits)');
    var i, arr = [
        '* ngspice samples file (' +
        'samples=' + aTimes.length + ' ' +
        (aTimes.length < 10000 ? 'times=' + array_min(aTimes).toEng() + '..' + array_max(aTimes).toEng() + 's ' : '') +
        (aTimes.length < 10000 ? 'values=' + array_min(aValues).toEng() + '..' + array_max(aTimes).toEng() : '') + ') ' +
        (oComment || '')
    ];
    if (oDigits) {
        for (i = 0; i < aTimes.length; i++) {
            arr.push(aTimes[i].toFixed(oDigits) + ' ' + aValues[i].toFixed(oDigits));
        }
    } else {
        for (i = 0; i < aTimes.length; i++) {
            arr.push(aTimes[i] + ' ' + aValues[i]);
        }
    }
    arr = arr.join('\n');
    file_write(aFileName, arr);
    return arr.length;
}

globalThis.exports = {file_write_m};
globalThis.file_write_m = file_write_m;
