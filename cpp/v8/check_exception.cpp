// Show details of unhandled exception and terminate program

#include <iostream>

void check_exception(v8::Isolate* isolate, v8::TryCatch* try_catch, const char *additional_message,
    const char *custom_filename, bool print_stack_property) {
    // Show details of unhandled exception and terminate program
    //printf("CE\n");
    //printf("  am=%s\n", additional_message);
    //printf("  cf=%s\n", custom_filename);
    //printf("  ps=%d\n", print_stack_property);

    // Most of the time there is no exception
    if (!try_catch->HasCaught()) {
        return;
    }

    if (exit_code == 0) {
        exit_code = EXIT_UNCAUGHT_EXCEPTION;
    }

    v8::HandleScope handle_scope(isolate);

    // get exception string
    v8::String::Utf8Value exception(isolate, try_catch->Exception());

    // convert it to c-string
    const char* exception_string = ToCString(exception);
    last_exception_string = my_strdup((char*)exception_string);
    //printf("last_exception_string=%s\n", last_exception_string);
    //printf("CE2 exception_string='%s'\n", exception_string);

    // soft exit by throwing "NGSPICEJS_SOFT_EXIT" exception from JS
    if (strcmp(exception_string, "NGSPICEJS_SOFT_EXIT") == 0) {
        soft_exit_triggered = true;
        return;
    }
    // hard exit by throwing "NGSPICEJS_HARD_EXIT" exception from JS
    if (strcmp(exception_string, "NGSPICEJS_HARD_EXIT") == 0) {
        printf("EXIT(%d)\n", EXIT_HARD);
        exit(EXIT_HARD);
        return;
    }

    // get message
    v8::Local<v8::Message> message = try_catch->Message();
    if (message.IsEmpty()) {
        // V8 didn't provide any extra information about this error; just print the exception.
        if (strlen(exception_string) > 0) {
            fprintf(stderr, "v8 error: %s\n", exception_string);
        }
    } else {
        // get extra details from message
        // Print (filename):(line number): (message).
        v8::String::Utf8Value filename(isolate, message->GetScriptOrigin().ResourceName());
        v8::Local<v8::Context> context(isolate->GetCurrentContext());
        const char* filename_string = ToCString(filename);

        // if not file assume core.js
        bool error_in_core = false;
        if (strcmp(filename_string, "undefined") == 0) {
            error_in_core = true;
            filename_string = "core.js"; // custom_filename;
        }

        // get line numbers
        int linenum = message->GetLineNumber(context).FromJust();
        int colnum = message->GetStartColumn(context).FromJust() + 1;
        //printf("linenum=%d colnum=%d\n", linenum, colnum);

        // show error in core.js
        if ((core_compiled && !core_evaluated) || error_in_core) {
            core_library_highlight(
                core_lines,
                core_files,
                core_offsets,
                linenum - 1,
                colnum - 1,
                "???"
            );
            ars_join(stack_trace_buffer, (char*)"");
            fprintf(stderr, "%s%s\n", color_prefix_error_stderr, exception_string);
            fprintf(stderr, "%s\n", ars_first(stack_trace_buffer));
            ars_clear(stack_trace_buffer);
        } else {
            // non core.js error

            // In special case when caught Exception() filled buffered stack trace and then string exception was the actual caught exception, force printing of error
            v8::Local<v8::Value> ex = try_catch->Exception();
            if (ex->IsString()) {
                js_stack_trace_called = false;
            }

            if (!js_stack_trace_called) {
                fprintf(stderr, "%s%s\n", color_prefix_error_stderr, exception_string);
                fprintf(stderr, "  [%s%s%s:%s%d%s:%d] in %s()\n",
                    color_filename_stderr,
                    filename_string,
                    color_reset_stderr,
                    color_line_stderr,
                    arg_zero_stack ? 0 : linenum,
                    color_reset_stderr,
                    arg_zero_stack ? 0 : colnum,
                    "???"
                );
                // highlight error
                if (system_file_exists(filename_string)) {
                    highlight_error_in_file(
                        filename_string,
                        linenum,
                        colnum,
                        (char*)"    "
                    );
                } else {
                    warn("cannot find file '%s' to highlight error", filename_string);
                }
                include_js_code(context, isolate, "if (typeof before_exit === 'function') { before_exit(); }", "before_exit.js", "before_exit.js");
            }
        }
    }
    hint_buffer_print();
    fprintf(stderr, "\n");

    // In some cases buffered stack trace is shallow but exception itself has deeper stack so print that instead
    if (print_stack_property) {
        v8::Local<v8::Value> ex = try_catch->Exception();
        if (ex->IsObject()) {
            v8::Local<v8::Object> obj = v8::Local<v8::Object>::Cast(ex);
            // Use v8::String for the key
            v8::Local<v8::String> key = v8::String::NewFromUtf8(globalIsolate, "stack", v8::NewStringType::kNormal).ToLocalChecked();
            // Get the property
            v8::Local<v8::Value> stack;
            if (obj->Get(globalIsolate->GetCurrentContext(), key).ToLocal(&stack)) {
              // Successfully retrieved the "stack" property
              // You can now use the `stack` variable
              if (stack->IsString()) {
                v8::String::Utf8Value s(globalIsolate, stack);
                const char *ss = ToCString(s);
                hint_buffer_print();
                stack_parser(ss, false);
              }
            } else {
              // Handle the case where "stack" property doesn't exist
              std::cerr << "error: Property 'stack' not found (when trying to print better stack)" << std::endl;
              exit(EXIT_MODERN);
            }
        }
    }

    return;
}
