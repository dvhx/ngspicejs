// Wait given amount of milliseconds

void js_delay_ms(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Wait given amount of milliseconds
    assert_arguments_length(args, 1, 1, (char*)"delay_ms(milliseconds)");
    assert_number(args, args[0], (char*)"milliseconds", (char*)"delay_ms(milliseconds)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // milliseconds
    v8::String::Utf8Value str(iso, args[0]);
    const char *cstr = ToCString(str);
    useconds_t i = atoi(cstr);

    // wait
    usleep(1000 * i);
};

