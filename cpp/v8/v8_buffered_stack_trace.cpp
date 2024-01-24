// Save stack trace into buffer (may or may not be used later)

void v8_buffered_stack_trace(v8::Isolate *isolate, bool only_first_user_error, const char *message) {
    // Save stack trace into buffer (may or may not be used later)
    //printf("CALL: buffered_stack_trace(isolate, %d)\n", only_first_user_error);
    auto stack = v8::StackTrace::CurrentStackTrace(isolate, 100);
    int frame_count = stack->GetFrameCount();
    int first_user_frame = -1;

    // add custom message
    if (message != NULL) {
        ars_add(stack_trace_buffer, color_prefix_error_stderr);
        ars_add(stack_trace_buffer, (char*)message);
        ars_add(stack_trace_buffer, color_reset_stderr);
        ars_add(stack_trace_buffer, (char*)"\n");
    }

    // printing entire stack
    if (!only_first_user_error) {
        if (frame_count > 0) {
            ars_add(stack_trace_buffer, (char*)"Stack trace (");
            ars_add_int(stack_trace_buffer, frame_count);
            ars_add(stack_trace_buffer, (char*)" frames):\n");
        }
    }

    // all frames
    for (int i = 0; i < frame_count; ++i) {
        auto frame = stack->GetFrame(isolate, i);

        // filename
        v8::String::Utf8Value script_name{isolate, frame->GetScriptName()};
        const char* script_name_cstr = ToCStringDefault(script_name, "<unknown source>");

        // get filename without leading @
        //bool is_internal = script_name_cstr[0] == '@';
        bool is_internal = strstr(script_name_cstr, "/ngspicejs/") ? true : false;
        char *filename_without_at = (char*)script_name_cstr;
        v8::Local<v8::String> fn = frame->GetFunctionName();
        v8::String::Utf8Value function_name{isolate, fn};
        const char* function_name_cstr = ToCStringDefault(function_name, "<anonymous>");
        if (strcmp(script_name_cstr, "<unknown source>") == 0) {
            is_internal = true;
        }

        // is this first user file?
        bool is_first_user_error = false;
        if (!is_internal && first_user_frame < 0) {
            first_user_frame = i;
            is_first_user_error = true;
            //printf("This file is first user file\n");
        }
        bool should_print = !only_first_user_error || (only_first_user_error && is_first_user_error);

        //printf("ofue=%d ifue=%d sp=%d\n", only_first_user_error, is_first_user_error, should_print);
        //printf("v8_buffered_stack_trace snc=%s\n", script_name_cstr);
        if (strcmp(script_name_cstr, "<unknown source>") == 0) {
            //printf("script_name_cstr=%s\n", script_name_cstr);
            //printf("len=%zu\n", saos_length(core_lines));
            if (should_print) {
                core_library_highlight(core_lines, core_files, core_offsets, frame->GetLineNumber() - 1, frame->GetColumn() - 1, function_name_cstr);
            }
            continue;
        }

        if (should_print) {
            ars_add(stack_trace_buffer, (char*)"  [");
            ars_add(stack_trace_buffer, color_filename_stderr);
            ars_add(stack_trace_buffer, basename(filename_without_at));
            ars_add(stack_trace_buffer, color_reset_stderr);
            ars_add(stack_trace_buffer, (char*)":");
            ars_add(stack_trace_buffer, color_line_stderr);
            ars_add_int(stack_trace_buffer, arg_zero_stack ? 0 : frame->GetLineNumber());
            ars_add(stack_trace_buffer, color_reset_stderr);
            ars_add(stack_trace_buffer, (char*)":");
            ars_add_int(stack_trace_buffer, arg_zero_stack ? 0 : frame->GetColumn());
            ars_add(stack_trace_buffer, (char*)"] in ");
            ars_add(stack_trace_buffer, (char*)function_name_cstr);
            ars_add(stack_trace_buffer, (char*)"()\n");

            if (system_file_exists(filename_without_at)) {
                // find offending line
                int trim = 0;
                char *line = offending_line(filename_without_at, frame->GetLineNumber(), &trim);
                char *arrow = offending_column(frame->GetColumn() - trim);
                // line
                ars_add(stack_trace_buffer, (char*)"    ");
                ars_add(stack_trace_buffer, line);
                ars_add(stack_trace_buffer, (char*)"\n");
                // column
                ars_add(stack_trace_buffer, (char*)"    ");
                ars_add(stack_trace_buffer, arrow);
                ars_add(stack_trace_buffer, (char*)"\n");
                free(line);
                free(arrow);
                /*
                highlight_error_in_file(
                    filename_without_at,
                    frame->GetLineNumber(),
                    frame->GetColumn(),
                    (char*)"    "
                );
                */
            } else {
                ars_add(stack_trace_buffer, (char*)"warn: cannot find file '");
                ars_add(stack_trace_buffer, filename_without_at);
                ars_add(stack_trace_buffer, (char*)"' to highlight error\n");
            }
        }
    }
    // convert everything to single string
    ars_join(stack_trace_buffer, (char*)"");
}
