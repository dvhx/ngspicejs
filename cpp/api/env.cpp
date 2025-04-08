// Return value of environment variable, e.g. HOME

void js_env(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Return value of environment variable, e.g. HOME
    assert_arguments_length(args, 1, 1, (char*)"env(variable)");

    // variable name
    v8::String::Utf8Value name(args.GetIsolate(), args[0]);
    const char *a = ToCString(name);

    // get value
    const char* b = secure_getenv(a);
    if (!b) {
        return;
    }

    // set return value
    v8::Local<v8::String> s = v8::String::NewFromUtf8(globalIsolate, b, v8::NewStringType::kNormal).ToLocalChecked();
    args.GetReturnValue().Set(s);
}

