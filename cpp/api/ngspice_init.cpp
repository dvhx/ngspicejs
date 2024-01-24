// Initialize ngspice context

void js_ngspice_init(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Initialize ngspice context
    assert_arguments_length(args, 0, 0, (char*)"ngspice_init()");
    if (simple_ngspice_context != NULL) {
        fatal_msg_stack(globalIsolate, EXIT_WRONG_ORDER, "ngspice_init() can only be called once");
        exit(EXIT_UNREACHABLE);
    }
    simple_ngspice_context = simple_ngspice_init();
};

