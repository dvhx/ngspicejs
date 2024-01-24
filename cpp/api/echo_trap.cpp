// Set a "trap" string that will break script execution if "trap" string is printed using any echo function

void js_echo_trap(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Set a "trap" string that will break script execution if "trap" string is printed using any echo function
    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);
    // get trap string
    v8::String::Utf8Value str(iso, args[0]);
    echo_trap = strdup(ToCString(str));
    // multiline traps are not supported
    if (strstr(echo_trap, "\n")) {
        fatal_msg_stack(iso, EXIT_WRONG_ORDER, "echo_trap(string) does not support multiline traps: '%s'", echo_trap);
        exit(EXIT_UNREACHABLE);
    }
};


