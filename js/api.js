// Print list of available functions or descibe object's API
// linter: ngspicejs-lint --internal
"use strict";

function api_one(aFunctionOrInstance, oName) {
    // Return arguments of function or it's constructor's argument
    if (aFunctionOrInstance === 'globalThis') {
        oName = 'globalThis';
        aFunctionOrInstance = globalThis;
    }
    if (typeof aFunctionOrInstance === 'string' && Object.hasOwn(globalThis, aFunctionOrInstance)) {
        oName = aFunctionOrInstance;
        aFunctionOrInstance = globalThis[aFunctionOrInstance];
    }
    if (typeof aFunctionOrInstance === 'string' && Object.hasOwn(Internal, aFunctionOrInstance)) {
        oName = aFunctionOrInstance;
        aFunctionOrInstance = Internal[aFunctionOrInstance];
    }
    if (aFunctionOrInstance === globalThis) {
        oName = 'globalThis';
    }
    if (aFunctionOrInstance === Internal) {
        oName = 'Internal';
    }
    // find name of native function
    if (typeof aFunctionOrInstance === 'function' && aFunctionOrInstance.toString().indexOf('[native code]') && !oName) {
        oName = Object.keys(globalThis).find((k) => globalThis[k] === aFunctionOrInstance);
        if (!oName) {
            oName = Object.keys(Internal).find((k) => Internal[k] === aFunctionOrInstance);
        }
        if (!oName) {
            oName = '<anonymous>';
        }
    }
    var type = Array.isArray(aFunctionOrInstance) ? 'array' : typeof aFunctionOrInstance;
    // native function
    var d = Internal.native_functions_description[oName];
    if (d) {
        d.subject = aFunctionOrInstance;
        d.type = type;
        d.name = oName;
        if (type === 'object') {
            d.args = Object.keys(aFunctionOrInstance).length + ' properties';
        }
        return d;
    }
    // find function
    var fun = aFunctionOrInstance;
    if (typeof aFunctionOrInstance === 'object') {
        // object whose prototype is function
        if (typeof aFunctionOrInstance.prototype === 'function') {
            fun = aFunctionOrInstance.prototype;
        } else if (typeof aFunctionOrInstance.constructor === 'function') {
            // object whose constructor is function
            type = 'function';
            fun = aFunctionOrInstance.constructor;
            oName = oName || aFunctionOrInstance.constructor.name;
        }
    }
    // get first line of code
    if (!fun) {
        return {};
    }
    var code = fun.toString().split('\n');
    var args;
    var summary = (code[1] || '').trim();
    if (summary.startsWith('//')) {
        summary = summary.replace('// ', '');
    } else {
        summary = 'FIXME: missing function comment';
    }
    // function
    if (code[0].indexOf('()') > 0) {
        args = [];
        return {subject: aFunctionOrInstance, type, name: oName, args, summary};
    }
    var a = code[0].match(/\(([a-zA-Z0-9_,\u0020]+)\)/);
    if (a) {
        args = a[1].split(', ');
        return {subject: aFunctionOrInstance, type, name: oName, args, summary};
    }
    throw new Exception('Cannot find arguments description of ' + typeof aFunctionOrInstance + ' ' + oName || '');
}

function api_props(aObject, aKeys, aFunctions) {
    // Print all properies of given object
    var longest = Math.max.apply({}, aKeys.map((a) => a.toString().length)) + 2;
    // less brittle unit tests
    if (longest < 30) {
        longest = 30;
    }
    var spacer = new Array(longest).fill(' ').join('');
    var args_length = 36;
    var args_spacer = new Array(args_length).fill(' ').join('');
    var one;
    var i;
    var args = '';
    for (i = 0; i < aKeys.length; i++) {
        one = api_one(aObject[aKeys[i]], aKeys[i]);
        if (aFunctions) {
            args = '(' + one.args.join(',') + ')';
            if (args.length < args_length) {
                args = (args + args_spacer).substr(0, args_length);
            }
        }
        echo(
            (spacer + one.name).substr(-longest),
            args,
            one.summary
        );
    }
}

function api(aSomething, aName, aQuiet) {
    // Print list of available functions or descibe object's API
    assert_arguments_length(arguments, 0, 3, 'api(something,<name>,<quiet>)');
    if (aSomething === undefined) {
        aSomething = globalThis;
    }
    // skip special objects
    if ([Internal, netlist_devices, font_neo_sans, distinct_colors].includes(aSomething)) {
        if (aSomething === Internal) {
            aName = 'Internal';
        }
        if (aSomething === netlist_devices) {
            aName = 'netlist_devices';
        }
        if (aSomething === font_neo_sans) {
            aName = 'font_neo_sans';
        }
        if (aSomething === distinct_colors) {
            aName = 'distinct_colors';
        }
        if (!aQuiet) {
            echo(aName, '-', Internal.native_functions_description[aName].summary);
        }
        return {
            "type": "object",
            "name": aName,
            "summary": Internal.native_functions_description[aName].summary
        };
    }
    var ts = Array.isArray(aSomething) ? 'array' : typeof aSomething;
    var one = api_one(aSomething, aName);
    if (one.type === 'function') {
        if (!aQuiet) {
            echo('API: ' + one.type + ' ' + one.name + ' (' + one.args.join(', ') + ') - ' + one.summary);
        }
        // also document methods if aSomething has them
        if (aSomething !== globalThis && typeof aSomething !== 'string') {
            var props = Object.getOwnPropertyNames(Object.getPrototypeOf(aSomething));
            var methods = props.filter((n) => (n !== 'constructor') && (n !== 'arguments') && (n !== 'caller') && (n !== 'apply') && (n !== 'bind') && (n !== 'call') && (n !== 'toString') && (typeof aSomething[n] === 'function'));
            if (methods.length > 0) {
                echo();
                echo(methods.length + ' methods:');
                methods.forEach((n) => {
                    var o = api(aSomething[n], n, true);
                    echo('.' + n + '(' + o.args + ') - ' + o.summary);
                });
            }
        }
        return one;
    }
    if (one.type === 'object') {
        if (!aQuiet) {
            echo('API: ' + one.type + ' ' + one.name + ' (' + one.args + ') - ' + one.summary);
            var a = Object.keys(one.subject).filter((k) => typeof one.subject[k] === 'function').sort();
            echo('FUNCTIONS (' + a.length + '):');
            api_props(one.subject, a, true);
            a = Object.keys(one.subject).filter((k) => typeof one.subject[k] !== 'function').sort();
            echo('PROPERTIES (' + a.length + '):');
            api_props(one.subject, a);
        }
        return one;
    }
    if (one) {
        if (!aQuiet) {
            echo('API: ' + one.type + ' ' + one.name + ' (' + (one.args ? one.args.join(', ') : '') + ') - ' + one.summary);
        }
        return one;
    }
    error('API: unknown ' + ts + ' = ' + aSomething.toString());
    return;
}

globalThis.api = api;
globalThis.exports = {api};

