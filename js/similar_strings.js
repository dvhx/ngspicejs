// Find similar strings from array of candidates
// linter: ngspicejs-lint --internal
"use strict";

function similar_strings(aText, aArray, aMaxDistance, aReturnStringsOnly) {
    // Find similar strings from array of candidates
    assert_arguments_length(arguments, 2, 4, 'similar_strings(text,candidates_array,max_distance,return_strings_only)');
    assert_string(aText, 'text', 'similar_strings(text,candidates_array,max_distance,return_strings_only)');
    assert_array_of_strings(aArray, 'candidates_array', 'similar_strings(text,candidates_array,max_distance,return_strings_only)');
    var i, r = [], d, maxd = aMaxDistance || Infinity;
    for (i = 0; i < aArray.length; i++) {
        d = levenshtein(aText, aArray[i]);
        if (d < maxd) {
            r.push({dist: d, text: aArray[i]});
        }
    }
    r = r.sort(function (a, b) {
        return a.dist - b.dist;
    });
    if (aReturnStringsOnly) {
        r = r.map((a) => a.text);
    }
    return r;
}

globalThis.exports = {levenshtein, similar_strings};
globalThis.levenshtein = levenshtein;
globalThis.similar_strings = similar_strings;
