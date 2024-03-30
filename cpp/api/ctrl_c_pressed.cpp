// Handle Ctrl+C

bool ctrl_c_managed = false;
bool ctrl_c_pressed = false;

void ctrl_c_handler(int signal) {
    // Handler for SIGINT (ctrl+c)
    if (ctrl_c_pressed) {
        printf("\nSecond Ctrl+C have terminated ngspicejs!\n");
        printf("exit(21)\n");
        fflush(stdout);
        _exit(EXIT_CTRL_C_IMMEDIATE);
    }
    ctrl_c_pressed = true;
}

void js_ctrl_c_pressed(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // On first call set the Ctrl+C signal handler and return true if Ctrl+C was pressed
    assert_arguments_length(args, 0, 0, (char*)"ctrl_c_pressed()");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    if (!ctrl_c_managed) {
        ctrl_c_managed = true;
        signal(SIGINT, ctrl_c_handler);
    }

    args.GetReturnValue().Set(v8::Boolean::New(iso, ctrl_c_pressed));
}

void js_ctrl_c_reset(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Reset the indicator that ctrl+c was pressed, this allows you to use ctrl+c multiple times or exit on second ctrl+c
    assert_arguments_length(args, 0, 0, (char*)"ctrl_c_reset()");
    ctrl_c_pressed = false;
}

