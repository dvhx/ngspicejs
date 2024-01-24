// Global variables

// Path to executable (needed to find js source directory, returned in script_shell_full)
char* exe_path;

// Full path to js source directory, e.g. /home/username/ngspicejs/js
char* js_src_dir_full;

// Number set in js by exit_code(number) and used in cpp in exit(number) function
int exit_code = 0;

// Hints are data collected before error into a buffer and displayed after the error message
// Sometimes hints are collected but no error happens
Ars *hint_buffer = ars();

// Reference to JS globalThis, contains all native JS functions (although some are moved to Internal JS object after the init)
v8::Local<v8::ObjectTemplate> globalObject;

// V8 global context, used for number conversions and some exports handling
v8::Local<v8::Context> globalContext;

// V8 isolate used when local isolate is not yet available
v8::Isolate* globalIsolate;

// V8 something
v8::Isolate::CreateParams global_create_params;
std::unique_ptr<v8::Platform> platform;

// Indicate that stack trace was called or printed to prevent prining it twice in certain situations
bool js_stack_trace_called = false;

// Indicators to keep track if exception happened in core or somewhere else
bool core_compiled = false;
bool core_evaluated = false;

// If true ngspice commands will be printed on screen, can be set in JS via ngspice_command_verbose(true)
bool verbose_ngspice_command = false;

// Current stream id used in echo functions, can be switched using echo_stream(1/2)
FILE* echo_stream_id = stdout;

// Special "trap" string which when printed will stop script execution
const char *echo_trap = NULL;

// Lines of core library (generated by combine_sources.js)
Saos *core_lines;

// Filenames of core library
Saos *core_files;

// Line offsets of combined core library
Saoi *core_offsets;

// If echo_trap is used, echo command is buffered to allow checking for trap strings that spans multiple echo arguments
Ars *js_echo_buffer = ars();

// Current state of echo_progress indicator 0=off, 1-4=rotated bars
int js_echo_progress_value = 0;

// Remember when was echo_progress indicator printed to not show it more often than 300ms to increase the speed
struct timespec js_echo_progress_timespec;

// Default linux OOM killer is garbage, often freezing entire computer instead of killing offending program
// Setting some arbitrary file size limit prevents the freeze/crash
#define FILE_SIZE_LIMIT 250000000

// Currently edited gif
#ifdef NGSPICEJS_GIF
ge_GIF *gif = NULL;

// List of pointers to gif frames used while making gif that needs to be freed after gif is done
Freeables *gif_freeables = NULL;
#endif

// Pointer to allocated but not released string used for testing leaks
char *leak_str = NULL;

#ifdef NGSPICEJS_NGSPICE
// Data for simplified ngspice access, used by cpp/ngspice/*
SimpleNgspiceContext *simple_ngspice_context;
#endif

// Command line arguments
char *arg_eval_before_init;    // code to inject before core.js
char *arg_eval_before_script;  // code to inject after core.js and before script itself
char *arg_eval_after_script;   // code to inject after the script
char *arg_first;               // first argument, usually script filename
char *arg_second;              // second argument, first argument of a script
int arg_second_index = 0;      // index of second argument
int arg_count;                 // number of arguments
char **arg_items;              // all arguments
bool arg_zero_stack = false;   // true = use 0 instead of actual line and col numbers in stack traces, used in unit tests

// Command line arguments for linter
bool arg_internal = false;     // true = lint file as if it was internal js code, enabled by --internal switch to the linter
bool arg_quiet = false;        // true = don't print linting time

// Color terminal codes and messages
char *color_prefix_error_stderr = (char*)"\x1b[91merror:\x1b[0m ";
char *color_prefix_warn_stderr = (char*)"\x1b[95mwarn:\x1b[0m ";
char *color_prefix_hint_stderr = (char*)"\x1b[94mhint:\x1b[0m ";
char *color_filename_stderr = (char*)"\x1b[36m";
char *color_line_stderr = (char*)"\x1b[93m";
char *color_reset_stderr = (char*)"\x1b[0m";
char *color_arrow_stderr = (char*)"\x1b[93m\x1b[1m";
char *color_prefix_example_stdout = (char*)"\x1b[92mexample:\x1b[0m ";
char *color_prefix_example_stderr = (char*)"\x1b[92mexample:\x1b[0m ";
char *color_clear_screen = (char*)"\u001B[2J\u001B[0;0f";
bool terminal_colors_disabled = false;

// Keep last exception string, used in before_exit() to find similar identifiers
char* last_exception_string = NULL;

// Indicator if exit from JS was triggered via: throw new "SOFT_EXIT_TRIGGER" to implement the exit() function
bool soft_exit_triggered = false;

