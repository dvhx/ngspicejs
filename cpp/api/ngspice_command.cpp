// Execute ngspice command

void js_ngspice_command_verbose(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Make ngspice_command verbose or not
    assert_arguments_length(args, 1, 1, (char*)"ngspice_command_verbose(boolean)");
    assert_boolean(args, args[0], (char*)"code", (char*)"ngspice_command_verbose(boolean)");

    v8::Local<v8::Value> a0 = args[0];
    v8::Local<v8::Boolean> b0 = a0->ToBoolean(args.GetIsolate());

    verbose_ngspice_command = b0->Value();
}

void js_ngspice_command(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Execute ngspice command
    //printf("CALL: ngspice_command(s)\n");
    assert_arguments_length(args, 1, 1, (char*)"ngspice_command(code)");
    assert_string(args, args[0], (char*)"code", (char*)"ngspice_command(code)");
    if (!simple_ngspice_context) {
        fatal_msg_stack(globalIsolate, EXIT_WRONG_ORDER, "ngspice_command(code) was called before ngspice_init()");
        exit(EXIT_UNREACHABLE);
    }

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get command
    v8::String::Utf8Value str(iso, args[0]);
    const char *cstr = ToCString(str);
    if (verbose_ngspice_command) {
        printf("ngspice_command: %s\n", cstr);
    }

    // execute command
    bool b = simple_ngspice_command(simple_ngspice_context, (char*)cstr);
    //printf("b=%s\n", b ? "true" : "false");

    // return true on success
    args.GetReturnValue().Set(v8::Boolean::New(iso, b));
}
