// Return shell that executed the script (usually ngspicejs)

void js_script_shell(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Return shell that executed the script (usually ngspicejs)
    assert_arguments_length(args, 0, 0, (char*)"script_shell()");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    v8::Local<v8::String> s = v8::String::NewFromUtf8(iso, arg_first, v8::NewStringType::kNormal).ToLocalChecked();
    args.GetReturnValue().Set(s);
};

