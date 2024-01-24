// Print arguments to stdout separated by space

void js_echo(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Print arguments to stdout separated by space
    echo_progress_hide();

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // If trap is set, convert all arguments to string and check the trap
    if (echo_trap != NULL) {
        ars_clear(js_echo_buffer);
        for (int i = 0; i < args.Length(); i++) {
            v8::String::Utf8Value str(iso, args[i]);
            const char *cstr = ToCString(str);
            ars_add(js_echo_buffer, (char*)cstr);
        }
        ars_join(js_echo_buffer, (char*)" ");
        char *line = ars_first(js_echo_buffer);
        if (strstr(line, echo_trap)) {
            fprintf(echo_stream_id, "\n");
            fflush(echo_stream_id);
            fatal_msg_stack(iso, EXIT_ECHO_TRAP, "echo_trap was triggered by '%s'", echo_trap);
            exit(EXIT_UNREACHABLE);
        }
        fprintf(echo_stream_id, "%s\n", line);
        fflush(echo_stream_id);
        ars_clear(js_echo_buffer);
        return;
    }

    // Print all arguments normally
    for (int i = 0; i < args.Length(); i++) {
        if (i != 0) {
            fprintf(echo_stream_id, " ");
        }
        v8::String::Utf8Value str(iso, args[i]);
        const char *cstr = ToCString(str);
        fprintf(echo_stream_id, "%s", cstr);
    }
    fprintf(echo_stream_id, "\n");
    fflush(echo_stream_id);
};

