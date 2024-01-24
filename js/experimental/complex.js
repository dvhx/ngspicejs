// Complex numbers (variant 1, chainable, with .real .imaginary)
// linter: ngspicejs-lint --internal
// provide: Complex, complex
"use strict";

function Complex(aReal, aImaginary) {
    // Constructor
    this.real = aReal || 0;
    this.imaginary = aImaginary || 0;
}

function complex(aReal, aImaginary) {
    // Return new complex number
    return new Complex(aReal, aImaginary);
}

Complex.prototype.toPolar = function () {
    // Return complex number in polar coordinates as string
    return '|' + this.modulus().toPrecision(3) + '|∠' + this.argument().toPrecision(1) + '°';
};

Complex.prototype.toString = function (aPolar) {
    // Convert to string
    if (aPolar) {
        return this.toPolar();
    }
    return this.real.toPrecision(3) + (this.imaginary >= 0 ? '+' : '-') + Math.abs(this.imaginary).toPrecision(3) + 'i';
};

Complex.prototype.dup = function () {
    // Return copy of this number
    return new Complex(this.real, this.imaginary);
};

Complex.prototype.add = function (aComplex) {
    // Return sum of this and another complex number
    Internal.assert_object(aComplex);
    return new Complex(this.real + aComplex.real, this.imaginary + aComplex.imaginary);
};

Complex.prototype.sub = function (aComplex) {
    // Return this minus other complex number
    Internal.assert_object(aComplex);
    return new Complex(this.real - aComplex.real, this.imaginary - aComplex.imaginary);
};

Complex.prototype.mul = function (aComplex) {
    // Return this multiplied by other complex number
    Internal.assert_object(aComplex);
    var a = this.real,
        b = this.imaginary,
        c = aComplex.real,
        d = aComplex.imaginary;
    return new Complex(a * c - b * d, a * d + b * c);
};

Complex.prototype.div = function (aDenominator) {
    // Return this divided by other complex number
    Internal.assert_object(aDenominator);
    var a = this.real,
        b = this.imaginary,
        c = aDenominator.real,
        d = aDenominator.imaginary,
        r = (a * c + b * d) / (c * c + d * d),
        i = (b * c - a * d) / (c * c + d * d);
    return new Complex(r, i);
};

Complex.prototype.modulus = function () {
    // Return modulus (length) of this complex number
    return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
};

Complex.prototype.argument = function () {
    // Return argument (angle) of this complex number
    return 180 * Math.atan2(this.imaginary, this.real) / Math.PI;
};

Complex.prototype.reciprocal = function () {
    // Return 1/this complex number
    var m = this.modulus();
    m *= m;
    return new Complex(this.real / m, -this.imaginary / m);
};

globalThis.exports = {Complex,complex};
Internal.Complex = Complex;
globalThis.complex = complex;

