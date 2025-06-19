// Extending array prototype using all array functions
// linter: ngspicejs-lint --internal
"use strict";

Array.prototype.abs = function () {
    // Return absolute values of array
    assert_arguments_length(arguments, 0, 0, 'Array.abs()');
    return array_abs(this);
};

Array.prototype.add = function (aOtherArray) {
    // Add (as in sum) array to this array
    assert_arguments_length(arguments, 1, 1, 'Array.add(other_array)');
    assert_array(aOtherArray, 'other_array', 'Array.add(other_array)');
    if (typeof aOtherArray[0] === 'number') {
        assert_array_of_numbers(this, 'this', 'Array.add(other_array)', true);
        assert_array_of_numbers(aOtherArray, 'other_array', 'Array.add(other_array)', true);
    } else {
        assert_array_of_complex(this, 'this', 'Array.add(other_array)', true);
        assert_array_of_complex(aOtherArray, 'other_array', 'Array.add(other_array)', true);
    }
    return array_add(this, aOtherArray);
};

Array.prototype.addScalar = function (s) {
    // Add scalar to each item of this array and return it as new array
    assert_arguments_length(arguments, 1, 1, 'Array.addScalar(scalar)');
    return array_add_scalar(this, s);
};

Array.prototype.amplitude = function () {
    // Return half of difference between largest and smallest value in array
    assert_arguments_length(arguments, 0, 0, 'Array.amplitude()');
    return array_amplitude(this);
};

Array.prototype.argument = function () {
    // Return arguments (angles) of complex array
    assert_arguments_length(arguments, 0, 0, 'Array.argument()');
    assert_array_of_complex(this, 'this', 'Array.argument()', true);
    return array_argument(this);
};

Array.prototype.avg = function () {
    // Return average value of array
    assert_arguments_length(arguments, 0, 0, 'Array.avg()');
    return array_avg(this);
};

Array.prototype.clamp = function (aMin, aMax) {
    // Return values of array clamped into min-max range
    assert_arguments_length(arguments, 2, 2, 'Array.clamp(min,max)');
    aMin = eng(aMin, 1, 'Array.clamp(min,max)');
    aMax = eng(aMax, 2, 'Array.clamp(min,max)');
    return array_clamp(this, aMin, aMax);
};

Array.prototype.column = function (aColumnIndex, aStartingRow) {
    // Return one column of a row-oriented 2D array
    // fixme: assert_2d_array(this)
    assert_arguments_length(arguments, 1, 2, 'Array.column(column,starting_row)');
    if (!Array.isArray(this[0])) {
        throw new Exception('Array.column(index,starting_row) can only be called on 2D array');
    }
    assert_integer(aColumnIndex, 'column', 'Array.column(column,starting_row)', 0, this[0].length - 1);
    if (arguments.length > 1) {
        assert_integer(aStartingRow, 'starting_row', 'Array.column(column,starting_row)', 0, this.length - 1);
    }
    return array_column(this, aColumnIndex, aStartingRow || 0);
};

Array.prototype.complement = function (aOtherArray) {
    // Return items from this array not present in aOther array
    assert_arguments_length(arguments, 1, 1, 'Array.complement(other_array)');
    assert_array_of_numbers(this, 'this', 'Array.complement(other_array)', true);
    assert_array_of_numbers(aOtherArray, 'this', 'Array.complement(other_array)', true);
    return array_complement(this, aOtherArray);
};

Array.prototype.db = function () {
    // Return real or complex values converted to decibels
    assert_arguments_length(arguments, 0, 0, 'Array.db()');
    return array_db(this);
};

Array.prototype.deg = function () {
    // Return radians converted to degrees
    assert_arguments_length(arguments, 0, 0, 'Array.deg()');
    assert_array_of_numbers(this, 'this', 'Array.deg()', true);
    return this.map((a) => a * 180 / Math.PI);
};

Array.prototype.distribution = function (aCount, oMin, oMax) {
    // Print array to output, separate items by glue string (default is comma)
    assert_arguments_length(arguments, 1, 3, 'Array.distribution(count,min,max)');
    assert_integer(aCount, 'count', 'Array.distribution(count,min,max)');
    if (arguments.length > 1) {
        assert_arguments_length(arguments, 3, 3, 'Array.distribution(count,min,max)');
        assert_integer(oMin, 'min', 'Array.distribution(count,min,max)');
        assert_integer(oMax, 'max', 'Array.distribution(count,min,max)');
    }
    return array_distribution(this, aCount, oMin, oMax);
};

Array.prototype.echo = function (oGlue) {
    // Print array to output, separate items by glue string (default is comma)
    assert_arguments_length(arguments, 0, 1, 'Array.echo(glue)');
    if (typeof this[0] === 'object') {
        echo(this.map((o) => JSON.stringify(o)).join(oGlue || ','));
        return this;
    }
    echo(this.join(oGlue || ','));
    return this;
};

Array.prototype.extrema = function () {
    // Return array of local extrema in this array, returns array of {index, value, min, max}
    assert_arguments_length(arguments, 0, 0, 'Array.extrema()');
    return array_extrema(this);
};

Array.prototype.extremaMax = function () {
    // Return one max global extrema in this array, returns {index, value, min, max}
    assert_arguments_length(arguments, 0, 0, 'Array.extremaMax()');
    return array_extrema_max(this);
};

Array.prototype.extremaMin = function () {
    // Return one min global extrema in this array, returns {index, value, min, max}
    assert_arguments_length(arguments, 0, 0, 'Array.extremaMax()');
    return array_extrema_min(this);
};

Array.prototype.imag = function () {
    // Return only imaginary parts of complex array
    assert_arguments_length(arguments, 0, 0, 'Array.imag()');
    return array_imag(this);
};

Array.prototype.indices = function () {
    // Convert array ['foo',true,3.14] to [0,1,2], useful in chart_xy for data without x-axis
    assert_arguments_length(arguments, 0, 0, 'Array.indices()');
    return array_indices(this);
};

Array.prototype.max = function () {
    // Return maximal value of array
    assert_arguments_length(arguments, 0, 0, 'Array.max()');
    return array_max(this);
};

Array.prototype.min = function () {
    // Return minimal value of array
    assert_arguments_length(arguments, 0, 0, 'Array.min()');
    return array_min(this);
};

Array.prototype.modulus = function () {
    // Return modulus of complex array
    assert_arguments_length(arguments, 0, 0, 'Array.modulus()');
    return array_modulus(this);
};

Array.prototype.normalize = function (oMin, oMax) {
    // Return normalized array into given range, default is <0,1>
    assert_arguments_length(arguments, 0, 2, 'Array.normalize(min,max)');
    if (arguments.length === 0) {
        oMin = 0;
        oMax = 1;
    }
    if (arguments.length === 1) {
        oMax = oMin;
        oMin = 0;
        assert_number(oMax, 'max', 'Array.normalize(min,max)');
    }
    if (arguments.length === 2) {
        assert_number(oMin, 'min', 'Array.normalize(min,max)');
        assert_number(oMax, 'max', 'Array.normalize(min,max)');
    }
    return array_normalize(this, oMin, oMax);
};

Array.prototype.quantize = function (oCount) {
    // Quantize array values range into discreet values from 0 to aCount-1
    assert_arguments_length(arguments, 1, 1, 'Array.quantize(count)');
    if (oCount <= 1) {
        throw new Exception('Array.quantize(count) needs at least 2 quantization intervals');
    }
    return array_quantize(this, oCount);
};

Array.prototype.randomItem = function () {
    // Return random item of array
    assert_arguments_length(arguments, 0, 0, 'Array.randomItem()');
    return array_random_item(this);
};

Array.prototype.range = function () {
    // Return difference between largest and smallest value in array
    assert_arguments_length(arguments, 0, 0, 'Array.range()');
    return array_range(this);
};

Array.prototype.real = function () {
    // Return only real part of array of complex values
    assert_arguments_length(arguments, 0, 0, 'Array.real()');
    return array_real(this);
};

Array.prototype.rms = function () {
    // Return root mean square value of array of numbers
    assert_arguments_length(arguments, 0, 0, 'Array.rms()');
    return array_rms(this);
};

Array.prototype.runningAvg = function (aBlockSize) {
    // Return running average of an array
    assert_arguments_length(arguments, 1, 1, 'Array.runningAvg(block_size)');
    assert_integer(aBlockSize, 'block_size', 'Array.runningAvg(block_size)');
    return array_running_avg(this, aBlockSize);
};

Array.prototype.same = function (aOtherArray) {
    // Return true if arrays have the same values
    assert_arguments_length(arguments, 1, 1, 'Array.same(other_array)');
    assert_array_of_numbers(this, 'this', 'Array.assertValues(other_array)', true);
    assert_array_of_numbers(aOtherArray, 'other_array', 'Array.assertValues(other_array)', true);
    if (this.length !== aOtherArray.length) {
        return false;
    }
    var a = this, b = aOtherArray;
    for (var i = 0; i < a.length; i++) {
        var ta = typeof a[i];
        var tb = typeof b[i];
        if (ta !== tb) {
            return false;
        }
        if (ta === 'number') {
            if (a[i] !== b[i]) {
                return false;
            }
        } else {
            if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) {
                return false;
            }
        }
    }
    return true;
};

Array.prototype.scale = function (aConstant) {
    // Return new array multiplied by a constant
    assert_arguments_length(arguments, 1, 1, 'Array.scale(constant)');
    assert_number(aConstant, 'constant', 'Array.scale(constant)');
    return array_scale(this, aConstant);
};

Array.prototype.shuffle = function () {
    // Return randomized shallow copy of this array
    assert_arguments_length(arguments, 0, 0, 'Array.shuffle()');
    return array_shuffle(this);
};

Array.prototype.stats = function () {
    // Return all available array stats (min, max, avg, range, std)
    assert_arguments_length(arguments, 0, 0, 'Array.stats()');
    return array_stats(this);
};

Array.prototype.std = function () {
    // Return standard deviation of this array
    assert_arguments_length(arguments, 0, 0, 'Array.std()');
    return array_std(this);
};

Array.prototype.sub = function (aArray) {
    // Return copy of this array subtracted by another array
    assert_arguments_length(arguments, 1, 1, 'Array.sub(other_array)');
    return array_sub(this, aArray);
};

Array.prototype.sum = function () {
    // Return sum of this array
    assert_arguments_length(arguments, 0, 0, 'Array.sum()');
    return array_sum(this);
};

Array.prototype.union = function (aArray) {
    // Return union of this and other arrays, for [1,2,3,4] and [3,4,5,6] it returns [3,4]
    assert_arguments_length(arguments, 1, 1, 'Array.union()');
    return array_union(this, aArray);
};

Array.prototype.unique = function () {
    // Return new array with unique values in this array
    assert_arguments_length(arguments, 0, 0, 'Array.unique()');
    return array_unique(this);
};

Array.prototype.sortNumerically = function () {
    // Return new array sorted with numbers ascending
    assert_arguments_length(arguments, 0, 0, 'Array.sortNumerically()');
    return array_sort_numerically(this);
};

