// Clear screen

void js_clear_screen(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Clear screen
    assert_arguments_length(args, 0, 0, (char*)"clear_screen()");
    printf("%s", color_clear_screen);
    fflush(stdout);
    fflush(stderr);
}


