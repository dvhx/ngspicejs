// Show rotating bar as indicator that some work is being done

void js_echo_progress(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Show rotating bar as indicator that some work is being done
    // don't show more than once a 100ms so that it can be used in hot loops
    if (terminal_colors_disabled) {
        return;
    }
    struct timespec end;
    clock_gettime(CLOCK_MONOTONIC_RAW, &end);
    uint64_t delta_us = (end.tv_sec - js_echo_progress_timespec.tv_sec) * 1000000 + (end.tv_nsec - js_echo_progress_timespec.tv_nsec) / 1000;
    if (delta_us < 300000) {
        return;
    }
    js_echo_progress_timespec.tv_sec = end.tv_sec;
    js_echo_progress_timespec.tv_nsec = end.tv_nsec;
    // hide previous bar
    int n = js_echo_progress_value + 1;
    echo_progress_hide();
    js_echo_progress_value = n;
    // rotate bar
    if (js_echo_progress_value == 1) {
        printf("|");
    }
    if (js_echo_progress_value == 2) {
        printf("/");
    }
    if (js_echo_progress_value == 3) {
        printf("-");
    }
    if (js_echo_progress_value == 4) {
        printf("\\");
        js_echo_progress_value = 1;
    }
    fflush(echo_stream_id);
};


