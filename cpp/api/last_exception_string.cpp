// Get last exception, used in before_exit() to find similar function names

void js_last_exception_string(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Get last exception, used in before_exit()
    assert_arguments_length(args, 0, 0, (char*)"last_exception_string()");

    // set return value
    if (last_exception_string == NULL) {
        args.GetReturnValue().Set(LocalValueNewFromUtf8(args.GetIsolate(), ""));
    } else {
        args.GetReturnValue().Set(LocalValueNewFromUtf8(args.GetIsolate(), last_exception_string));
    }
}

