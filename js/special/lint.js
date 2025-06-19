// Linter boilerplate (used only by ngspicejs-lint)
"use strict";
// linter: ngspicejs-lint
// --internal --show-ignored --show-implieds --show-speed

var JSHINT = globalThis.JSHINT;
var JSLINT = globalThis.JSLINT;

function lint(aInternal) {
    // Lint script
    var t0 = Date.now();
    var fn = script_self();
    var code = file_read(fn);
    var lines = code.split('\n');
    var show_ignored = false; // --show-ignored will show ignored hints at the bottom
    var show_implieds = false; // --show-implieds will show some extra stuff
    var show_speed = false; // --show-speed will show linting speed
    var browser = false; // --browser will add browser globals (document, window, ...)

    // command line switches
    if (script_args().includes('--no-linting')) {
        return;
    }
    if (script_args().includes('--internal')) {
        aInternal = true;
    }
    if (script_args().includes('--show-ignored')) {
        show_ignored = true;
    }
    if (script_args().includes('--show-implieds')) {
        show_implieds = true;
    }
    if (script_args().includes('--show-speed')) {
        show_speed = true;
    }
    if (script_args().includes('--browser')) {
        browser = true;
    }

    // extra arguments could be taken from the linter directive in the source
    var linter_args = lines.find((a) => a.startsWith('// linter: ngspicejs-lint'));
    if (linter_args) {
        linter_args = linter_args.replace('// linter: ngspicejs-lint', '');
        if (linter_args.match('--no-linting')) {
            return;
        }
        if (linter_args.match('--internal')) {
            aInternal = true;
        }
        if (linter_args.match('--show-ignored')) {
            show_ignored = true;
        }
        if (linter_args.match('--show-implieds')) {
            show_implieds = true;
        }
        if (linter_args.match('--show-speed')) {
            show_speed = true;
        }
        if (linter_args.match('--browser')) {
            browser = true;
        }
    }

    // check for tabs first
    var t = lines.findIndex((a) => a.match('\t'));
    if (t > 0) {
        echo(fn + ':' + (t + 1) + ':' + lines[t].indexOf('\t') + ': error - tabs are not allowed!');
    }

    // global keywords
    var glob = [
"ChartXy",
"Exception",
"Internal",
"ac",
"ac_fast",
"all_models",
"am",
"ammeter",
"api",
"array_abs",
"array_add",
"array_amplitude",
"array_argument",
"array_avg",
"array_clamp",
"array_column",
"array_complement",
"array_db",
"array_distribution",
"array_extrema",
"array_extrema_max",
"array_extrema_min",
"array_imag",
"array_add_scalar",
"array_sort_numerically",
"array_max",
"array_min",
"array_modulus",
"array_normalize",
"array_quantize",
"array_random_item",
"array_range",
"array_real",
"array_rms",
"array_running_avg",
"array_scale",
"array_shuffle",
"array_stats",
"array_std",
"array_sub",
"array_sum",
"array_union",
"array_unique",
"ascii_canvas",
"audio",
"available_vectors",
"battery",
"battery_sensitivity",
"beep",
"beeps",
"bjt_model",
"capacitor",
"cccs",
"ccvs",
"chart_scatter",
"chart_xy",
"clear_screen",
"combine_sources",
"complex",
"config_path",
"csv_decode",
"csv_encode",
"csv_insert",
"csv_to_array_of_objects",
"ctrl_c_pressed",
"ctrl_c_reset",
"current_source",
"delay_ms",
"diode",
"diode_model",
"dir",
"dir_create",
"dir_current",
"dir_recursive",
"distinct_colors",
"dynamic_mic",
"echo",
"echo_flush",
"echo_hints",
"echo_json",
"echo_netlist",
"echo_progress",
"echo_raw",
"echo_stream",
"echo_trap",
"electret_mic",
"eng",
"env",
"error",
"exit",
"fft",
"file_exists",
"file_ext",
"file_ext_replace",
"file_is_dir",
"file_mode",
"file_name",
"file_path",
"file_read",
"file_read_binary",
"file_read_csv",
"file_read_json",
"file_read_tsv",
"file_read_wav",
"file_size",
"file_stat",
"file_touch",
"file_write",
"file_write_binary",
"file_write_csv",
"file_write_json",
"file_write_m",
"file_write_netlist",
"file_write_ngspicejs",
"file_write_tsv",
"file_write_wav",
"font_neo_sans",
"gif",
"hash",
"help",
"hint",
"ignore",
"include",
"inductor",
"inductor_coupling",
"jfet_model",
"jfet_n",
"jfet_p",
"least_squares",
"lerp",
"levenshtein",
"linearize",
"mersenne_twister",
"mos_model",
"mosfet_n",
"mosfet_p",
"netlist_clear",
"netlist_devices",
"netlist_export",
"netlist_export_schematic",
"netlist_export_schematic_url",
"netlist_nets",
"netlist_to_script",
"ngspice_command_verbose",
"ngspice_version",
"ngspicejs_version",
"npn",
"opamp",
"pickup",
"pickup_humbucker",
"pickup_piezo",
"pickup_singlecoil",
"pnp",
"pot",
"pulse",
"pwl",
"random_float",
"random_int",
"read",
"read_char",
"resistor",
"resistor_model",
"round_down",
"round_to",
"round_up",
"sawtooth",
"script_args",
"script_ms",
"script_self",
"script_shell",
"script_shell_full",
"search",
"series_e12",
"series_e24",
"series_e3",
"series_e48",
"series_e6",
"series_e96",
"similar_strings",
"sinewave",
"singular_matrix",
"sixel_canvas",
"spice",
"spice_model",
"square",
"sub",
"sub_model",
"switch_1p2t",
"tally",
"temperature",
"terminal_colors",
"terminal_size",
"topology_edges",
"topology_path_exists",
"tran",
"tran_ok",
"ugly_vector_name",
"v8_version",
"vccs",
"vcvs",
"vdmos_model",
"voltmeter",
"vref",
"warn"
];

    // add extra keywords if this is internal file
    if (aInternal) {
        glob = glob.concat([
"AM",
"Ac",
"Ammeter",
"AsciiCanvas",
"Audio",
"Battery",
"BatterySensitivity",
"Beeps",
"BjtModel",
"CCCS",
"CCVS",
"Capacitor",
"ChartScatter",
"Complex",
"CurrentSource",
"Diode",
"DiodeModel",
"DynamicMic",
"ElectretMic",
"Equation",
"Fft",
"Inductor",
"InductorCoupling",
"JFetN",
"JFetP",
"JfetModel",
"Lerp",
"MersenneTwister",
"MosModel",
"MosfetN",
"MosfetP",
"NPN",
"Opamp",
"PNP",
"PWL",
"Pickup",
"Pot",
"Pulse",
"Resistor",
"ResistorModel",
"Sawtooth",
"Sinewave",
"SixelCanvas",
"Spice",
"SpiceModel",
"Square",
"Sub",
"SubModel",
"Switch1P2T",
"Tran",
"VCCS",
"VCVS",
"VdmosModel",
"Voltmeter",
"Vref",
"assert_arguments_length",
"assert_array",
"assert_array_of_complex",
"assert_array_of_nets",
"assert_array_of_numbers",
"assert_array_of_strings",
"assert_array_of_strings_or_numbers",
"assert_array_same_length",
"assert_boolean",
"assert_data_key",
"assert_enum",
"assert_equal",
"assert_expected_prefix",
"assert_function",
"assert_integer",
"assert_model_exists",
"assert_name",
"assert_name_unique",
"assert_net",
"assert_net_case",
"assert_netlist_has_net_devices",
"assert_netlist_snapshot_unchanged",
"assert_no_pending_analyses",
"assert_not_modified",
"assert_number",
"assert_object",
"assert_object_keys",
"assert_object_of_nets",
"assert_poly",
"assert_string",
"assign_core_library",
"before_exit",
"bounding_box",
"bresenham",
"buffered_stack_trace",
"buffered_stack_trace_clear",
"check_parallel_sources",
"combine_sources",
"device_attr_check",
"device_attr_assign",
"device_constructor",
"device_summary",
"equation",
"equation_combine",
"example",
"exit_code",
"fft",
"find_model",
"find_model_clear_cache",
"gif_begin",
"gif_end",
"gif_frame",
"hint_args",
"hint_buffer",
"hint_devices_on_net",
"human_vector_name",
"human_vector_names",
"include_global",
"internal_error",
"is_compiled_equation",
"is_equation",
"is_net",
"last_exception_string",
"model_cache",
"native_functions_description",
"netlist_done",
"netlist_line_markers",
"netlist_line_markers_find_device",
"netlist_render",
"netlist_snapshot",
"netlist_snapshot_compare",
"ngspice_command",
"ngspice_data",
"ngspice_error_parsers",
"ngspice_init",
"ngspice_log",
"ngspice_netlist",
"ngspice_process_log",
"ngspice_quit",
"ngspice_vectors",
"object_merge",
"require_model",
"simulation_temperature",
"temperature_apply",
"update_expected_prefix",
"warn_source_arguments_length"
]);
    }

    // browser
    if (browser) {
        glob = ['window', 'document', 'console', 'localStorage', 'JSON', 'fetch', 'alert',
            'prompt', 'confirm', 'Blob', 'URL', 'Image'];
    }

    // global: aaa, bbb, ccc
    lines.forEach((s) => {
        var m = s.match(/^\/\/ global: ([a-zA-Z0-9_\ \,]+)/);
        if (m) {
            glob = glob.concat(m[1].split(',').map((a) => a.trim()));
        }
    });

    // global aaa, bbb, ccc
    lines.forEach((s) => {
        var m = s.match(/^\/\* global ([a-zA-Z0-9_\ \,]+)/);
        if (m) {
            glob = glob.concat(m[1].split(',').map((a) => a.trim()));
        }
    });

    // jshint
    JSHINT(code, {
        esversion: 11,
        strict: 'global',
        unused: true,
        globals: glob,
        smarttabs: false,
        "+W099": true
    });
    var i, e, kind;
    for (i = 0; i < JSHINT.errors.length; i++) {
        e = JSHINT.errors[i];
        if (!e.id) {
            echo(fn + ':' + e.line + ':' + e.character + ': error - ' + e.reason + ' [' + e.code + '], // jshint -' + e.code);
        } else {
            kind = e.id.replace('(', '').replace(')', '');
            echo(fn + ':' + e.line + ':' + e.character + ': ' + kind + ' - ' + e.reason + ' [' + e.code + '], // jshint -' + e.code);
        }
    }

    // cherrypick some usefull JSLINT warnings

    function jslint_find_unused_variables(aFileName) {
        // Use jslint only to find unused variables
        // because jshint does not support it yet: https://github.com/jshint/jshint/issues/3644
        var src = file_read(aFileName);
        if (src.charAt(0) === "#") {
            src = "//" + src;
        }
        var o = JSLINT(src, {}, glob), rest = [];
        o.warnings.forEach((w) => {
            if (w.code === 'unused_a' || w.code === 'wrap_parameter') {
                echo(aFileName + ':' + (w.line + 1) + ':' + (w.column + 1) + ': error - ' + w.message + ' (jslint)');
                return;
            }
            if (w.code === 'expected_a_before_b') {
                if (w.a === 'new' && w.b === 'Exception') {
                    echo(aFileName + ':' + (w.line + 1) + ':' + (w.column + 1) + ': error - ' + w.message + ' (jslint)');
                    return;
                }
            }
            if (w.code === 'redefinition_a_b') {
                echo(aFileName + ':' + (w.line + 1) + ':' + (w.column + 1) + ': error - ' + w.message + ' (jslint)');
                echo(JSON.stringify(w, undefined, 4));
                return;
            }
            if (w.code === 'unexpected_trailing_space') {
                echo(aFileName + ':' + (w.line + 1) + ':' + (w.column + 1) + ': error - ' + w.message + ' (jslint)');
                return;
            }
            if (w.code === 'use_double' || w.code === 'expected_a_b') {
                return;
            }
            if (w.code === 'unexpected_a') {
                if (['this', 'for', 'continue', 'arguments', 'const', 'var', '.'].includes(w.a)) {
                    return;
                }
            }
            if (w.code === 'unexpected_expression_a') {
                if (['++', '--'].includes(w.a)) {
                    return;
                }
            }
            if (w.code === 'unexpected_at_top_level_a') {
                if (['while'].includes(w.a)) {
                    return;
                }
            }
            //echo(JSON.stringify(w));
            rest.push(w);
        });
        return rest;
    }

    var jslint_all = jslint_find_unused_variables(fn);

    // print omitted errors
    if (JSHINT.errors.length > 0 && show_implieds) {
        if (JSHINT.data().implieds) {
            echo("\nJSHINT implieds:");
            echo(JSON.stringify(JSHINT.data().implieds, undefined, 4));
        }
    }
    if (jslint_all.length > 0 && show_ignored) {
        echo("\nOmitted JSLINT warnings:");
        jslint_all.forEach((w) => {
            echo(fn + ':' + (w.line + 1) + ':' + (w.column + 1) + ': ' + w.name + ' - ' + w.message);
        });
        //echo(JSON.stringify(jslint_all, undefined, 2));
    }

    // echo("\nNOTE: you can use /* exported Foo, Bar */ or /* global Foo, Bar */");

    if (show_speed) {
        echo();
        echo("Lint done in " + (Date.now() - t0) + 'ms');
    }
}

globalThis.exports = {lint};
globalThis.lint = lint;
