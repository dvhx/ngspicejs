// Include other JS file in current script

void js_include_global(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Include other JS file in current script
    assert_arguments_length(args, 1, 1, "include_global(filename)");
    assert_string(args, args[0], (char*)"filename", (char*)"include_global(filename)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get filename
    v8::String::Utf8Value s(iso, args[0]);
    const char *fn = ToCString(s);

    // check if file exists
    if (!system_file_exists(fn)) {
        fatal_msg_stack(iso, EXIT_ARGS, "include_global(filename) file '%s' does not exists!", fn);
        exit(EXIT_UNREACHABLE);
    }

    // read file
    size_t fs;
    gchar *contents = system_file_read(fn, &fs, "include_global", iso);

    // disable hashbang
    if (fs >= 2 && contents[0] == '#' && contents[1] == '!') {
        contents[0] = '/';
        contents[1] = '/';
    }

    // wrap it in anon function
    gchar *wrapped = (gchar*)malloc(fs + 5000 * sizeof(char));
    sprintf(wrapped, "(function () {%s\n}())", contents);

    // set globalThis.exports to null (so that we can detect if included function did not export anything)
    v8::Local<v8::Context> context = iso->GetCurrentContext();
    v8::Local<v8::String> sExports = v8::String::NewFromUtf8(iso, "exports", v8::NewStringType::kNormal).ToLocalChecked();
    if (!globalContext->Global()->Set(
        context,
        sExports,
        v8::Null(iso)
    ).FromMaybe(false)) {
        std::cerr << "error: failed to set exports in js_include_global(...)" << std::endl;
        exit(EXIT_MODERN);
    }

    // evaluate it
    include_js_code(globalContext, iso, wrapped, fn, fn);

    // set return value to globalThis.exports
    v8::Local<v8::Value> exports;
    if (!globalContext->Global()->Get(context, sExports).ToLocal(&exports)) {
        std::cerr << "error: failed to get exports in js_include_global(...)" << std::endl;
        exit(EXIT_MODERN);
    }
    if (!exports->IsObject() || exports->IsNull()) {
        fatal_msg_stack(iso, EXIT_INCLUDE_MISSING_EXPORTS, "include(%s) - included file did not set globalThis.exports = {mathods,to,export};\n", fn);
        exit(EXIT_UNREACHABLE);
    }
    args.GetReturnValue().Set(exports);

    g_free(contents);
    g_free(wrapped);

    // NOTE: the only reason for 2 functions (include_global, include) is because
    // I don't know how to make V8 function that would return JS object like globalThis.exports
}
