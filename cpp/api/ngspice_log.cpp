// Return ngspice log messages (normally printed to stdout and stderr)

void js_ngspice_log(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Return ngspice log messages (normally printed to stdout and stderr)
    assert_arguments_length(args, 0, 0, (char*)"ngspice_log()");
    if (!simple_ngspice_context) {
        fatal_msg_stack(globalIsolate, EXIT_WRONG_ORDER, "ngspice_log() was called before ngspice_init()");
        exit(EXIT_UNREACHABLE);
    }

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // convert ctx.log to js array of strings
    size_t count = ars_count(simple_ngspice_context->log);
    v8::Handle<v8::Array> a = v8::Array::New(iso, count);
    // iterate over log
    Ars *p = simple_ngspice_context->log;
    for (size_t i = 0; i < count; i++) {
        a->Set(i, v8::String::NewFromUtf8(iso, ars_nth(p, i)));
    }
    // clear log
    ars_clear(simple_ngspice_context->log);
    // return
    args.GetReturnValue().Set(a);
}

void js_ngspice_clear_log(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Clear log (sometimes it is not needed and it would slow down)
    if (!simple_ngspice_context) {
        fatal_msg_stack(globalIsolate, EXIT_WRONG_ORDER, "ngspice_log() was called before ngspice_init()");
        exit(EXIT_UNREACHABLE);
    }
    ars_clear(simple_ngspice_context->log);
}
