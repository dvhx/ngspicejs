// beep (frequency, duration_ms)

void js_beep(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // beep (frequency, duration_ms)
    assert_arguments_length(args, 0, 2, (char*)"beep(frequency, milliseconds)");
    if (args.Length() >= 1) {
        assert_number(args, args[0], (char*)"frequency", (char*)"beep(frequency, milliseconds)");
    }
    if (args.Length() >= 2) {
        assert_number(args, args[1], (char*)"milliseconds", (char*)"beep(frequency, milliseconds)");
    }

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // frequency
    v8::String::Utf8Value str0(iso, args[0]);
    const char *cstr0 = ToCString(str0);
    int f = atoi(cstr0);
    if (f == 0) {
        f = 440;
    }

    // duration
    v8::String::Utf8Value str1(iso, args[1]);
    const char *cstr1 = ToCString(str1);
    int d = atoi(cstr1);
    if (d == 0) {
        d = 300;
    }

    // check arguments for bad values
    if (f < 16 || f > 20000) {
        fatal_msg_stack(iso, EXIT_ARGS, "beep(frequency=%d,milliseconds=%d) - frequency must be between 16 and 20000 Hz\n", f, d);
        exit(EXIT_UNREACHABLE);
    }
    if (d < 1 || d > 65535) {
        fatal_msg_stack(iso, EXIT_ARGS, "beep(frequency=%d,milliseconds=%d) - duration must be between 1 and 65535 ms\n", f, d);
        exit(EXIT_UNREACHABLE);
    }

    // actual beep
    beep(f, d);
};

