// Exit program with given numerical exit code, without argument return current exit code
// Reserved exit codes are in cpp/v8/fatal.h

void js_exit_code(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Exit program with given numerical exit code, without argument return current exit code
    // Reserved exit codes are in cpp/v8/fatal.h
    echo_progress_hide();
    assert_arguments_length(args, 0, 1, (char*)"exit_code(code)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // If no arguments are given, return current exit code
    if (args.Length() == 0) {
        args.GetReturnValue().Set(v8::Number::New(iso, exit_code));
        return;
    }

    // single argument is exit code
    assert_integer(args, args[0], (char*)"code", (char*)"exit_code(code)");

    // exit code
    v8::Maybe<uint32_t> maybe_uint = args[0]->Uint32Value(globalContext);
    if (maybe_uint.IsJust()) {
        uint32_t i = maybe_uint.FromJust();
        exit_code = i;
        return;
    }
    fprintf(stderr, "error: exit_code(...) this should not happen\n");
}
