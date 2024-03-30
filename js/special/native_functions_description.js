// Descriptions of native functions and their arguments
// linter: ngspicejs-lint --internal
"use strict";

/* jshint -W079 */
var native_functions_description = {
    "ctrl_c_pressed": {
        "summary": "Sets up Ctrl+C handler and if Ctrl+C was pressed, returns true",
        "args": []
    },
    "ctrl_c_reset": {
        "summary": "Reset the indicator that ctrl+c was pressed, this allows you to use ctrl+c multiple times or exit on second ctrl+c",
        "args": []
    },
    "echo": {
        "summary": "Print something to the default output stream, multiple arguments are separated by space",
        "args": ["..."]
    },
    "echo_trap": {
        "summary": "Define a string which when printed via echo will halt program, used to find forgotten echo",
        "args": ["aString"]
    },
    "echo_raw": {
        "summary": "Print single string argument to the current output stream, no new line, no flush",
        "args": ["aString"]
    },
    "echo_flush": {
        "summary": "Flush current output stream, usable after echo_raw, you can change stream with echo_stream(number)",
        "args": []
    },
    "echo_stream": {
        "summary": "Switch output stream between 1 (stdout) and 2 (stderr)",
        "args": ["aStreamNumber"]
    },
    "read": {
        "summary": "Read string from keyboard input using readline library, displays optional prompt",
        "args": ["oPrompt"]
    },
    "read_char": {
        "summary": "Read single char from keyboard input without waiting for ENTER key, displays optional prompt",
        "args": ["oPrompt"]
    },
    "ignore": {
        "summary": "Do nothing with the arguments, used to suppress linter warning",
        "args": ["..."]
    },
    "clear_screen": {
        "summary": "Clear screen of the terminal",
        "args": []
    },
    "delay_ms": {
        "summary": "Wait given amount of milliseconds",
        "args": ["aMilliseconds"]
    },
    "dir": {
        "summary": "Return array of file names and dir names in given path, dirs ends with slash",
        "args": ["aPath"]
    },
    "stack_trace": {
        "summary": "Print stack trace with optional error message",
        "args": ["oMessage"]
    },
    "v8_version": {
        "summary": "Return version string of V8 library",
        "args": []
    },
    "ngspice_version": {
        "summary": "Return version number of ngspice library",
        "args": []
    },
    "gif_begin": {
        "summary": "Create new empty gif file",
        "args": ["filename", "width", "height", "palette", "depth", "bgindex", "loop"]
    },
    "gif_frame": {
        "summary": "Add one frame to the gif",
        "args": ["", "", ""]
    },
    "gif_end": {
        "summary": "Close gif file",
        "args": ["", "", ""]
    },
    "env": {
        "summary": "Return content of environment variable, e.g. HOME",
        "args": ["aVariableName"]
    },
    "file_read": {
        "summary": "Read file and return it's content as a string",
        "args": ["aFileName"]
    },
    "file_write": {
        "summary": "Write string to a file",
        "args": ["aFileName", "aString"]
    },
    "file_exists": {
        "summary": "Return true if file exists",
        "args": ["aPath"]
    },
    "file_size": {
        "summary": "Return size of a file in bytes",
        "args": ["aPath"]
    },
    "include_global": {
        "summary": "Include external JS file, run in global context, exports are in globalThis.exports, see also include()",
        "args": ["aFilename", "oAllowInternalFunctions"]
    },
    "exit_code": {
        "summary": "Set program exit code without exiting, can be called multiple times",
        "args": ["aCode"]
    },
    "script_args": {
        "summary": "Return array of strings containing arguments of the script, first argument is path to ngspicejs shell, second argument is ngspicejs script filename, the rest are any extra arguments",
        "args": []
    },
    "script_shell": {
        "summary": "Return path to the shell that ran this script, e.g. script_args()[0]",
        "args": []
    },
    "script_shell_full": {
        "summary": "Return full path to shell that executed the script (usually /home/$USER/ngspicejs/ngspicejs) or undefined",
        "args": []
    },
    "script_self": {
        "summary": "Return path to this script, e.g. script_args()[1]",
        "args": []
    },
    "terminal_size": {
        "summary": "Return object with dimensions of the terminal, e.g. {columns: 80, rows: 25, pixel_width: 640, pixel_height: 480}",
        "args": []
    },
    "ngspice_command": {
        "summary": "Execute ngspice command",
        "args": ["aSpiceCommand"]
    },
    "ngspice_data": {
        "summary": "Retrieve ngspice data after a command",
        "args": []
    },
    "ngspice_init": {
        "summary": "Initialize ngspice",
        "args": []
    },
    "ngspice_log": {
        "summary": "Retrieve ngspice stdout and stderr",
        "args": []
    },
    "ngspice_clear_log": {
        "summary": "Clear ngspice stdout and stderr log to prevent slowdown (done automatically in ngspice_log())",
        "args": []
    },
    "ngspice_netlist": {
        "summary": "Set ngspice netlist",
        "args": ["aNetlistCode"]
    },
    "ngspice_quit": {
        "summary": "Quit ngspice",
        "args": []
    },
    "hint": {
        "summary": "Add message to the hint buffer, will be printed right after the next error",
        "args": ["aMessage"]
    },
    "hint_buffer": {
        "summary": "Return content of hint buffer as an array of strings and clear the hint buffer",
        "args": []
    },
    "dir_current": {
        "summary": "Return path to current working directory including trailing slash",
        "args": []
    },
    "last_exception_string": {
        "summary": "Return message of the most recent exception, used in before_exit() to suggest similar function names",
        "args": []
    },
    "terminal_colors": {
        "summary": "Return true if terminal support colors, false if not or if script output is redirected to file",
        "args": []
    },
    "echo_progress": {
        "summary": "Show that something is being done using a rotating progress indicator",
        "args": []
    },
    "buffered_stack_trace": {
        "summary": "Save V8 stack trace into the buffer, later this is used for more helpful stack traces",
        "args": ["oMessage"]
    },
    "buffered_stack_trace_clear": {
        "summary": "Clear stack trace buffer created by buffered_stack_trace function",
        "args": []
    },
    "assign_core_library": {
        "summary": "Combine sources, files and line numbers data into single core.js file",
        "args": []
    },
    "file_touch": {
        "summary": "Update access and modification time of a file",
        "args": ["aFilename,oAccessTime,oModificationTime"]
    },
    "file_stat": {
        "summary": "Return type of a file (file/dir/pipe/symlink)",
        "args": ["aFilename"]
    },
    "file_read_binary": {
        "summary": "Load file content from disk and return it as array of bytes",
        "args": ["aFilename"]
    },
    "file_write_binary": {
        "summary": "Write binary file from array of bytes",
        "args": ["aFilename", "aArrayOfBytes"]
    },
    "file_mode": {
        "summary": "Change file mode, return true on success, use e.g. parseInt('0777', 8) for mode",
        "args": ["aFileName", "aMode"]
    },
    "dir_create": {
        "summary": "Create directory and it's parents if needed, returns true if directory was created, 0 if it already existed",
        "args": ["aPath"]
    },
    "beep": {
        "summary": "Beep with given frequency (default 440Hz) for given duration in milliseconds (default 300ms)",
        "args": ["oFrequency", "oDuration"]
    },
    "ngspice_command_verbose": {
        "summary": "If argument is true, every ngspice command will be printed on screen",
        "args": ["aVerbose"]
    },
    "ngspice_vectors": {
        "summary": "Get ngspice vector names (like ngspice_data but return only vector names)",
        "args": []
    },
    "globalThis": {
        "summary": "Global object",
        "args": []
    },
    "Internal": {
        "summary": "Object with all internal functions, not to be used by end user",
        "args": []
    },
    "netlist_devices": {
        "summary": "Array of devices in netlist",
        "args": []
    },
    "font_neo_sans": {
        "summary": "Font used by sixel canvas",
        "args": []
    },
    "distinct_colors": {
        "summary": "Palette of dinstinct colors used by sixel canvas",
        "args": []
    }
};
/* jshint +W079 */

// warn about missing descriptions
var e = {};
for (var k in globalThis) {
    if (!native_functions_description[k] && k !== 'exports' && k !== 'combine_sources' && k !== 'Internal') {
        e[k] = {summary: "", args: []};
        echo('error: Missing description of native function: ' + k);
    }
}

Internal.native_functions_description = native_functions_description;
