// Quit ngspice

void js_ngspice_quit(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Quit ngspice
    assert_arguments_length(args, 0, 0, (char*)"ngspice_quit()");
    if (!simple_ngspice_context) {
        fatal_msg_stack(globalIsolate, EXIT_NGSPICE, "ngspice_quit() was called before ngspice_init()");
        exit(EXIT_UNREACHABLE);
    }
    simple_ngspice_quit(simple_ngspice_context);
};




