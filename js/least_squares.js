// Use least squares to find slope and y-offset of x-y data
// linter: ngspicejs-lint --internal
"use strict";

function LeastSquares(x, y) {
    // Use least squares to find slope and y-offset of x-y data
    this.sumX = 0;
    this.sumY = 0;
    this.sumXY = 0;
    this.sumXSq = 0;
    this.size = 0;
    // calculate at once
    if (x && y) {
        assert_array_of_numbers(x, undefined, undefined, true);
        assert_array_of_numbers(y, undefined, undefined, true);
        this.add(x, y);
        return {
            slope: this.slope(),
            offset: this.offset()
        };
    }
}

function least_squares(x, y) {
    // Use least squares to find slope and y-offset of x-y data
    return new LeastSquares(x, y);
}

LeastSquares.prototype.clear = function () {
    // Clear temporary variables
    this.sumX = 0.0;
    this.sumY = 0.0;
    this.sumXY = 0.0;
    this.sumXSq = 0.0;
    this.size = 0;
};

LeastSquares.prototype.add = function (x, y) {
    // Add [x,y] point and update internal variables
    assert_arguments_length(arguments, 2, 2, 'least_squares.add(x, y)');
    if (Array.isArray(x) && Array.isArray(y)) {
        var i;
        for (i = 0; i < x.length; i++) {
            this.add(x[i], y[i]);
        }
        return;
    }
    assert_number(x, 'x', 'least_squares.add(x,y)');
    assert_number(y, 'y', 'least_squares.add(x,y)');
    this.sumX += x;
    this.sumY += y;
    this.sumXY += x * y;
    this.sumXSq += x * x;
    this.size++;
};

LeastSquares.prototype.slope = function () {
    // Calculate slope
    return ((this.sumXY - this.sumX * this.sumY / this.size)) / (this.sumXSq - this.sumX * this.sumX / this.size);
};

LeastSquares.prototype.offset = function () {
    // Calculate offset
    return this.sumY / this.size - this.slope(this) * this.sumX / this.size;
};

globalThis.exports = {least_squares};
globalThis.least_squares = least_squares;
