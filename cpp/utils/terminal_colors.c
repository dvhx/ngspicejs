// Disable colors if stdout or stderr is not a terminal

void terminal_colors_disable() {
    // Disable colors if stdout or stderr is not a terminal
    if (!isatty(1) || !isatty(2)) {
        terminal_colors_disabled = true;
        color_prefix_hint_stderr = (char*)"hint: ";
        color_prefix_warn_stderr = (char*)"warn: ";
        color_prefix_error_stderr = (char*)"error: ";
        color_filename_stderr = (char*)"";
        color_line_stderr = (char*)"";
        color_reset_stderr = (char*)"";
        color_arrow_stderr = (char*)"";
        color_clear_screen = (char*)"";
    }
}
