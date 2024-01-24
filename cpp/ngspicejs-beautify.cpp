// ngspicejs-beautify - Beautifier for ngspicejs

#define NGSPICEJS_BEAUTIFY

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

        // original js-beautify
        include_js_file(context, globalIsolate, "depend/beautify/js-beautify-1.14.8.js", "js-beautify-1.14.8.js", true);
        // boilerplate and actually beautify code
        include_js_file(context, globalIsolate, "special/beautify.js", "js/special/beautify.js", true);
    }

    // Dispose the isolate and tear down V8.
    globalIsolate->Dispose();
    v8::V8::Dispose();
    //v8::V8::DisposePlatform();
    delete global_create_params.array_buffer_allocator;
    return 0;
}

