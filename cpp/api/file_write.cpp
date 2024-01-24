// Save data to file

void system_file_write(const gchar *filename, const gchar *data, v8::Isolate *isolate) {
    // Save data to file
    if (data == NULL) {
        fatal_msg_stack(isolate, EXIT_INTERNAL, "incorrect internal call of system_file_write() function, missing 2nd parameter of file_write('%s', data)", filename);
        exit(EXIT_UNREACHABLE);
    }
    // get data size
    size_t size = strlen(data);
    // check if path exists
    gchar *path = g_path_get_dirname(filename);
    if (g_strcmp0(path, ".") != 0) {
        if (!g_file_test(path, G_FILE_TEST_IS_DIR)) {
            char *s = string_format("file_write(path, data) attempted to write %zu bytes to file %s", size, filename);
            ars_add(hint_buffer, s);
            // "s" should be freed but we never test leaks in failing tests so it's ok
            fatal_msg_stack(isolate, EXIT_FILE, "directory '%s' not found", path);
            exit(EXIT_UNREACHABLE);
        }
    }
    g_free(path);    

    // we put some arbitrary limit on file size (e.g. 250 MB)
    if ((size < 0) || (size > FILE_SIZE_LIMIT) ) {
        fatal_msg_stack(isolate, EXIT_FILE, "file '%s' size is %ld which exceeds internal file size limit %ld", filename, size, FILE_SIZE_LIMIT);
        exit(EXIT_UNREACHABLE);
    }

    // if file exists, check if it is regular file
    if (g_file_test(filename, G_FILE_TEST_EXISTS)) {
        struct stat st;
        if (stat(filename, &st) != 0) {
            fatal_msg_stack(isolate, EXIT_FILE, "cannot stat file '%s'", filename);
            exit(EXIT_UNREACHABLE);
        }
        // must be regular file (not directory)
        if (!((st.st_mode & S_IFMT) & S_IFREG)) {
            fatal_msg_stack(isolate, EXIT_FILE, "file '%s' is not a regular file", filename);
            exit(EXIT_UNREACHABLE);
        }
        // Check access
        if (access(filename, W_OK) != 0) {
            fatal_msg_stack(isolate, EXIT_FILE, "permission denied to write file '%s'", filename);
            exit(EXIT_UNREACHABLE);
        }
    }
    // write file contents
    if (!g_file_set_contents(filename, data, size, NULL)) {
        fatal_msg_stack(isolate, EXIT_FILE, string_format("cannot write file '%s'", filename));
        exit(EXIT_UNREACHABLE);
    }
}

void js_file_write(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Save data to file
    assert_arguments_length(args, 2, 2, (char*)"file_write(path,data)");
    assert_string(args, args[0], (char*)"path", (char*)"file_write(path,data)");
    assert_simple_type(args, args[1], (char*)"data", (char*)"file_write(path,data)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get filename
    v8::String::Utf8Value s0(iso, args[0]);
    const char *fn = ToCString(s0);

    // get data 
    v8::String::Utf8Value s1(iso, args[1]);
    const char *data = ToCString(s1);

    // write filename
    system_file_write(fn, data, iso);

    //free(data);
    //free(fn);
}

