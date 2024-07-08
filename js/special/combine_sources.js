// Combine all source files into one and keep file names and their line offsets
// linter: ngspicejs-lint --internal
"use strict";

(function () {

    // Combine all source files into one and keep file names and their line offsets
    var code = [], files = [], offsets = [];

    // Find js path
    var js_path = script_shell_full().split('/');
    js_path.pop();
    js_path = js_path.join('/') + '/js/';
    //echo('js_path=' + js_path);

    function one(aFileName) {
        // Load one file
        var s = file_read(js_path + aFileName).split('\n');
        // remember file name
        files.push(aFileName);
        // remember line index for this file
        offsets.push(code.length);
        // append code
        code = code.concat(s);
    }

    // header
    one('special/header.js');
    one('special/native_functions_description.js');
    one('ngspicejs_version.js');

    // few important first
    one('Exception.js');
    one('exit.js');

    // polyfills
    one('polyfill/polyfill_Object_hasOwn.js');
    one('polyfill/polyfill_at.js');

    // assertions
    one('is_net.js');
    one('assert/assert_integer.js');
    one('assert/assert_arguments_length.js');
    one('assert/assert_number.js');
    one('assert/assert_string.js');
    one('assert/assert_object.js');
    one('assert/assert_array.js');
    one('assert/assert_array_of_strings.js');
    one('assert/assert_array_of_numbers.js');
    one('assert/assert_array_of_complex.js');
    one('assert/assert_array_same_length.js');
    one('assert/assert_object_keys.js');
    one('assert/assert_net.js');
    one('assert/assert_net_case.js');
    one('assert/assert_name.js');
    one('assert/assert_name_unique.js');
    one('assert/assert_array_of_nets.js');
    one('assert/assert_object_of_nets.js');
    one('assert/assert_netlist_has_net_devices.js');
    one('assert/assert_enum.js');
    one('assert/assert_data_key.js');
    one('assert/assert_not_modified.js');
    one('assert/assert_no_pending_analyses.js');
    one('assert/assert_boolean.js');
    one('assert/assert_equal.js');
    one('assert/assert_poly.js');
    one('assert/assert_array_of_strings_or_numbers.js');
    one('assert/assert_expected_prefix.js');
    one('assert/assert_model_exists.js');
    one('assert/assert_netlist_snapshot_unchanged.js');
    one('assert/assert_function.js');

    // error parsers
    one('error_parser/common.js');
    one('error_parser/ac_error.js');
    one('error_parser/missing_end_statement.js');
    one('error_parser/tran_unknown_param.js');
    one('error_parser/unable_to_find_definition_of_model.js');
    one('error_parser/unrecognized_model_parameter.js');
    one('error_parser/no_such_vector.js');
    one('error_parser/no_circuits_loaded.js');
    one('error_parser/could_not_find_modelname.js');
    one('error_parser/cant_find_model.js');
    one('error_parser/simulation_interrupted.js');
    one('error_parser/no_simulations_run.js');
    one('error_parser/circuit_not_parsed.js');
    one('error_parser/device_already_exists.js');
    one('error_parser/gmin.js');
    one('error_parser/unknown_controlling_source.js');
    one('error_parser/singular_matrix.js');
    one('error_parser/cant_find_init_file.js');
    one('error_parser/coupling_to_non_existant_inductor.js');
    one('error_parser/tran_timestep_too_small.js');

    // file functions
    one('file/file_read_tsv.js');
    one('file/file_name.js');
    one('file/file_ext.js');
    one('file/file_read_csv.js');
    one('file/file_read_json.js');
    one('file/file_read_wav.js');
    one('file/file_write_csv.js');
    one('file/file_write_json.js');
    one('file/file_write_tsv.js');
    one('file/file_write_netlist.js');
    one('file/file_write_ngspicejs.js');
    one('file/file_write_m.js');
    one('file/file_write_wav.js');
    one('file/file_ext.js');
    one('file/file_ext_replace.js');
    one('file/file_name.js');
    one('file/file_path.js');
    one('file/file_is_dir.js');
    one('file/dir_recursive.js');
    one('file/csv_decode.js');
    one('file/csv_encode.js');
    one('file/csv_insert.js');
    one('file/csv_to_array_of_objects.js');

    // array functions
    one('array/array_column.js');
    one('array/array_clamp.js');
    one('array/array_abs.js');
    one('array/array_avg.js');
    one('array/array_rms.js');
    one('array/array_imag.js');
    one('array/array_modulus.js');
    one('array/array_argument.js');
    one('array/array_distribution.js');
    one('array/array_real.js');
    one('array/array_scale.js');
    one('array/array_sort_numerically.js');
    one('array/array_normalize.js');
    one('array/array_extrema.js');
    one('array/array_extrema_max.js');
    one('array/array_extrema_min.js');
    one('array/array_max.js');
    one('array/array_min.js');
    one('array/array_unique.js');
    one('array/array_union.js');
    one('array/array_range.js');
    one('array/array_sum.js');
    one('array/array_db.js');
    one('array/array_stats.js');
    one('array/array_add.js');
    one('array/array_add_scalar.js');
    one('array/array_sub.js');
    one('array/array_std.js');
    one('array/array_quantize.js');
    one('array/array_complement.js');
    one('array/array_running_avg.js');
    one('array/array_random_item.js');
    one('array/array_shuffle.js');
    one('array/array.js');

    // echo functions
    one('echo/echo_json.js');
    one('echo/echo_hints.js');
    one('echo/echo_netlist.js');
    one('echo/error.js');
    one('echo/example.js');
    one('echo/help.js');
    one('echo/hint_args.js');
    one('echo/hint_devices_on_net.js');
    one('echo/warn.js');
    one('echo/internal_error.js');

    // equations
    one('equation/is_equation.js');
    one('equation/is_compiled_equation.js');
    one('equation/equation_combine.js');
    one('equation/equation.js');

    // netlist functions
    one('netlist/netlist_clear.js');
    one('netlist/netlist_done.js');
    one('netlist/netlist_line_markers_find_device.js');
    one('netlist/netlist_nets.js');
    one('netlist/netlist_render.js');
    one('netlist/netlist_snapshot.js');
    one('netlist/netlist_to_script.js');
    one('netlist/netlist_export.js');
    one('netlist/netlist_export_schematic.js');
    one('netlist/netlist_export_schematic_url.js');

    // various functions
    one('check_parallel_sources.js');
    one('device_summary.js');
    one('bounding_box.js');
    one('lerp.js');
    one('tally.js');
    one('linearize.js');
    one('api.js');
    one('bresenham.js');
    one('device_attr_assign.js');
    one('device_attr_check.js');
    one('eng.js');
    one('include.js');
    one('ngspice_process_log.js');
    one('number_to_eng.js');
    one('round_down.js');
    one('round_to.js');
    one('round_up.js');
    one('levenshtein.js');
    one('similar_strings.js');
    one('string_from_eng.js');
    one('series_e12.js');
    one('find_model.js');
    one('least_squares.js');
    one('warn_source_arguments_length.js');
    one('all_models.js');
    one('config_path.js');
    one('search.js');
    one('sixel_canvas.js');
    one('ascii_canvas.js');
    one('font_neo_sans.js');
    one('chart_xy.js');
    one('chart_scatter.js');
    one('gif.js');
    one('distinct_colors.js');
    one('object_merge.js');
    one('random_int.js');
    one('random_float.js');
    one('mersenne_twister.js');
    one('script_ms.js');
    one('hash.js');
    one('temperature.js');
    one('human_vector_name.js');
    one('ugly_vector_name.js');
    one('available_vectors.js');
    one('topology_edges.js');
    one('topology_path_exists.js');

    // analysis
    one('analysis/ac.js');
    one('analysis/ac_fast.js');
    one('analysis/tran.js');
    one('analysis/tran_ok.js');
    one('analysis/fft.js');
    one('analysis/battery_sensitivity.js');
    one('analysis/singular_matrix.js');

    // models
    one('model/diode_model.js');
    one('model/bjt_model.js');
    one('model/mos_model.js');
    one('model/vdmos_model.js');
    one('model/jfet_model.js');
    one('model/resistor_model.js');

    // devices
    one('device/battery.js');
    one('device/resistor.js');
    one('device/diode.js');
    one('device/pickup.js');
    one('device/pickup_singlecoil.js');
    one('device/pickup_humbucker.js');
    one('device/pickup_piezo.js');
    one('device/pulse.js');
    one('device/square.js');
    one('device/sinewave.js');
    one('device/inductor.js');
    one('device/inductor_coupling.js');
    one('device/capacitor.js');
    one('device/npn.js');
    one('device/pnp.js');
    one('device/ammeter.js');
    one('device/spice.js');
    one('device/opamp.js');
    one('device/pwl.js');
    one('device/mosfet_p.js');
    one('device/mosfet_n.js');
    one('device/jfet_n.js');
    one('device/jfet_p.js');
    one('device/beeps.js');
    one('device/am.js');
    one('device/sawtooth.js');
    one('device/voltmeter.js');
    one('device/switch_1p2t.js');
    one('device/vref.js');
    one('device/pot.js');
    one('device/electret_mic.js');
    one('device/dynamic_mic.js');
    one('device/vcvs.js');
    one('device/cccs.js');
    one('device/current_source.js');
    one('device/vccs.js');
    one('device/ccvs.js');
    one('device/audio.js');

    // subcircuits
    one('model/spice_model.js');
    one('model/sub_model.js');
    one('device/sub.js');

    // experimental code
    one('experimental/complex.js');

    // other
    one('special/before_exit.js');

    // footer
    one('special/footer.js');

    //echo('code', code.length);
    //echo('files', files.length);
    //echo('offset', offsets.length); 123
    assign_core_library(code, files, offsets);

    code = code.join('\n');

    // jshint -W061
    eval(code);
    // jshint +W061

    // Hide some native functions from globalThis and move them to Internal
    [
        'assign_core_library', 'buffered_stack_trace', 'buffered_stack_trace_clear',
        'gif_begin', 'gif_frame', 'gif_end', 'hint_buffer',
        'internal_error', 'is_net', 'last_exception_string',
        'netlist_done', 'netlist_line_markers_find_device', 'ngspice_command',
        'ngspice_data', 'ngspice_init', 'ngspice_log', 'ngspice_netlist',
        'ngspice_process_log', 'ngspice_quit',
        'exit_code', 'hint_devices_on_net',
        'netlist_render', 'object_merge',
        "human_vector_names", "bounding_box", "device_summary",
        "is_compiled_equation", "is_equation",
        "equation", "equation_combine",
        "include_global", "ngspice_vectors",
        'netlist_line_markers',
        'warn_source_arguments_length',
        'MersenneTwister'
    ].forEach((s) => {
        Internal[s] = globalThis[s];
        if (!Object.hasOwn(globalThis, s)) {
            warn('deprecated ' + s);
        }
        delete globalThis[s];
    });

}());
