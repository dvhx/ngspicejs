// Switch echo output stream between 1 (stdout) and 2 (stderr)

void js_echo_stream(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Switch echo output stream between 1 (stdout) and 2 (stderr)
    echo_progress_hide();
    assert_arguments_length(args, 1, 1, (char*)"echo_stream(int)");
    assert_integer(args, args[0], (char*)"int", (char*)"echo_stream(int)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // Get stream id
    v8::Maybe<uint32_t> maybe_uint = args[0]->Uint32Value(globalContext);
    if (!maybe_uint.IsJust()) {
        hint_args("echo_stream(int)", args);
        fatal_msg_stack(iso, EXIT_ARGS, "echo_stream(int) requires either number 1 or 2 as argument");
        exit(EXIT_UNREACHABLE);
    }
    uint32_t i = maybe_uint.FromJust();

    // switch stream
    if (i == 1) {
        if (echo_stream_id != stdout) {
            fflush(echo_stream_id);
        }
        echo_stream_id = stdout;
    } else if (i == 2) {
        if (echo_stream_id != stderr) {
            fflush(echo_stream_id);
        }
        echo_stream_id = stderr;
    } else {
        hint_args("echo_stream(int)", args);
        fatal_msg_stack(iso, EXIT_ARGS, "echo_stream(int) requires either 1 or 2 as argument");
        exit(EXIT_UNREACHABLE);
    }
}


