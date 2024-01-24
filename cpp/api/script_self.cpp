// Return path to the script itself

void js_script_self(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Return path to the script itself
    assert_arguments_length(args, 0, 0, (char*)"script_self()");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    args.GetReturnValue().Set(v8::String::NewFromUtf8(iso, arg_second));
};

