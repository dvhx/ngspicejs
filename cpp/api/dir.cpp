// List directory contents, returns array of strings

void js_dir(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // List directory contents, returns array of strings
    assert_arguments_length(args, 1, 1, (char*)"dir(path)");
    assert_string(args, args[0], (char*)"path", (char*)"dir(path)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // path
    v8::String::Utf8Value s(args.GetIsolate(), args[0]);
    char *path = (char*)ToCString(s);

    // remove trailing slash
    if (path[strlen(path) - 1] == '/') {
        path[strlen(path) - 1] = '\0';
    }

    // check if path exists
    if (!system_file_exists(path)) {
        hint_args("dir(path)", args);
        fatal_msg_stack(iso, EXIT_FILE, "path '%s' not found, cannot list directory", path);
        exit(EXIT_UNREACHABLE);
    }

    // list directory contents
    GDir *dir = g_dir_open(path, 0, NULL);
    const gchar *name;
    Ars *p = ars();
    gchar *filename;
    while ( (name = g_dir_read_name(dir)) ) {
        // gchar *filename = g_build_filename(path, name, NULL); <-- this leaks too much
        filename = g_strconcat(path, "/", name, NULL);
        if (g_file_test(filename, G_FILE_TEST_IS_DIR)) {
            g_free(filename);
            filename = g_strconcat(path, "/", name, "/", NULL);
        }
        ars_add(p, filename);
        g_free(filename);
    }
    g_dir_close(dir);
    //ars_debug(p);

    // fill array with filenames
    v8::Handle<v8::Array> a = v8::Array::New(iso, ars_count(p));
    for (size_t i = 0; i < ars_count(p); i++) {
        a->Set(i, v8::String::NewFromUtf8(iso, ars_nth(p, i)));
    }
    ars_free(p);

    // set return value
    args.GetReturnValue().Set(a);
}

