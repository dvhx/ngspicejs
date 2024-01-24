// Convert "4k7" to 4700 or throw new Exception(...)
// linter: ngspicejs-lint --internal
"use strict";

function eng(aNumberOrString, aArgumentIndex, aFunctionName, aCustomMessage, aAttrDef) {
    // Convert "4k7" to 4700 or throw new Exception(...)
    assert_arguments_length(arguments, 1, 5, 'eng(number_or_string,<argument_index,function_name,custom_message,attr_def>)');
    if (aAttrDef && aAttrDef.undefined === true && aNumberOrString === undefined) {
        return undefined;
    }
    /*
    if (is_equation(aNumberOrString)) {
        return equation(aNumberOrString);
    }
    if (is_compiled_equation(aNumberOrString)) {
        return aNumberOrString;
    }
    */
    /*
    if (is_equation(aNumberOrString)) {
        return equation(aNumberOrString);
    }
    if (is_compiled_equation(aNumberOrString)) {
        return aNumberOrString;
    }
    */
    if (aNumberOrString instanceof Equation) {
        return aNumberOrString;
    }
    if (aArgumentIndex === 1 && aFunctionName !== undefined && aCustomMessage === undefined) {
        aCustomMessage = aFunctionName + " argument should be number (e.g. 4700 or 4k7) but instead is " + aNumberOrString;
    }
    if (typeof aNumberOrString === 'number') {
        return aNumberOrString;
    }
    if (typeof aNumberOrString === 'string') {
        if (is_equation(aNumberOrString)) {
            return equation(aNumberOrString);
        }
        try {
            var z = aNumberOrString.fromEng(aCustomMessage);
            return z;
        } catch(e) {
            throw new Exception(aCustomMessage || e.toString());
        }
    }
    if (aCustomMessage) {
        throw new Exception(aCustomMessage);
    }
    if (aArgumentIndex === 1 && aFunctionName !== undefined) {
        throw new Exception(aCustomMessage);
    }
    if (aArgumentIndex !== undefined && aFunctionName !== undefined) {
        throw new Exception("Argument #" + aArgumentIndex + " of function " + aFunctionName + " expected either number (4700) or engineering number (4k7) but got " + aNumberOrString);
    }
    throw new Exception("Expected either number (4700) or engineering number (4k7) but got " + aNumberOrString);
}

globalThis.exports = {eng};
globalThis.eng = eng;
