// Print raw string (without EOL, no flushing)

void js_echo_raw(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Print raw string (without EOL, no flushing)
    echo_progress_hide();
    assert_arguments_length(args, 1, 1, (char*)"echo_raw(string)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get string
    v8::String::Utf8Value str(iso, args[0]);
    const char *cstr = ToCString(str);

    // print it
    fprintf(echo_stream_id, "%s", cstr);

    // check for echo trap
    if (echo_trap != NULL) {
        if (strstr(cstr, echo_trap)) {
            fprintf(echo_stream_id, "\n");
            fflush(echo_stream_id);
            fatal_msg_stack(iso, EXIT_ECHO_TRAP, "echo_trap was triggered by '%s'", echo_trap);
            exit(EXIT_UNREACHABLE);
        }
    }
};
