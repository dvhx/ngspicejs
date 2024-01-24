// Warn if source device uses more than 3 arguments as it is very error prone, use .v(5).f(50) or {v:5, f:50} instead
// linter: ngspicejs-lint --internal
"use strict";

function warn_source_arguments_length(aArguments, aDevice, aCount) {
    // Warn if source device uses more than 3 arguments as it is very error prone, use .v(5).f(50) or {v:5, f:50} instead
    assert_arguments_length(arguments, 2, 3, 'warn_source_arguments_length(arguments,device)');
    aCount = aCount || 3;
    if (aArguments.length > aCount) {
        hint_args('warn_source_arguments_length', aArguments);
        warn('Using more than ' + aCount + ' arguments in ' + (aDevice ? aDevice.type : '???') + '(name,anode,cathode,...) is error prone, use .chained().setters() or named arguments');
        echo_hints();
    }
}

globalThis.exports = {warn_source_arguments_length};
globalThis.warn_source_arguments_length = warn_source_arguments_length;
