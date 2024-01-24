// Return array af all available model names of given kind, or all models if kind is not specified
// linter: ngspicejs-lint --internal
"use strict";

function all_models(oKind) {
    // Return array af all available model names of given kind, or all models if kind is not specified
    assert_arguments_length(arguments, 0, 1, 'all_models(<kind>)');
    if (arguments.length === 1) {
        assert_string(oKind, 'kind', 'all_models(<kind>)');
    }
    var all = {};
    var path = file_path(script_shell_full()) + '/';
    (oKind ? [path + 'model/' + oKind] : dir(path + 'model')).forEach((k) => {
        dir(k).forEach((m) => {
            var ext = file_ext(m);
            if (['.json', '.ngjs', '.sub'].includes(ext)) {
                all[file_ext_replace(file_name(m), '')] = 1;
            } else {
                warn('Non-standard extension "' + ext + '" in file ' + m);
            }
        });
    });
    if (!oKind || oKind === 'DIODE') {
        DiodeModel.models.forEach((m) => {
            all[m.attr.name] = 1;
        });
    }
    if (!oKind || oKind === 'RESISTOR') {
        ResistorModel.models.forEach((m) => {
            all[m.attr.name] = 1;
        });
    }
    if (!oKind || oKind === 'NPN') {
        BjtModel.models.filter((a) => a.kind === 'NPN').forEach((m) => {
            all[m.attr.name] = 1;
        });
    }
    if (!oKind || oKind === 'PNP') {
        BjtModel.models.filter((a) => a.kind === 'PNP').forEach((m) => {
            all[m.attr.name] = 1;
        });
    }
    if (!oKind || oKind === 'JFET_N') {
        JfetModel.models.filter((a) => a.kind === 'JFET_N').forEach((m) => {
            all[m.attr.name] = 1;
        });
    }
    if (!oKind || oKind === 'JFET_P') {
        JfetModel.models.filter((a) => a.kind === 'JFET_P').forEach((m) => {
            all[m.attr.name] = 1;
        });
    }
    if (!oKind || oKind === 'JFET_P') {
        JfetModel.models.filter((a) => a.kind === 'JFET_P').forEach((m) => {
            all[m.attr.name] = 1;
        });
    }
    if (!oKind || oKind === 'MOSFET_N' || oKind === 'MOSFET_P') {
        VdmosModel.models.forEach((m) => {
            all[m.attr.name] = 1;
        });
    }
    if (!oKind || oKind === 'MOSFET_N' || oKind === 'MOSFET_P') {
        MosModel.models.forEach((m) => {
            all[m.attr.name] = 1;
        });
    }
    SpiceModel.models.forEach((m) => {
        all[m.attr.name] = 1;
    });
    SubModel.models.forEach((m) => {
        all[m.attr.name] = 1;
    });
    return Object.keys(all).sort();
}

globalThis.exports = {all_models};
globalThis.all_models = all_models;
