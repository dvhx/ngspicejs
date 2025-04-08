// Compile and execute js code from string

void include_js_code(v8::Local<v8::Context> context, v8::Isolate* isolate, const char *code, const char * filename, const char * filename_origin) {
    // Compile and execute js code from string
    //printf("CALL: include_js_code(context, isolate, code(%ld), %s, %s)\n", strlen(code), filename, filename_origin);

    // if already in soft exit, do not execute any code, not even before_exit()
    if (soft_exit_triggered) {
        return;
    }

    v8::TryCatch try_catch(isolate);
    //global_try_catch = &try_catch;

    // convert code do v8 string
    v8::Local<v8::String> source = v8::String::NewFromUtf8(isolate, code, v8::NewStringType::kNormal).ToLocalChecked();
    check_exception(isolate, &try_catch, "PLACE_0", filename, true);

    // Compile the source code.
    v8::Local<v8::Script> script;
    v8::Local<v8::String> s1 = v8::Local<v8::String>(v8::String::NewFromUtf8(isolate, filename_origin, v8::NewStringType::kNormal).ToLocalChecked());
    v8::Local<v8::Value> v1 = v8::Local<v8::Value>::Cast(s1);
    // old way: v8::ScriptOrigin origin(v1);
    // new way: v8::ScriptOrigin::ScriptOrigin(v8::Isolate*, v8::Local<v8::Value>, int, int, bool, int, v8::Local<v8::Value>, bool, bool, bool, v8::Local<v8::Data>)
    v8::ScriptOrigin origin(
      isolate,
      v1,                       // Resource name (e.g., file name)
      0,                        // Resource line offset
      0,                        // Resource column offset
      false,                    // Is this a cross-origin script?
      -1,                       // Script id
      v8::Local<v8::Value>(),   // Source map URL
      false,                    // Resource is opaque
      false,                    // Is the script for wasm?
      false,                    // Is the script a module?
      v8::Local<v8::Data>()     // host defined options
    );

    //printf("00 %s\n", filename);
    if (!v8::Script::Compile(context, source, &origin).ToLocal(&script)) {
        check_exception(isolate, &try_catch, "PLACE_1", filename, true);
        fprintf(stderr, "%snot compiled!\n", color_prefix_warn_stderr);
        fatal(EXIT_COMPILE_ERROR);
        return;
    }
    // Run the script to get the result.
    v8::Local<v8::Value> result;
    if (!script->Run(context).ToLocal(&result)) {

        // if exception was thrown and it is string exception, clear stack_trace_buffer
        // because it cannot possibly be accurate. This happens when you throw and
        // catch object Exception() and then throw string exception.
        bool b = try_catch.HasCaught();
        if (b) {
            v8::Local<v8::Value> ex = try_catch.Exception();
            if (ex->IsString()) {
                ars_clear(stack_trace_buffer);
            }
        }

        if (ars_count(stack_trace_buffer) > 0) {
            fprintf(stderr, "%s\n", stack_trace_buffer->items[0]);
        } else {
            check_exception(isolate, &try_catch, "PLACE_2", filename, true);
        }

        if (exit_code == 0) {
            exit_code = EXIT_UNCAUGHT_EXCEPTION;
        }
        return;
    } else {
        // Here result from script can be processed, not needed in ngspicejs
        assert(!try_catch.HasCaught());
    }
    // Convert the result to an UTF8 string and print it.
    //v8::String::Utf8Value utf8(isolate, result);
    //printf("%s\n", *utf8);
}
