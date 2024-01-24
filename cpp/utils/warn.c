// Show formated warning

void warn(const char *fmt, ...) {
    // Show formated warning
    fprintf(stderr, "%s", color_prefix_warn_stderr);
    va_list args;
    va_start(args, fmt);
    vfprintf(stderr, fmt, args);
    va_end(args);
    fprintf(stderr, "\n");
}

