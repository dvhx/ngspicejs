// Functions for finding and loading models
// linter: ngspicejs-lint --internal
"use strict";

// Already loaded models
// jshint -W079
var model_cache = {};
// jshint +W079

function assert_kind_model(aObject, aKind, aModel, aFilename) {
    if (aObject.attr.name !== aModel) {
        throw new Exception('In file "' + aFilename + '" name was supposed to be ' + aModel + ' but file contains name ' + aObject.attr.name);
    }
    if (aObject.attr.kind !== aKind) {
        throw new Exception('In file "' + aFilename + '" kind was supposed to be ' + aKind + ' but file contains kind ' + aObject.attr.kind);
    }
}

// Functions that add model depending on kind and file extension
var constructors = {
    'PNP,json': function (aModel, aKind, aFn) {
        var o = bjt_model(file_read_json(aFn));
        assert_kind_model(o, aKind, aModel, aFn);
        return o;
    },
    'NPN,json': function (aModel, aKind, aFn) {
        var o = bjt_model(file_read_json(aFn));
        assert_kind_model(o, aKind, aModel, aFn);
        return o;
    },
    'DIODE,json': function (aModel, aKind, aFn) {
        var o = diode_model(file_read_json(aFn));
        assert_kind_model(o, aKind, aModel, aFn);
        return o;
    },
    'JFET_N,json': function (aModel, aKind, aFn) {
        var o = jfet_model(file_read_json(aFn));
        assert_kind_model(o, aKind, aModel, aFn);
        return o;
    },
    'JFET_P,json': function (aModel, aKind, aFn) {
        var o = jfet_model(file_read_json(aFn));
        assert_kind_model(o, aKind, aModel, aFn);
        return o;
    },
    'MOSFET_N,json': function (aModel, aKind, aFn) {
        var j = file_read_json(aFn), o;
        if (j.kind === 'VDMOS') {
            o = vdmos_model(j);
            assert_kind_model(o, j.kind, aModel, aFn);
            return o;
        }
        if (j.kind === 'NMOS') {
            o = mos_model(j);
            assert_kind_model(o, j.kind, aModel, aFn);
            return o;
        }
        throw new Exception('Loaded model ' + aModel + ' has unsupported kind ' + aKind + ', only VDMOS and NMOS are supported');
    },

    '*,ngjs': function (aModel, aKind, aFn) {
        include(aFn);
        var o = SubModel.models.find((a) => a.attr.name === aModel);
        if (!o) {
            hint("This error typically happens when you copy model file but then don't change the model name inside that file");
            throw new Exception(aKind + ' model "' + aModel + '" was not present after loading "' + aFn + '"');
        }
        return o;
    },
    '*,sub': function (aModel, aKind, aFn) {
        var code = file_read(aFn);
        var o = spice_model(aModel, aKind, code);
        // NETS 2
        var m = code.match(/\* NETS ([0-9]+)/);
        if (m) {
            o.declared_nets = parseInt(m[1], 10);
        }
        return o;
    }
};

function find_model(aDevice, aKind, aModel, oSkipConstructing) {
    // Find model, first in .sub_devices then in .parent_devices, the on disk in model directory
    assert_arguments_length(arguments, 3, 4, 'find_model(device, kind, model, <skip_constructing>)');
    if (aDevice) {
        assert_object(aDevice, 'device', 'find_model(device, kind, model, <skip_constructing>)');
    }
    if (aKind) {
        assert_string(aKind, 'kind', 'find_model(device, kind, model, <skip_constructing>)');
    }
    assert_string(aModel, 'model', 'find_model(device, kind, model, <skip_constructing>)');

    // return cached model
    if (model_cache[aModel]) {
        return model_cache[aModel];
    }
    var r;

    // sub_devices
    if (aDevice && aDevice.sub_devices) {
        r = aDevice.sub_devices.filter((a) => a.is_model && a.attr.name === aModel);
        if (r.length === 1) {
            model_cache[aModel] = r[0];
            return r[0];
        }
        if (r.length > 1) {
            echo_json(r.map((a) => a.type + ' ' + a.attr.name));
            throw new Exception('Multiple models "' + aModel + '" found');
        }
    }

    // parent_devices
    if (aDevice && aDevice.parent_devices) {
        r = aDevice.parent_devices.filter((a) => a.is_model && a.attr.name === aModel);
        if (r.length === 1) {
            model_cache[aModel] = r[0];
            return r[0];
        }
        if (r.length > 1) {
            echo_json(r.map((a) => a.type + ' ' + a.attr.name));
            throw new Exception('Multiple models "' + aModel + '" found');
        }
    }

    // netlist_devices
    if (aDevice && aDevice.netlist_devices) {
        r = aDevice.netlist_devices.filter((a) => a.is_model && a.attr.name === aModel);
        if (r.length === 1) {
            model_cache[aModel] = r[0];
            return r[0];
        }
        if (r.length > 1) {
            echo_json(r.map((a) => a.type + ' ' + a.attr.name));
            throw new Exception('Multiple models "' + aModel + '" found');
        }
    }

    // search on disk
    var k,
        e,
        fn,
        attempts = [],
        c,
        ext = ['json', 'sub', 'ngjs'],
        path = file_path(script_shell_full()) + '/',
        kind = aKind ? [aKind] : ['DIODE', 'JFET_N', 'MOSFET_N', 'MOSFET_P', 'NPN', 'OPAMP', 'OTHER', 'PNP', 'TIMER', 'VREF'];
    for (e = 0; e < ext.length; e++) {
        for (k = 0; k < kind.length; k++) {
            fn = path + 'model/' + kind[k] + '/' + aModel + '.' + ext[e];
            attempts.push(fn);
            if (ext[e] === 'sub' || ext[e] === 'ngjs') {
                c = '*,' + ext[e];
            } else {
                c = kind[k] + ',' + ext[e];
            }
            if (file_exists(fn)) {
                if (!constructors[c]) {
                    throw new Exception('No such model constructor for combination: ' + c);
                }
                // in assert model we don't want to insert model just checking if it exists
                if (oSkipConstructing) {
                    return true;
                }
                r = constructors[c](aModel, kind[k], fn);
                model_cache[aModel] = r;
                return r;
            }
        }
    }

    // search in other dirs?
    var other = [];
    kind = ['DIODE', 'JFET_N', 'MOSFET_N', 'MOSFET_P', 'NPN', 'OPAMP', 'OTHER', 'PNP', 'TIMER', 'VREF'];
    for (e = 0; e < ext.length; e++) {
        for (k = 0; k < kind.length; k++) {
            fn = path + 'model/' + kind[k] + '/' + aModel + '.' + ext[e];
            if (file_exists(fn)) {
                other.push(fn);
            }
        }
    }
    if (other.length > 0) {
        hint('However model was found in other directory: ' + other.join(', '));
    }
    hint('Unlike spice, models needs to be defined before they are used!');

    var home = env('HOME');
    function replace_home(fn) {
        // Remove preceeding /home/user to make unit tests work on all computers
        if (fn.startsWith(home)) {
            return '~' + fn.substr(home.length);
        }
        return fn;
    }

    hint('Attempted files:\n  ' + attempts.map(replace_home).join('\n  ') + '\n');
    var sim = similar_strings(aModel, all_models(aKind), 8, true);
    if (sim.length > 0) {
        hint('Similar ' + aKind + ' models: ' + sim);
    }
    hint('All ' + aKind + ' models: ' + all_models(aKind));
    throw new Exception('Model ' + aModel + (aKind ? ' of kind ' + aKind : '') + ' not found!');
}

function require_model(aKind, aModel) {
    // This is only for spice_model or other special cases
    assert_arguments_length(arguments, 2, 2, 'require_model(kind, model)');
    assert_string(aKind, 'kind', 'require_model(kind, model)');
    assert_enum(aKind, ['DIODE', 'JFET_N', 'MOSFET_N', 'MOSFET_P', 'NPN', 'OPAMP', 'OTHER', 'PNP', 'TIMER', 'VREF'], 'kind', 'require_model(kind, model)');
    assert_string(aModel, 'model', 'require_model(kind,model)');
    find_model(null, aKind, aModel);
}

function find_model_clear_cache () {
    // Clear cache of found models
    assert_arguments_length(arguments, 0, 0, 'find_model_clear_cache()');
    model_cache = {};
}

globalThis.exports = {find_model,require_model,model_cache,find_model_clear_cache};
Internal.find_model = find_model;
Internal.require_model = require_model;
