// Return true if string looks like subcircuit equation
// linter: ngspicejs-lint --internal
"use strict";

function is_equation(s) {
    // Return true if string looks like subcircuit equation
    if (s instanceof Equation) {
        return true;
    }
    if (typeof s !== 'string') {
        return false;
    }
    return s.startsWith('{') && s.endsWith('}');
}

globalThis.is_equation = is_equation;
globalThis.exports = {is_equation};


