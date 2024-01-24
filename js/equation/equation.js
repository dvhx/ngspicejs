// Equations used in subcircuits, e.g. '{r * (100 - percent) / 100}'
// linter: ngspicejs-lint --internal
"use strict";

function Equation(aFormula) {
    // Constructor
    assert_arguments_length(arguments, 1, 1, 'equation(formula)');
    if (aFormula instanceof Equation) {
        aFormula = aFormula.equation.code;
    }
    if (typeof aFormula === 'object') {
        echo_json(aFormula);
        throw new Exception('Equation formula is object but not instance of Equation');
    }
    assert_string(aFormula, 'formula', 'equation(formula)');
    // warn about spice M/MEG suffixes
    var m = aFormula.match(/[0-9]+[Mm]{1}/g);
    if (m) {
        hint("Use exponent notation, e.g. 1.5e-3 for milli or 4.7e6 for mega");
        throw new Exception('Using m/M engineering suffix ' + m[0] + ' in formula ' + aFormula + ' is not supported as the spice uses M/MEG not m/M');
    }
    // no compilation for now
    this.equation = {
        code: aFormula, // later change code to jsev formula?
        identifiers: array_unique(aFormula.split(/\b/).filter((a) => a.match(/[a-z]+/))),
        ast: {}
    };
}

function equation(aFormula) {
    // Create new equation
    assert_arguments_length(arguments, 1, 1, 'equation(aFormula)');
    return new Equation(aFormula);
}

Equation.prototype.validate = function () {
    // Validate equation (not implemented)
    assert_arguments_length(arguments, 0, 0, 'equation.validate()');
    assert_string(this.equation.code, 'equation.code', 'equation.validate()');
    // here would be a good place to use JSEP to check for missing parameters etc...
};

Equation.prototype.toString = function () {
    // Convert equation to string
    assert_arguments_length(arguments, 0, 0, 'equation.toString()');
    this.validate();
    return this.equation.code;
};

Equation.prototype.toStringInside = function () {
    // Convert equation to string (without enclosing curly brackets)
    assert_arguments_length(arguments, 0, 0, 'equation.toStringInside()');
    this.validate();
    var s = this.equation.code;
    return s.substr(1, s.length - 2);
};

Equation.prototype.check_params = function (aDevice) {
    // In sub_model make sure equation only uses parameters defined in that sub_model, used in device_attr_check
    assert_arguments_length(arguments, 1, 1, 'equation.check_params(device)');
    if (aDevice.sub_model) {
        this.equation.identifiers.forEach((id) => {
            if (!Object.hasOwn(aDevice.sub_model.attr.params, id)) {
                throw new Exception(aDevice.type + ' ' + (aDevice.attr.name || 'device') + ' uses "' + id + '" in equation "' + this + '" but parent sub_model ' + aDevice.sub_model.attr.name + ' does not have this param only: ' + Object.keys(aDevice.sub_model.attr.params).sort().join(', '));
            }
        });
    }
};

Internal.Equation = Equation;
Internal.equation = equation;
globalThis.exports = {Equation, equation};
globalThis.equation = equation;
