// ngspicejs - JS frontend for ngspice

#define NGSPICEJS_NGSPICE
#define NGSPICEJS_GIF

#include "headers.h"

int main(int argc, char* argv[]) {
    terminal_colors_disable();
    arg_parse(argc, argv);

    ngspice_v8_init();

    try {

        v8::Isolate::Scope isolate_scope(globalIsolate);
        v8::HandleScope handle_scope(globalIsolate);
        v8::Local<v8::Context> context = CreateShellContext(globalIsolate);
        globalContext = context;
        if (context.IsEmpty()) {
            fprintf(stderr, "Error creating V8 context\n");
            exit(EXIT_V8);
        }
        v8::Context::Scope context_scope(context);

        // eval extra code before init
        if (arg_eval_before_init) {
            include_js_code(context, globalIsolate, arg_eval_before_init, "eval-before-init", "eval-before-init");
        }

        // evaluate special/combine_sources.js
        include_js_file(context, globalIsolate, "special/combine_sources.js", "js/special/combine_sources.js", true);
        if (exit_code != 0) {
            exit(exit_code);
        }

        // eval code before script
        if (arg_eval_before_script) {
            include_js_code(context, globalIsolate, arg_eval_before_script, "eval-before-script", "eval-before-script");
        }

        // check if arg_second exists!?
        if (!arg_second) {
            fprintf(stderr, "error: script not specified, use ngspicejs <filename> or use hashbang '#!/usr/bin/env ngspicejs' as first line of a script!\n");
            exit(EXIT_ARGS);
        }
        if (arg_second && !g_file_test(arg_second, G_FILE_TEST_EXISTS)) {
            fprintf(stderr, "error: file '%s' not found (use filename as jsh argument or hashbang in a script)!\n", arg_second);
            exit(EXIT_ARGS);
        }

        // Include executed file itself
        include_js_file(context, globalIsolate, arg_second, arg_second, false);

        // run special/before_exit.js
        include_js_code(context, globalIsolate, "if (Internal.before_exit) { Internal.before_exit(); }", "before_exit.js", "before_exit.js");

        // eval extra code after script
        if (arg_eval_after_script) {
            include_js_code(context, globalIsolate, arg_eval_after_script, "eval-after-script", "eval-after-script");
        }

    } catch (std::runtime_error const &e) {
        fatal_msg(EXIT_SYSTEM, "runtime error - %s", e.what());
    }

    // Dispose the isolate and tear down V8
    globalIsolate->Dispose();
    v8::V8::Dispose();
    //v8::V8::DisposePlatform();
    //v8::V8::DisposePlatform();
    //delete create_params.array_buffer_allocator;
    //create_params.array_buffer_allocator->Free();

    echo_progress_hide();
    if (exit_code != 0) {
        printf("exit(%d)\n", exit_code);
    }
    return exit_code;
}

