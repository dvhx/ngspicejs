// Return true if argument is compiled equation
// linter: ngspicejs-lint --internal
"use strict";

function is_compiled_equation(o) {
    // Return true if argument is compiled equation
    if (typeof o === 'object' && !(o instanceof Equation)) {
        //echo_json(o);
        //throw new Exception('Tested equation is object but not Equation');
        return false;
    }
    if (typeof o === 'object' && typeof o.equation === 'string' && typeof o.ast === 'object') {
        return true;
    }
    return false;
}

globalThis.is_compiled_equation = is_compiled_equation;
globalThis.exports = {is_compiled_equation};


