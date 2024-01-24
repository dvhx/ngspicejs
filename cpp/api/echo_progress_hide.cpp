// Hide progress indicator if it was shown (called automatically by all echo functions)

void echo_progress_hide() {
    // Hide progress indicator if it was shown (called automatically by all echo functions)
    if (terminal_colors_disabled) {
        return;
    }
    if (js_echo_progress_value > 0) {
        printf("\b");
        js_echo_progress_value = 0;
    }
};


