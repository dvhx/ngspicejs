// ngspicejs-lint - Linter for ngspicejs

#define NGSPICEJS_LINT

#include "headers.h"

int main(int argc, char* argv[]) {
    arg_parse(argc, argv);

    ngspice_v8_init();

    {
        v8::Isolate::Scope isolate_scope(globalIsolate);
        v8::HandleScope handle_scope(globalIsolate);
        v8::Local<v8::Context> context = CreateShellContext(globalIsolate);
        globalContext = context;
        if (context.IsEmpty()) {
            fprintf(stderr, "Error creating V8 context\n");
            exit(EXIT_V8);
        }
        v8::Context::Scope context_scope(context);

        // original js-hint
        include_js_file(context, globalIsolate, "depend/jshint/jshint-2.13.6.js", "jshint-2.13.6.js", true);
        // original jslint
        include_js_file(context, globalIsolate, "depend/jslint/jslint-2018-03-14.js", "jslint-2018-03-14.js", true);
        // boilerplate
        include_js_file(context, globalIsolate, "special/lint.js", "special/beautify.js", true);

        // lint internal or external code
        if (arg_internal) {
            include_js_code(context, globalIsolate, "lint(true)", "lint/lint.js", "lint/lint.js");
        } else {
            include_js_code(context, globalIsolate, "lint(false)", "lint/lint.js", "lint/lint.js");
        }
    }

    // Dispose the isolate and tear down V8.
    globalIsolate->Dispose();
    v8::V8::Dispose();
    //v8::V8::DisposePlatform();
    delete global_create_params.array_buffer_allocator;
    return 0;
}

