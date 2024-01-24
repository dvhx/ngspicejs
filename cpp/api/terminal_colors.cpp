// Return true if output supports colors (terminal) and false if not (non-color terminal or output to a file)

void js_terminal_colors(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Return true if output supports colors (terminal) and false if not (non-color terminal or output to a file)
    assert_arguments_length(args, 0, 0, (char*)"terminal_colors()");
    args.GetReturnValue().Set(v8::Boolean::New(args.GetIsolate(), isatty(1) && isatty(2)));
}

