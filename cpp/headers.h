// All header files used by ngspicejs, linter and beautifier

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/param.h>
#include <math.h>
#include <glib.h>
#include <time.h>
#include <unistd.h>
#include <node/v8.h>
#include <v8/libplatform/libplatform.h>

// utils
#include "utils/glib_file_get_contents_no_leak.c"
#include "utils/ltrim.h"
#include "utils/arg_parse.h"
#include "utils/ars.h"
#include "utils/saos.h"
#include "utils/saoi.h"
#include "utils/file_exists.h"
#include "utils/highlight_error_in_file.h"
#include "utils/string_format.h"
#include "utils/terminal_colors.h"
#include "utils/warn.h"
#include "utils/stack_parser.h"
#include "utils/beep.h"

// v8
#include "v8/check_exception.h"
#include "v8/v8_buffered_stack_trace.h"
#include "v8/fatal.h"
#include "v8/hint_args.h"
#include "v8/include_js_code.h"
#include "v8/include_js_file.h"
#include "v8/to_c_string.h"


// gif
#ifdef NGSPICEJS_GIF
#include "depend/gifenc/gifenc.h"
#include "utils/freeables.h"
#endif

// Simple ngspice api
#ifdef NGSPICEJS_NGSPICE
#include <ngspice/sharedspice.h>
#include "ngspice/simple_ngspice.h"
#endif

// global variables
#include "globals.h"

// Simple ngspice api
#ifdef NGSPICEJS_NGSPICE
#include "ngspice/init.c"
#include "ngspice/netlist.c"
#include "ngspice/command.c"
#include "ngspice/quit.c"
#include "ngspice/data.c"
#endif

// c files
#include "assert/all.h"
#include "utils/ltrim.c"
#include "utils/arg_parse.c"
#include "utils/ars.c"
#include "utils/saos.c"
#include "utils/saoi.c"
#include "utils/file_exists.c"
#include "utils/highlight_error_in_file.c"
#include "utils/core_library_highlight.c"
#include "utils/offending_line.c"
#include "utils/string_format.c"
#include "utils/terminal_colors.c"
#include "utils/warn.c"
#include "utils/stack_parser.c"
#include "utils/beep.c"
#include "v8/check_exception.cpp"
#include "v8/v8_buffered_stack_trace.cpp"
#include "v8/fatal.cpp"
#include "v8/hint_args.cpp"
#include "v8/include_js_code.cpp"
#include "v8/include_js_file.cpp"
#include "v8/to_c_string.cpp"
#include "v8/init.cpp"

// gif
#ifdef NGSPICEJS_GIF
#include "depend/gifenc/gifenc.c"
#include "utils/freeables.c"
#endif

#include "api/api.cpp"


