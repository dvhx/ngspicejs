// Highlight error in core library

void core_library_highlight(Saos *lines, Saos *files, Saoi *offsets, int line, int col, const char* function_name) {
    // Highlight error in core library
    //printf("core_library_highlight() line=%d col=%d\n", line, col);

    // find offset
    size_t file = 0;
    int off = 0;
    size_t f;
    int o;
    for (f = saoi_length(offsets) - 1; f > 0; f--) {
        o = saoi_nth(offsets, f);
        if (line >= o) {
            file = f;
            off = o;
            break;
        }
    }

    // print offending line
    //fprintf(stderr, "  [%s:%d:%d] or [core.js:%d:%d] in %s()\n", saos_nth(files, file), line - off, col, line, col, function_name);
    ars_add(stack_trace_buffer, (char*)"  [");
    ars_add(stack_trace_buffer, color_filename_stderr);
    ars_add(stack_trace_buffer, saos_nth(files, file));
    ars_add(stack_trace_buffer, color_reset_stderr);
    ars_add(stack_trace_buffer, (char*)":");
    ars_add(stack_trace_buffer, color_line_stderr);
    ars_add_int(stack_trace_buffer, arg_zero_stack ? 0 : (line - off));
    ars_add(stack_trace_buffer, color_reset_stderr);
    ars_add(stack_trace_buffer, (char*)":");
    ars_add_int(stack_trace_buffer, arg_zero_stack ? 0 : col);
    ars_add(stack_trace_buffer, (char*)", core.js:");
    ars_add_int(stack_trace_buffer, arg_zero_stack ? 0 : line);
    ars_add(stack_trace_buffer, (char*)":");
    ars_add_int(stack_trace_buffer, arg_zero_stack ? 0 : col);
    ars_add(stack_trace_buffer, (char*)"] in ");
    ars_add(stack_trace_buffer, (char*)function_name);
    ars_add(stack_trace_buffer, (char*)"()\n");
    // code
    char *s1 = saos_nth(lines, line);
    size_t len1 = strlen(s1);
    char *s2 = ltrim(s1);
    size_t len2 = strlen(s2);
    //fprintf(stderr, "    %s\n", s2);
    ars_add(stack_trace_buffer, (char*)"    ");
    ars_add(stack_trace_buffer, s2);
    ars_add(stack_trace_buffer, (char*)"\n");
    // arrow
    //fprintf(stderr, "    ");
    ars_add(stack_trace_buffer, (char*)"    ");
    for (size_t i = 0; i < col - (len1 - len2); i++) {
        //fprintf(stderr, " ");
        ars_add(stack_trace_buffer, (char*)" ");
    };
    //fprintf(stderr, "^\n");
    ars_add(stack_trace_buffer, (char*)"^\n");
    //printf("offending file = %s\n", saos_nth(files, file));
    //printf("offending code = %s\n", saos_nth(lines, line));
    //printf("offending line = %d (absolute %d)\n", line - off, line);
    //printf("offending col = %d\n", col);
    //printf("\n");
}
