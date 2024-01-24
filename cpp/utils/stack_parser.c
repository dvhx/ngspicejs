
char *str_create_substr(char *s, size_t start, size_t len) {
    // Return independent substring
    assert(start + len <= strlen(s));
    char *r = (char*)malloc(sizeof(char) * (len + 1));
    memcpy(r, &s[start], len);
    r[len] = '\0';
    return r;
}

int my_strpos(char *haystack, char *needle) {
    // Return position of a needle in a haystack, -1 if not found
    if (strlen(haystack) <= 0) {
        return -1;
    }
    if (strlen(needle) <= 0) {
        return -1;
    }
    char *p = strstr(haystack, needle);
    if (p != NULL) {
        return int(p - haystack);
    }
    return -1;
}

char *my_strdup(char *s) {
    // Return copy of a string
    assert(s);
    size_t len = strlen(s) + 1;
    char *n = (char*)malloc(len);
    return n ? (char*)memcpy(n, s, len) : NULL;
}

void stack_parser(const char *stack, bool only_first_user_error) {
    // Parse string stack trace and print it like other stack traces with highlighting

    // split stack by lines
    Ars *lines = ars();
    ars_add(lines, (char*)stack);
    ars_split_char(lines, '\n');
    //ars_debug(lines);

    // find exception string
    if (last_exception_string != NULL) {
        free(last_exception_string);
    }
    last_exception_string = my_strdup(ars_first(lines));
    //printf("last_exception_string=%s\n", last_exception_string);

    // only first frame?
    if (!only_first_user_error) {
        if ((ars_count(lines) - 1) > 0) {
           fprintf(stderr, "Stack trace (%zu frames, parsed):\n", ars_count(lines) - 1);
        }
    } else {
        // all frames
        char *f = ars_first(lines);
        int error_type_length = my_strpos(f, (char*)": ");
        if (error_type_length > 0) {
            error_type_length += 2;
        }
        char *msg = str_create_substr(f, error_type_length, strlen(f) - error_type_length);
        //printf("MSG=%s\n", msg);
        fprintf(stderr, "%s%s\n",  color_prefix_error_stderr, msg);
        free(msg);
    }

    // iterate over lines
    for (size_t i = 1; i < ars_count(lines); i++) {
        char *s = ars_nth(lines, i);
        // skip arrows
        //      --> starting at object with constructor 'Array'
        //      |     index 0 -> object with constructor 'Battery'
        //      --- property 'netlist_devices' closes the circle
        if (my_strpos(s, (char*)"-->") >= 0) {
            continue;
        }
        if (my_strpos(s, (char*)"|  ") >= 0) {
            continue;
        }
        if (my_strpos(s, (char*)"---") >= 0) {
            continue;
        }

        // split line to individual components
        //     at find_model (/home/username/ngspice-js/js/find_model.js:259:11)
        /*
        Error: Model FOO of kind DIODE not found!
            at find_model (/home/username/ngspice-js/js/find_model.js:259:11)
            at Diode.render (/home/username/ngspice-js/js/device/diode.js:101:13)
            at netlist_render2 (/home/username/ngspice-js/js/netlist_render2.js:64:49)
            at netlist_done (/home/username/ngspice-js/js/netlist_done.js:8:17)
            at Tran.run (/home/username/ngspice-js/js/analysis/tran.js:93:16)
            at ./diode_no_model.ngjs:8:8
        */
        // find last 2 semicolons
        off_t semi1 = 0, semi2 = 0;
        for (size_t j = strlen(s); j > 0; j--) {
            if (s[j] == ':') {
                //fprintf(stderr, "j=%zu c=%c\n", j, s[j]);
                if (semi2 == 0) {
                    semi2 = j;
                } else {
                    semi1 = j;
                    break;
                }
            }
        }
        // find row and col number
        int i_row;
        int i_col;
        //printf("semi1=%zu semi2=%zu\n", semi1, semi2);
        //printf("s=%s\n", s);
        if (semi1 == 0 && semi2 == 0) {
            i_row = 0;
            i_col = 0;
            fprintf(stderr, "  [%s%s%s:%s%d%s:%d] in %s()\n",
                color_filename_stderr, "<native code>", color_reset_stderr,
                color_line_stderr, 0, color_reset_stderr,
                0,
                "???"
            );
            fprintf(stderr, "  %s\n", s);
            fprintf(stderr, "      %s^%s\n", color_arrow_stderr, color_reset_stderr);
            //highlight_error_in_file(filename, i_row, i_col, "    ");
            continue;
        } else {
            //fprintf(stderr, "semi1=%zu semi2=%zu\n", semi1, semi2);
            char *row = str_create_substr(s, semi1 + 1, semi2 - semi1 - 1);
            if (!row) {
                fprintf(stderr, "  (row is null)\n");
            }
            i_row = atoi(row);
            free(row);
            //fprintf(stderr, "row='%s' = %d\n", row, i_row);
            // find col number
            char *col = str_create_substr(s, semi2 + 1, strlen(s) - semi2 - 1);
            i_col = atoi(col);
            //fprintf(stderr, "col='%s' = %d\n", col, i_col);
            free(col);
        }
        // find first occurance of ' ('
        size_t fstart = 0;
        for (size_t j = 0; j < strlen(s) - 1; j++) {
            //fprintf(stderr, "c1=%c c2=%c\n", s[j], s[j+1]);
            if (s[j] == ' ' && s[j + 1] == '(') {
                //fprintf(stderr, "fstart=%zu c=%c\n", j, s[j]);
                fstart = j;
            }
        }
        //fprintf(stderr, "fstart=%zu s=%s\n", fstart, s);

        // at Fft.run (eval at <anonymous> (/home/name/ngspice-js/js/0.js:28:5), <anonymous>:7652:41)
        if (strstr(s, "(eval at <anonymous>")) {
            fstart = my_strpos(s, (char*)"), ") + 1;
        }
        //printf("s=%s sl=%zu fstart=%zu a=%zu b=%zu\n", s, strlen(s), fstart, fstart + 2, semi1 - fstart - 2);

        // get filename
        char *filename = NULL;
        if (fstart > 0) {
            filename = str_create_substr(s, fstart + 2, semi1 - fstart - 2);
        } else {
            // anon function
            filename = str_create_substr(s, 7, semi1 - 7);
        }

        // remove trailing @
        //printf("FILENAME=%s last=%c\n", filename, filename[strlen(filename) - 1]);
        if (strstr(filename, ":")) {
            fprintf(stderr, "\ninternal error: cannot parse stack trace, printing it as is:\n\n---stack trace begin---\n%s\n---stack trace end---\n", stack);
            exit(1);
        }
        if (filename[strlen(filename) - 1] == '@') {
            filename[strlen(filename) - 1] = '\0';
        }

        // if <anonymous> and s contains 0.js then it is from core
        //printf("--filename=%s\n", filename);
        if (strcmp(filename, "<anonymous>") == 0) {
            core_library_highlight(core_lines, core_files, core_offsets, i_row - 1, i_col - 1, "\?\?\?()");
            ars_join(stack_trace_buffer, (char*)"");
            fprintf(stderr, "%s\n", ars_first(stack_trace_buffer));
            ars_clear(stack_trace_buffer);
            free(filename);
            continue;
        }

        // get filename without leading @
        bool is_internal = strstr(filename, "/ngspicejs/") ? true : false;

        //fprintf(stderr, "filename=%s\n", filename);
        // get function name
        char *fun = NULL;
        if (fstart > 0) {
            fun = str_create_substr(s, 7, fstart - 7);
        } else {
            fun = (char*)malloc(12 * sizeof(char));
            strcpy(fun, "<anonymous>");
        }

        //fprintf(stderr, "fun=%s\n", fun);
        //char *row =
        bool printed = false;
        if ((only_first_user_error && !is_internal) || (!only_first_user_error)) {
            printed = true;

            // skip EVAL_COMBINE_SOURCES:1:1
            if (strcmp(filename, "EVAL_COMBINE_SOURCES") == 0 && i_row == 1 && i_col == 1) {
                //fprintf(stderr, "skip %zu = %s\n", i, s);
                continue;
            }
            fprintf(stderr, "  [%s%s%s:%s%d%s:%d] in %s()\n",
                color_filename_stderr, basename(filename), color_reset_stderr,
                color_line_stderr, i_row, color_reset_stderr,
                i_col,
                fun
            );
            highlight_error_in_file(filename, i_row, i_col, "    ");
        }
        //fprintf(stderr, "fun=%s filename=%s row=%d col=%d\n", fun, filename, i_row, i_col);

        // free
        free(filename);
        free(fun);

        if (only_first_user_error && printed) {
            break;
        }
    }
    ars_free(lines);
    //printf("end of stack_parser(%zu,%d)\n", strlen(stack), only_first_user_error);
}
