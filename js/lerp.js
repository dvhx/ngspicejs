// Multi-segment linear interpolation
// linter: ngspicejs-lint --internal
// globals: document, window
// provide: lerp
"use strict";

function Lerp(aValues, aValues2) {
    // Constructor
    // two separate arrays
    if (arguments.length === 2) {
        assert_array_same_length(aValues, aValues2, 'lerp(x_values, y_values)');
        assert_array_of_numbers(aValues, 'x_values', 'lerp(x_values, y_values)', true);
        assert_array_of_numbers(aValues2, 'y_values', 'lerp(x_values, y_values)', true);
        this.values = [];
        for (var i = 0; i < aValues.length; i++) {
            this.values.push([aValues[i], aValues2[i]]);
        }
        Lerp.validate(this.values);
        return;
    }
    // another lerp
    if (aValues instanceof Lerp) {
        if (aValues.values.length > 0) {
            this.values = JSON.parse(JSON.stringify(aValues.values));
        } else {
            this.values = [];
        }
        return;
    }
    // values are string: 0=1 0.9=0.5 1=1
    if (typeof aValues === 'string') {
        this.values = lerp().fromString(aValues).values;
        return;
    }
    // one complex array
    if (aValues) {
        assert_array_of_complex(aValues, 'xy_values', 'lerp(xy_values)', true);
        this.values = JSON.parse(JSON.stringify(aValues));
        Lerp.validate(this.values);
        return;
    }
    this.values = [];
}

function lerp(aValues, aValues2) {
    // Return lerp from values
    if (arguments.length === 2) {
        return new Lerp(aValues, aValues2);
    }
    return new Lerp(aValues);
}

Lerp.prototype.dup = function () {
    // Return independent duplicate
    assert_arguments_length(arguments, 0, 0, 'Lerp.dup()');
    return new Lerp(this);
};

Lerp.validate = function (aValues) {
    // Validate lerp aValues, throw exception on error
    assert_arguments_length(arguments, 1, 1, 'Lerp.validate(values)');
    var i;
    if (!Array.isArray(aValues)) {
        throw new Exception('Lerp values must be array');
    }
    if (aValues.length <= 0) {
        throw new Exception('Lerp values is empty array');
    }
    var oldx = aValues && aValues[i] && aValues[i][0];
    for (i = 0; i < aValues.length; i++) {
        if (!Array.isArray(aValues[i])) {
            throw new Exception('Lerp item #' + i + ' is not an array');
        }
        if (aValues[i].length !== 2) {
            throw new Exception('Lerp item #' + i + ' is not 2D array but [' + aValues[i].join(', ') + ']');
        }
        if (Number.isNaN(aValues[i][0]) || Number.isNaN(aValues[i][1])) {
            throw new Exception('Lerp item #' + i + ' has NaN in [' + aValues[i].join(', ') + ']');
        }
        if (aValues[i][0] < oldx) {
            throw new Exception('Lerp x-values must be increasing, but values[' + i + '][0] went from ' + oldx + ' to ' + aValues[i][0]);
        }
        oldx = aValues[i][0];
    }
};

Lerp.prototype.add = function (aX, aY) {
    // Return new independent lerp with one added point
    assert_arguments_length(arguments, 2, 2, 'Lerp.add(x,y)');
    var i, n = this.dup();
    for (i = 0; i < n.values.length; i++) {
        if (n.values[i][0] > aX) {
            n.values.splice(i, 0, [aX, aY]);
            return n;
        }
    }
    n.values.push([aX, aY]);
    return n;
};

Lerp.prototype.fromString = function (aLerp) {
    // Return new lerp from readable string (0=0 0.5=0.2 1=0.4)
    assert_arguments_length(arguments, 1, 1, 'Lerp.fromString(lerp)');
    var points = aLerp.trim().split(' '), xy, i, ret = [];
    if (aLerp.trim().charAt(0) === '[') {
        return lerp(JSON.parse(aLerp));
    }
    for (i = 0; i < points.length; i++) {
        xy = points[i].trim().split('=');
        if (xy.length !== 2) {
            throw new Exception('LERP point #' + (i + 1) + ' point needs 2 items but has ' + xy.length);
        }
        ret.push([parseFloat(xy[0].trim()), parseFloat(xy[1].trim())]);
    }
    ret = ret.sort(function (a, b) {
        return a[0] - b[0];
    });
    return lerp(ret);
};

Lerp.prototype.toString = function () {
    // Return lerp as readable string (0=1 0.5=0.2 1=0.4)
    var i, a = [], x, s, y, aLerp = this.values;
    for (i = 0; i < aLerp.length; i++) {
        x = aLerp[i][0].toString();
        s = aLerp[i][0].toFixed(6);
        if (s.length < x.length) {
            x = s;
        }
        y = aLerp[i][1].toString();
        s = aLerp[i][1].toFixed(6);
        if (s.length < y.length) {
            y = s;
        }
        a.push(x + '=' + y);
    }
    return a.join(' ');
};

Lerp.prototype.get = function (aValue) {
    // Return linear interpolation for given value
    var i, x1, y1, x2, y2, aShape = this.values;
    if (aValue < aShape[0][0]) {
        return aShape[0][1];
    }
    for (i = 0; i < aShape.length - 1; i++) {
        if (aValue >= aShape[i][0] && aValue < aShape[i + 1][0]) {
            x1 = aShape[i][0];
            y1 = aShape[i][1];
            x2 = aShape[i + 1][0];
            y2 = aShape[i + 1][1];
            return ((aValue - x1) / (x2 - x1)) * (y2 - y1) + y1;
        }
    }
    return aShape.slice(-1)[0][1]; // slice is shallow, no problem because returning number
};

Lerp.prototype.inverse = function () {
    // Find inverse value for lerp, works only for monotonous lerps
    var i, transpose = [];
    for (i = 0; i < this.values.length; i++) {
        transpose.push([this.values[i][1], this.values[i][0]]);
    }
    return new Lerp(transpose);
};

Lerp.prototype.bounding_box = function () {
    // Find min/max of lerp x,y
    var i,
        aLerp = this.values,
        o = {
            min_x: Number.MAX_VALUE,
            min_y: Number.MAX_VALUE,
            max_x: -Number.MAX_VALUE,
            max_y: -Number.MAX_VALUE
        };
    for (i = 0; i < aLerp.length; i++) {
        o.min_x = Math.min(o.min_x, aLerp[i][0]);
        o.min_y = Math.min(o.min_y, aLerp[i][1]);
        o.max_x = Math.max(o.max_x, aLerp[i][0]);
        o.max_y = Math.max(o.max_y, aLerp[i][1]);
    }
    return o;
};

globalThis.exports = {Lerp,lerp};
Internal.Lerp = Lerp;
globalThis.lerp = lerp;
