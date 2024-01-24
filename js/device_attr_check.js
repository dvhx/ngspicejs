// Check if device have correct attributes
// linter: ngspicejs-lint --internal
"use strict";

function device_attr_check(aDevice, aAttr, aDefinitions) {
    // Check if device have correct attributes
    assert_arguments_length(arguments, 3, 3, 'device_attr_check(device,attr,definitions)');
    //echo_json(aDevice);
    var prefix, e = false, allowed = Object.keys(aDefinitions);
    var i;
    // check for known stuff
    for (const [key, def] of Object.entries(aDefinitions)) {
        //echo(key, def);
        prefix = (aDevice.type || 'device') + " " + (aDevice.attr.name || '<unnamed>') + " attribute '" + key + "' ";
        // unchecked
        if (def.type === 'unchecked') {
            continue;
        }
        // poly
        if (def.type === 'poly') {
            assert_poly(aAttr[key], 'poly', aDevice.type + '.validate', prefix);
            continue;
        }
        // check missing
        if (aAttr[key] === undefined && !def.required) {
            continue;
        }
        // undefined
        if (aAttr[key] === undefined && (def.undefined === true)) {
            continue;
        }
        // allowed: [...]
        if (def.allowed && !def.allowed.includes(aAttr[key])) {
            error(prefix + "is " + aAttr[key] + " but allowed values are only: " + def.allowed.join(', '));
            e = true;
            continue;
        }
        // check strings
        if (def.type === 'string') {
            if (typeof aAttr[key] !== def.type) {
                error(prefix + "should be " + def.type + " but is " + typeof aAttr[key]);
                e = true;
                continue;
            }
            // two underscores not allowed
            if (aAttr[key].match('__') && !def.allow_two_underscores) {
                error(prefix + "value '" + aAttr[key] + "' cannot contain two consecutive underscores, it may interfere with human readable vector names");
                e = true;
            }
            // alphanumeric
            if (def.alphanumeric && !aAttr[key].match(/^[a-zA-Z0-9_]+$/)) {
                error(prefix + "value '" + aAttr[key] + "' should only have characters a-zA-Z0-9_ but contains others");
                e = true;
            }
            // startalpha
            if (def.startalpha && !aAttr[key].match(/^[a-zA-Z]+/)) {
                error(prefix + "value '" + aAttr[key] + "' should start with letter, not number or underscore");
                e = true;
            }
            // min length
            if (def.min !== undefined && aAttr[key].length < def.min) {
                error(prefix + "should be at least " + def.min + " characters long but is " + aAttr[key].length);
                e = true;
                continue;
            }
            // max length
            if (def.max !== undefined && aAttr[key].length > def.max) {
                error(prefix + "should be at most " + def.max + " characters long but is " + aAttr[key].length);
                e = true;
                continue;
            }
            continue;
        }
        // check numbers
        if (def.type === 'number') {
            // equation
            /*
            if (globalThis.foo) {
            echo_json(def);
            echo_json(aAttr[key]);
            }
            */
            if (def.equation === true && typeof aAttr[key] === 'string') {
                if (is_equation(aAttr[key])) {
                    aAttr[key] = equation(aAttr[key]);
                    aAttr[key].check_params(aDevice);
                    //equations.push(aAttr[key]);
                    continue;
                }
            }
            if (def.equation === true && aAttr[key] instanceof Equation) {
                //echo('B');
                //echo('already compiled equation', aAttr[key]);
                //if (is_compiled_equation(aAttr[key])) {
                    //echo('B2');
                    //equations.push(aAttr[key]);
                    var eq = equation(aAttr[key]);
                    eq.check_params(aDevice);
                    //Equation.check_params(aDevice, aAttr[key]);
                    continue;
                //}
            }
            if (!def.equation && aAttr[key] instanceof Equation) {
                hint(key + ' in device ' + aDevice.type + ' cannot be equation, only simple number');
            }
           // if (aAttr[key] === undefined && )
            //echo('C', def.equation, typeof aAttr[key]);

            // convert string to eng number
            if (def.eng === true && typeof aAttr[key] === 'string') {
                aAttr[key] = eng(aAttr[key]);
            }
            // is equation when it shouldn't
            if (!def.equation && (aAttr[key] instanceof Equation)) {
                error(prefix + "should be " + def.type + " but is equation " + JSON.stringify(aAttr[key]) + " (" + typeof aAttr[key] + ')');
                e = true;
                continue;
            }

            /*
            OLD EQUATIONS
            if (!def.equation && (is_equation(aAttr[key]) || is_compiled_equation(aAttr[key]))) {
                error(prefix + "should be " + def.type + " but is equation " + JSON.stringify(aAttr[key]) + " (" + typeof aAttr[key] + ')');
                e = true;
                continue;
            }
            */
            // check type
            if (typeof aAttr[key] !== def.type) {
                error(prefix + "should be " + def.type + " but is '" + aAttr[key] + "' (" + typeof aAttr[key] + ')');
                e = true;
                continue;
            }
            // integer
            if (def.integer === true) {
                if (!Number.isInteger(aAttr[key])) {
                    error(prefix + "number " + aAttr[key] + " must be integer");
                    e = true;
                }
            }
            // check for non-allowed zero
            if (def.zero === false && aAttr[key] === 0) {
                error(prefix + "cannot be zero");
                e = true;
            }
            // check min value
            if (aAttr[key] === 0 && def.zero) {
                // if value is zero and zero is allowed, don't check for min/max because it is zero and zero is allowed
            } else {
                if (typeof def.min === 'number') {
                    if (aAttr[key] < def.min) {
                        error(prefix + "value " + aAttr[key] + " is lower than " + def.min);
                        e = true;
                    }
                }
                // check max value
                if (typeof def.max === 'number') {
                    if (aAttr[key] > def.max) {
                        error(prefix + "value " + aAttr[key] + " is larger than " + def.max);
                        e = true;
                    }
                }
            }
            continue;
        }
        // check nets
        if (def.type === 'net') {
            if (!is_net(aAttr[key])) {
                if (['time', 'frequency'].includes(aAttr[key])) {
                    error(prefix + 'is "' + aAttr[key] + '" - Certain words like "time" or "frequency" are not allowed as net names');
                    e = true;
                    continue;
                }
                if (!aAttr[key]) {
                    error(prefix + 'is missing');
                    e = true;
                    continue;
                }
                if (typeof aAttr[key] !== 'string') {
                    error(prefix + 'is not a string');
                    e = true;
                    continue;
                }
                if (aAttr[key].match(/^[0-9]+$/)) {
                    hint('You used string "' + aAttr[key] + '" with number as net name, just use number ' + aAttr[key] + ' instead (or use string like "vcc", "out", "net5")');
                    hint('The reason why this is not allowed is to avoid subtle confusions of having some net called "1" (string) and other called 1 (number)');
                    hint('Example: resistor("R1", 1, 2, "1k") - this is OK');
                    hint('Example: resistor("R1", "vcc", "c", "1k") - this is OK');
                    hint('Example: resistor("R1", "vcc", 2, "1k") - this is OK');
                    hint('Example: resistor("R1", "1", "2", "1k") - this is an error');
                }
                error(prefix + "value " + aAttr[key] + " is not valid net name, use either number (e.g. 5 not '5') or string (a-zA-Z0-9_)");
                e = true;
            }
            continue;
        }
        // array
        if (def.type === 'array') {
            if (!Array.isArray(aAttr[key])) {
                error(prefix + "value " + aAttr[key] + " should be array but is " + typeof aAttr[key] + ' (' + JSON.stringify(aAttr[key]) + ')');
                e = true;
                continue;
            }
            continue;
        }
        // array_of_nets
        if (def.type === 'array_of_nets') {
            //echo_json(aAttr[key]);
            if (!Array.isArray(aAttr[key])) {
                error(prefix + "value " + aAttr[key] + " should be array of nets but is " + typeof aAttr[key] + ' (' + JSON.stringify(aAttr[key]) + ')');
                e = true;
                continue;
            }
            for (i = 0; i < aAttr[key].length; i++) {
                if (!is_net(aAttr[key][i])) {
                    error(prefix + "value " + aAttr[key][i] + "[" + i + "] is not valid net name, use either number or string (a-zA-Z0-9_)");
                    e = true;
                }
            }
            continue;
        }
        // array_of_numbers
        if (def.type === 'array_of_numbers') {
            assert_array_of_numbers(aAttr[key], key, aDevice.type + '.' + key + '(' + key + ')', def.eng);
            continue;
        }
        // array_of_numbers
        if (def.type === 'array_of_complex') {
            assert_array_of_complex(aAttr[key], key, aDevice.type + '.' + key + '(' + key + ')', def.eng);
            continue;
        }
        // boolean
        if (def.type === 'boolean') {
            assert_boolean(aAttr[key], key, aDevice.type + '.' + key + '(' + key + ')');
            continue;
        }
        // array_of_eng
        if (def.type === 'array_of_eng') {
            //echo_json(aAttr[key]);
            if (!Array.isArray(aAttr[key])) {
                error(prefix + "value " + aAttr[key] + " should be array of eng numbers but is " + typeof aAttr[key] + ' (' + JSON.stringify(aAttr[key]) + ')');
                e = true;
                continue;
            }
            for (i = 0; i < aAttr[key].length; i++) {
                aAttr[key][i] = eng(aAttr[key][i]);
            }
            continue;
        }
        // object_of_eng {x: '1k', y: 100}
        if (def.type === 'object_of_eng') {
            if (Array.isArray(aAttr[key])) {
                error(prefix + "value " + aAttr[key] + " should be object of eng numbers but is array (" + JSON.stringify(aAttr[key]) + ')');
                e = true;
                continue;
            }
            for (const [k,v] of Object.entries(aAttr[key])) {
                aAttr[key][k] = eng(v);
            }
            continue;
        }
        // unknown type
        error(prefix + "expects type '" + def.type + "' which is not recognized type, supported types are: array, array_of_complex, array_of_eng, array_of_nets, array_of_numbers, boolean, net, number, object_of_eng, poly, string, unchecked");
        e = true;
    }
    // check for extra stuff
    for (const [key] of Object.entries(aAttr)) {
        prefix = aDevice.type + (aDevice.attr.name ? " " + aDevice.attr.name : '') + " device attribute '" + key + "' ";
        if (!Object.hasOwn(aDefinitions, key)) {
            var similar = similar_strings(key, allowed, 3, true).join(', ');
            if (!similar) {
                similar_strings(key, allowed, 10, true).join(', ');
            }
            if (!similar) {
                similar = '<none>';
            }
            //.join(', ') || '<none>';
            hint('Allowed ' + aDevice.type + ' attributes are: ' + Object.keys(aDefinitions).sort().join(', '));
            error(prefix + "is not recognized attribute, attributes with similar names are: " + similar);
            e = true;
        }
    }
    if (aDevice.expected_prefix) {
        //assert_expected_prefix(aDevice.attr.name, aDevice);
    }
    if (e) {
        throw new Exception((aDevice.type || "device") + " " + (aDevice.attr.name || "<unnamed>") + " contains invalid attribute");
    }
}

globalThis.exports = {device_attr_check};
//globalThis.device_attr_check = device_attr_check;
