// Add hint to the hint buffer

void js_hint(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Add single string to hint buffer, will be printed after next error
    assert_arguments_length(args, 1, 1, (char*)"hint(message)");
    assert_string(args, args[0], (char*)"message", (char*)"hint(message)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    v8::String::Utf8Value str(iso, args[0]);
    const char *cstr = ToCString(str);
    ars_add(hint_buffer, (char*)cstr);
};

void js_hint_buffer(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Return content of hint buffer as an array and clear it
    assert_arguments_length(args, 0, 0, (char*)"hint_buffer()");

    v8::HandleScope handle_scope(args.GetIsolate());
    v8::Isolate *iso = args.GetIsolate();

    // empty buffer returns empty array
    if (ars_count(hint_buffer) == 0) {
        v8::Handle<v8::Array> b = v8::Array::New(iso, 0);
        args.GetReturnValue().Set(b);
        return;
    }

    // convert buffer to array
    v8::Handle<v8::Array> a = v8::Array::New(iso, ars_count(hint_buffer));
    for (size_t i = 0; i < ars_count(hint_buffer); i++) {
        v8::Local<v8::String> s = v8::String::NewFromUtf8(iso, ars_nth(hint_buffer, i), v8::NewStringType::kNormal).ToLocalChecked();
        if (!a->Set(iso->GetCurrentContext(), i, s).FromMaybe(false)) {
          std::cerr << "error: js_hint_buffer(args) failed to set the value in the array" << std::endl;
          exit(EXIT_MODERN);
        }
    }
    args.GetReturnValue().Set(a);

    // clear buffer
    ars_clear(hint_buffer);
}
