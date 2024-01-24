// Return arguments of the script executed by ngspicejs

void js_script_args(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Return arguments of the script executed by ngspicejs
    assert_arguments_length(args, 0, 0, (char*)"script_args()");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // v8 array for values
    #if defined(NGSPICEJS_LINT) || defined(NGSPICEJS_BEAUTIFY)
    v8::Handle<v8::Array> a = v8::Array::New(iso, arg_count - 1);
    for (int i = 1; i < arg_count; i++) {
        a->Set(i - 1, v8::String::NewFromUtf8(iso, arg_items[i]));
    }
    #else
    v8::Handle<v8::Array> a = v8::Array::New(iso, arg_count - arg_second_index - 1);
    for (int i = arg_second_index + 1; i < arg_count; i++) {
        a->Set(i - arg_second_index - 1, v8::String::NewFromUtf8(iso, arg_items[i]));
    }
    #endif

    args.GetReturnValue().Set(a);
}

