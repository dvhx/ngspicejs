// This is header for combined sources
(function () {
    "use strict";

    // delete console, it's not implemented anyway, I'd rather see explicit error then make it quietly fail
    delete globalThis.console;

    // objects for public and private functions
    var Internal = {};
    globalThis.Internal = Internal;

    // Device constructors are put here for global operations
    Internal.device_constructor = {};

    // Native functions that are later hidden must be assigned to local variable
    // here to make them callable without Internal. prefix
    var include_global = globalThis.include_global;
    var ngspice_vectors = globalThis.ngspice_vectors;
    var hint = globalThis.hint;
    var hint_buffer = globalThis.hint_buffer;
    var exit_code = globalThis.exit_code;
    var gif_begin = globalThis.gif_begin;
    var gif_frame = globalThis.gif_frame;
    var gif_end = globalThis.gif_end;
    var last_exception_string = globalThis.last_exception_string;
    var model_cache = globalThis.model_cache;
    var ngspice_netlist = globalThis.ngspice_netlist;
    var ngspice_log = globalThis.ngspice_log;
    var ngspice_command = globalThis.ngspice_command;
    var ngspice_data = globalThis.ngspice_data;
    var ngspice_quit = globalThis.ngspice_quit;
    var assign_core_library = globalThis.assign_core_library;
    var buffered_stack_trace = globalThis.buffered_stack_trace;
    var buffered_stack_trace_clear = globalThis.buffered_stack_trace_clear;

    // initialize ngspice
    ngspice_init();

