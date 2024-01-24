// Return true if file exists

void js_file_exists(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Return true if file exists
    assert_arguments_length(args, 1, 1, (char*)"file_exists(path)");
    assert_string(args, args[0], (char*)"path", (char*)"file_exists(path)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get filename
    v8::String::Utf8Value s(iso, args[0]);
    const char *fn = ToCString(s);

    // check if file exists
    gboolean b = system_file_exists(fn);

    // return
    args.GetReturnValue().Set(v8::Boolean::New(iso, b));
}

