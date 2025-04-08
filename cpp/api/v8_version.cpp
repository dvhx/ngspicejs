// Return version of JS engine

void js_v8_version(const v8::FunctionCallbackInfo<v8::Value>& args) {
    // Return version of JS engine
    assert_arguments_length(args, 0, 0, (char*)"v8_version()");
    v8::Isolate *iso = args.GetIsolate();
    args.GetReturnValue().Set(LocalValueNewFromUtf8(iso, v8::V8::GetVersion()));
}

