// Exit codes and functions

void fatal(int exit_code) {
    // Exit with given exit code
    fprintf(stderr, "exit(%d)\n", exit_code);
    hint_buffer_print();
    // free v8 stuff
    //globalIsolate->Dispose();
    //v8::V8::Dispose();
    exit(exit_code);
}

void fatal_msg_stack(v8::Isolate *isolate, int exit_code, const char *msg, ...) {
    // Print stack and custom error message and exit with given exit code

    // C is a primitive and stupid language
    // https://stackoverflow.com/questions/75736525/stdarg-h-formating-string-via-snprintf-not-working-arguments-are-ignored
    va_list args,copy;
    va_start(args, msg);
    va_copy(copy, args);
    size_t len = vsnprintf(NULL, 0, msg, args);
    char *s;
    if (len > 0) {
        s = (char*)malloc(len + 1);
        if (s) {
            vsnprintf(s, len + 1, msg, copy);
        } else {
            fprintf(stderr, "error: failed to allocate %ld chars to format error message: %s\n", len + 1, msg);
            exit(1);
        }
    }
    va_end(args);
    va_end(copy);

    // first frame of stack trace
    v8_buffered_stack_trace(isolate, true, s);
    ars_join(stack_trace_buffer, (char*)"");
    fprintf(stderr, "%s\n", ars_first(stack_trace_buffer));
    ars_clear(stack_trace_buffer);
    //free(s);

    // hint buffer
    hint_buffer_print();

    // remaining frames of stack trace
    v8_buffered_stack_trace(isolate, !true, NULL);
    ars_join(stack_trace_buffer, (char*)"");
    fprintf(stderr, "%s\n", ars_first(stack_trace_buffer));
    ars_clear(stack_trace_buffer);

    // exit
    fprintf(stderr, "exit(%d)\n", exit_code);
    exit(exit_code);
}

void fatal_msg(int exit_code, const char *msg, ...) {
    // Print formatted message but no stack

    // formated error message
    fprintf(stderr, "%s", color_prefix_error_stderr);
    va_list args;
    va_start(args, msg);
    vfprintf(stderr, msg, args);
    va_end(args);
    fprintf(stderr, "\n");

    // hint buffer
    hint_buffer_print();

    // exit
    fprintf(stderr, "exit(%d)\n", exit_code);
    exit(exit_code);
}

