// Set ngspice netlist

void js_ngspice_netlist(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Set ngspice netlist
    assert_arguments_length(args, 1, 1, (char*)"ngspice_netlist(code)");
    assert_string(args, args[0], (char*)"code", (char*)"ngspice_netlist(code)");
    if (!simple_ngspice_context) {
        fatal_msg_stack(globalIsolate, EXIT_WRONG_ORDER, "ngspice_netlist(code) was called before ngspice_init()");
        exit(EXIT_UNREACHABLE);
    }

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // code
    v8::String::Utf8Value str(iso, args[0]);
    const char *cstr = ToCString(str);

    // upload netlist
    bool b = simple_ngspice_netlist(simple_ngspice_context, (char*)cstr);

    // return true on success
    args.GetReturnValue().Set(v8::Boolean::New(iso, b));
}
