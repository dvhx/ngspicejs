// Save JS stack trace into a buffer for later use in CPP
// This is called when JS code is about to fail and we need to leave JS code
// and transition to CPP code but in the CPP code the JS stack trace would
// no longer be available or accurate.

void js_buffered_stack_trace_clear(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Clear stack trace buffer
    ars_clear(stack_trace_buffer);
}

void js_buffered_stack_trace(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Save JS stack trace into a buffer for later use
    echo_progress_hide();

    assert_arguments_length(args, 0, 1, (char*)"buffered_stack_trace(optional_message)");
    if (args.Length() > 0) {
        assert_string(args, args[0], (char*)"message", (char*)"buffered_stack_trace(optional_message)");
    }

    v8::Isolate *isolate = args.GetIsolate();
    v8::HandleScope handle_scope(isolate);

    // clear previous stack traces
    ars_clear(stack_trace_buffer);

    // add first frame
    if (args.Length() > 0) {
        // Print stack trace with optional message
        v8::String::Utf8Value str(args.GetIsolate(), args[0]);
        const char *cstr = ToCString(str);
        v8_buffered_stack_trace(isolate, true, cstr);
    } else {
        // Print stack trace without optional message
        v8_buffered_stack_trace(isolate, true, NULL);
    }

    // add hint buffer
    for (size_t i = 0; i < ars_count(hint_buffer); i++) {
        ars_add(stack_trace_buffer, color_prefix_hint_stderr);
        ars_add(stack_trace_buffer, ars_nth(hint_buffer, i));
        ars_add(stack_trace_buffer, (char*)"\n");
    }
    ars_add(stack_trace_buffer, (char*)"\n");
    //ars_debug(stack_trace_buffer);
    //ars_clear(stack_trace_buffer);

    // add the rest of the stack trace
    v8_buffered_stack_trace(isolate, false, NULL);

    // indicate that it was called
    js_stack_trace_called = true;
}

