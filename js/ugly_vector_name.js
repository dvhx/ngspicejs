// Convert "I(MIC1.LS)" to "l.x_dynamic_mic__mic1.l_ls#branch"
// linter: ngspicejs-lint --internal
"use strict";

function ugly_vector_name(aVector, aHideWarning) {
    // Convert "I(MIC1.LS)" to "l.x_dynamic_mic__mic1.l_ls#branch"
    assert_arguments_length(arguments, 1, 2, 'ugly_vector_name(nice_vector,hide_warning)');
    assert_string(aVector, 'nice_vector', 'ugly_vector_name(nice_vector,hide_warning)');
    var ugly = ngspice_vectors();
    var i;
    for (i = 0; i < ugly.length; i++) {
        if (human_vector_name(ugly[i]) === aVector) {
            return ugly[i];
        }
    }
    if (!aHideWarning) {
        warn('Could not find ugly vector name for vector "' + aVector + '", available ugly names are: ' + ugly.join(' '));
    }
    return aVector;
}

globalThis.ugly_vector_name = ugly_vector_name;
globalThis.exports = {ugly_vector_name};

