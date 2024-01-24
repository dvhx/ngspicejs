// Split data into equal brackets and return counts in those brackets
// linter: ngspicejs-lint --internal
"use strict";

function array_distribution(aArray, aCount, aMin, aMax) {
    // Split data into equal brackets and return counts in those brackets
    assert_arguments_length(arguments, 2, 4, 'array_distribution(array,count,min,max)');
    assert_array(aArray, 'data', 'array_distribution(data,count,min,max)');
    assert_integer(aCount, 'count', 'array_distribution(data,count,min,max)');
    var min = array_min(aArray);
    var max = array_max(aArray);
    if (aMin !== undefined) {
        min = aMin;
    }
    if (aMax !== undefined) {
        max = aMax;
    }
    var q = aArray.filter((v) => v >= min && v <= max).quantize(aCount);
    var brackets = [];
    var ranges = [];
    var counts = (new Array(aCount)).fill(0);
    var index;
    var i;
    for (i = 0; i < aCount; i++) {
        brackets.push(i);
        ranges.push({
            min: min + i * (max - min) / (aCount - 0),
            max: min + (i + 1) * (max - min) / (aCount - 0)
        });
    }
    for (i = 0; i < q.length; i++) {
        index = q[i];
        brackets[index] = index;
        counts[index] = counts[index] || 0;
        counts[index]++;
    }
    return {
        min,
        max,
        brackets,
        counts,
        ranges,
        outside: aArray.length - q.length
    };
}

globalThis.array_distribution = array_distribution;
globalThis.exports = {array_distribution};
