// Return version of JS engine

void js_v8_version(const v8::FunctionCallbackInfo<v8::Value>& args) {
    // Return version of JS engine
    assert_arguments_length(args, 0, 0, (char*)"v8_version()");
    args.GetReturnValue().Set(
        v8::String::NewFromUtf8(args.GetIsolate(), v8::V8::GetVersion())
    );
}

