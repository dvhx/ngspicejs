// Combine two equations or numbers using binary operator into new equation
// linter: ngspicejs-lint --internal
"use strict";

function equation_combine() {
    // Combine two equations or numbers using binary operator into new equation
    var fn = 'equation_combine(eq1,operand1,eq2,...)';
    var sa = Array.from(arguments).join(',');
    assert_arguments_length(arguments, 3, Infinity, fn);
    if (arguments.length % 2 !== 1) {
        hint_args(fn, arguments);
        throw new Exception(fn + ' expects odd number of arguments');
    }
    // operands must be strings
    var ret = [];
    Array.from(arguments).forEach((a,i) => {
        var x = a instanceof Equation ? a.toStringInside() : a;
        if (i % 2 === 1) {
            // odd: operand
            assert_string(a, 'arg #' + (i + 1), fn, 'argument #' + (i + 1) + ' must be string, got ' + sa);
            assert_enum(a, ['+', '-', '*', '/', '(', ')'], 'arg #' + (i + 1), fn + ' with arguments (' + sa + ')');
            ret.push(x);
        } else {
            // odd: number or equation
            ret.push('(' + x + ')');
        }
    });
    return new Equation('{' + ret.join('') + '}');
}

globalThis.equation_combine = equation_combine;
globalThis.exports = {equation_combine};


