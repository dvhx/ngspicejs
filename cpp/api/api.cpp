// Create globalThis object with all js functions

#include "echo_progress_hide.cpp"
#include "echo_flush.cpp"
#include "echo_progress.cpp"
#include "echo_raw.cpp"
#include "echo_stream.cpp"
#include "echo_trap.cpp"
#include "echo.cpp"
#include "hint.cpp"
#include "exit.cpp"
#include "read.cpp"
#include "dir.cpp"
#include "dir_current.cpp"
#include "dir_create.cpp"
#include "env.cpp"
#include "script_args.cpp"
#include "script_self.cpp"
#include "script_shell.cpp"
#include "script_shell_full.cpp"
#include "file_exists.cpp"
#include "file_size.cpp"
#include "file_read.cpp"
#include "file_write.cpp"
#include "file_write_binary.cpp"
#include "file_mode.cpp"
#include "file_stat.cpp"
#include "file_touch.cpp"
#include "include_global.cpp"
#include "terminal_size.cpp"
#include "terminal_colors.cpp"
#include "v8_version.cpp"
#include "ignore.cpp"
#include "beep.cpp"

#ifdef NGSPICEJS_NGSPICE
#include "ngspice_version.cpp"
#include "ngspice_init.cpp"
#include "ngspice_netlist.cpp"
#include "ngspice_command.cpp"
#include "ngspice_data.cpp"
#include "ngspice_vectors.cpp"
#include "ngspice_quit.cpp"
#include "ngspice_log.cpp"
#endif

#ifdef NGSPICEJS_GIF
#include "gif.cpp"
#endif

#include "buffered_stack_trace.cpp"
#include "clear_screen.cpp"
#include "delay_ms.cpp"
#include "last_exception_string.cpp"
#include "assign_core_library.cpp"

v8::Local<v8::Context> CreateShellContext(v8::Isolate* isolate) {
    // Create a template for the global object.
    v8::Local<v8::ObjectTemplate> global = v8::ObjectTemplate::New(isolate);
    globalObject = global;
    /*
    global->Set(isolate, "leak_1kB", v8::FunctionTemplate::New(isolate, js_leak_1kB));
    global->Set(isolate, "leak_2kB", v8::FunctionTemplate::New(isolate, js_leak_2kB));
    global->Set(isolate, "leak_4kB", v8::FunctionTemplate::New(isolate, js_leak_4kB));
    global->Set(isolate, "leak_8kB", v8::FunctionTemplate::New(isolate, js_leak_8kB));
    global->Set(isolate, "leak_16kB", v8::FunctionTemplate::New(isolate, js_leak_16kB));
    global->Set(isolate, "leak_32kB", v8::FunctionTemplate::New(isolate, js_leak_32kB));
    global->Set(isolate, "leak_500kB", v8::FunctionTemplate::New(isolate, js_leak_500kB));
    */

    // basic functions
    global->Set(isolate, "echo", v8::FunctionTemplate::New(isolate, js_echo));
    global->Set(isolate, "echo_trap", v8::FunctionTemplate::New(isolate, js_echo_trap));
    global->Set(isolate, "echo_raw", v8::FunctionTemplate::New(isolate, js_echo_raw));
    global->Set(isolate, "echo_flush", v8::FunctionTemplate::New(isolate, js_echo_flush));
    global->Set(isolate, "echo_stream", v8::FunctionTemplate::New(isolate, js_echo_stream));
    global->Set(isolate, "echo_progress", v8::FunctionTemplate::New(isolate, js_echo_progress));
    global->Set(isolate, "hint", v8::FunctionTemplate::New(isolate, js_hint));
    global->Set(isolate, "hint_buffer", v8::FunctionTemplate::New(isolate, js_hint_buffer));
    global->Set(isolate, "exit_code", v8::FunctionTemplate::New(isolate, js_exit_code));
    global->Set(isolate, "read", v8::FunctionTemplate::New(isolate, js_read));
    global->Set(isolate, "ignore", v8::FunctionTemplate::New(isolate, js_ignore));
    global->Set(isolate, "clear_screen", v8::FunctionTemplate::New(isolate, js_clear_screen));
    global->Set(isolate, "delay_ms", v8::FunctionTemplate::New(isolate, js_delay_ms));
    global->Set(isolate, "buffered_stack_trace", v8::FunctionTemplate::New(isolate, js_buffered_stack_trace));
    global->Set(isolate, "buffered_stack_trace_clear", v8::FunctionTemplate::New(isolate, js_buffered_stack_trace_clear));
    global->Set(isolate, "last_exception_string", v8::FunctionTemplate::New(isolate, js_last_exception_string));
    global->Set(isolate, "assign_core_library", v8::FunctionTemplate::New(isolate, js_assign_core_library));
    global->Set(isolate, "v8_version", v8::FunctionTemplate::New(isolate, js_v8_version));
    global->Set(isolate, "env", v8::FunctionTemplate::New(isolate, js_env));

    // script related functions (arguments, etc...)
    global->Set(isolate, "script_args", v8::FunctionTemplate::New(isolate, js_script_args));
    global->Set(isolate, "script_self", v8::FunctionTemplate::New(isolate, js_script_self));
    global->Set(isolate, "script_shell", v8::FunctionTemplate::New(isolate, js_script_shell));
    global->Set(isolate, "script_shell_full", v8::FunctionTemplate::New(isolate, js_script_shell_full));

    // file functions
    global->Set(isolate, "file_exists", v8::FunctionTemplate::New(isolate, js_file_exists));
    global->Set(isolate, "file_size", v8::FunctionTemplate::New(isolate, js_file_size));
    global->Set(isolate, "file_touch", v8::FunctionTemplate::New(isolate, js_file_touch));
    global->Set(isolate, "file_stat", v8::FunctionTemplate::New(isolate, js_file_stat));
    global->Set(isolate, "file_read", v8::FunctionTemplate::New(isolate, js_file_read));
    global->Set(isolate, "file_read_binary", v8::FunctionTemplate::New(isolate, js_file_read_binary));
    global->Set(isolate, "file_write", v8::FunctionTemplate::New(isolate, js_file_write));
    global->Set(isolate, "file_write_binary", v8::FunctionTemplate::New(isolate, js_file_write_binary));
    global->Set(isolate, "file_mode", v8::FunctionTemplate::New(isolate, js_file_mode));
    global->Set(isolate, "dir", v8::FunctionTemplate::New(isolate, js_dir));
    global->Set(isolate, "dir_current", v8::FunctionTemplate::New(isolate, js_dir_current));
    global->Set(isolate, "dir_create", v8::FunctionTemplate::New(isolate, js_dir_create));
    global->Set(isolate, "include_global", v8::FunctionTemplate::New(isolate, js_include_global));

    // terminal functions
    global->Set(isolate, "terminal_size", v8::FunctionTemplate::New(isolate, js_terminal_size));
    global->Set(isolate, "terminal_colors", v8::FunctionTemplate::New(isolate, js_terminal_colors));

    // ngspice functions
#ifdef NGSPICEJS_NGSPICE
    global->Set(isolate, "ngspice_version", v8::FunctionTemplate::New(isolate, js_ngspice_version));
    global->Set(isolate, "ngspice_init", v8::FunctionTemplate::New(isolate, js_ngspice_init));
    global->Set(isolate, "ngspice_netlist", v8::FunctionTemplate::New(isolate, js_ngspice_netlist));
    global->Set(isolate, "ngspice_command", v8::FunctionTemplate::New(isolate, js_ngspice_command));
    global->Set(isolate, "ngspice_command_verbose", v8::FunctionTemplate::New(isolate, js_ngspice_command_verbose));
    global->Set(isolate, "ngspice_data", v8::FunctionTemplate::New(isolate, js_ngspice_data));
    global->Set(isolate, "ngspice_vectors", v8::FunctionTemplate::New(isolate, js_ngspice_vectors));
    global->Set(isolate, "ngspice_quit", v8::FunctionTemplate::New(isolate, js_ngspice_quit));
    global->Set(isolate, "ngspice_log", v8::FunctionTemplate::New(isolate, js_ngspice_log));
#endif

    // other
    global->Set(isolate, "beep", v8::FunctionTemplate::New(isolate, js_beep));

#ifdef NGSPICEJS_GIF
    // gif functions
    global->Set(isolate, "gif_begin", v8::FunctionTemplate::New(isolate, js_gif_begin));
    global->Set(isolate, "gif_frame", v8::FunctionTemplate::New(isolate, js_gif_frame));
    global->Set(isolate, "gif_end", v8::FunctionTemplate::New(isolate, js_gif_end));
#endif

    return v8::Context::New(isolate, NULL, global);
}
