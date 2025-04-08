// Exit codes and functions

// When exit code wasn't assigned yet
#define EXIT_UNKNOWN 1
// Script compilation error
#define EXIT_COMPILE_ERROR 2
// Script execution error
#define EXIT_RUN_ERROR 3
// Wrong order of calling functions
#define EXIT_WRONG_ORDER 4
// This should never happen (e.g. places after JS throw that should not happen but if they do program must exit)
#define EXIT_IMPOSSIBLE 5
// Generic error when working with files (cannot read, cannot write, bad path, etc)
#define EXIT_FILE 6
// Generic problem with function arguments (wrong count, wront types, wrong combinations, ...)
#define EXIT_ARGS 7
// Errors while calling ngspice functions
#define EXIT_NGSPICE 8
// Internal error caused by ngspicejs, should be reported
#define EXIT_INTERNAL 9
// Exit due to echo trap
#define EXIT_ECHO_TRAP 10
// Error in some library
#define EXIT_LIB 11
// Exit code set when uncaught exception happened
#define EXIT_UNCAUGHT_EXCEPTION 12
// Unspecified error in JS code
#define EXIT_JS_ERROR 13
// V8 error
#define EXIT_V8 14
// Missing "new" keyword when throwing Exception
#define EXIT_MISSING_NEW 15
// Included file did not set exports
#define EXIT_INCLUDE_MISSING_EXPORTS 16
// Errors in operating system calls (e.g. env)
#define EXIT_SYSTEM 17
// Code that should not be called was called
#define EXIT_UNREACHABLE 18
// Netlist related error
#define EXIT_NETLIST 19
// Ctrl+C pressed
#define EXIT_CTRL_C 20
// Immediate exit from Ctrl+C handler
#define EXIT_CTRL_C_IMMEDIATE 21
// "Modern" errors are caused by the Ubuntu 22.04 to 24.04 upgrade
#define EXIT_MODERN 23
// Segfault
#define EXIT_SEGFAULT 139

void fatal(int exit_code);
void fatal_msg_stack(v8::Isolate *isolate, int exit_code, const char *msg, ...);
void fatal_msg(int exit_code, const char *msg, ...);
