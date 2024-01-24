// When something fail print hints to help user fix error, hints are buffered unprinted and printed after first error

void hint_buffer_print() {
    // Print and clear hint buffer
    if (ars_count(hint_buffer) == 0) {
        return;
    }
    for (size_t i = 0; i < ars_count(hint_buffer); i++) {
        fprintf(stderr, "%s%s\n", color_prefix_hint_stderr, ars_nth(hint_buffer, i));
    }
    fprintf(stderr, "\n");
    ars_clear(hint_buffer);
}

void hint_args(const char *function_name, const v8::FunctionCallbackInfo < v8::Value > &args) {
    // When something fail print hints to help user fix error

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    ars_add(hint_buffer, string_format("function '%s' was called with %d arguments", function_name, args.Length()));

    int i;
    for (i = 0; i < args.Length(); i++) {
        // value
        v8::String::Utf8Value s(iso, args[i]);
        const char *c = ToCString(s);
        // type
        if (args[i]->IsArray()) {
            ars_add(hint_buffer, string_format("argument #%d was %s (array)", i, c));
        } else {
            v8::String::Utf8Value st(args.GetIsolate(), args[i]->TypeOf(iso));
            const char *ct = ToCString(st);
            ars_add(hint_buffer, string_format("argument #%d was %s (%s)", i, c, ct));
        }
    }
}

