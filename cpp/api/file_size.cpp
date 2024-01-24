// Return size of a file

size_t system_file_size(const gchar *filename, const char *called_by_function, v8::Isolate *isolate) {
    // Return size of a file

    // check if file exists
    if (!g_file_test(filename, G_FILE_TEST_EXISTS)) {
        fatal_msg_stack(isolate, EXIT_FILE, "file not found '%s' (in function %s)", filename, called_by_function);
        exit(EXIT_UNREACHABLE);
    }

    struct stat st;

    // get file attributes
    if (stat(filename, &st) != 0) {
        fatal_msg_stack(isolate, EXIT_FILE, "cannot stat file '%s' (in function %s)", filename, called_by_function);
        exit(EXIT_UNREACHABLE);
    }

    // Check access
    if (access(filename, R_OK) != 0) {
        fatal_msg_stack(isolate, EXIT_FILE, "permission denied to read file '%s' (in function %s)", filename, called_by_function);
        exit(EXIT_UNREACHABLE);
    }

    // must be regular file (not a directory)
    if (!((st.st_mode & S_IFMT) & S_IFREG)) {
        fatal_msg_stack(isolate, EXIT_FILE, "not a regular file '%s' (in function %s)", filename, called_by_function);
        exit(EXIT_UNREACHABLE);
    }

    // empty file should return empty string
    return st.st_size;
}

void js_file_size(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // return size of a file
    assert_arguments_length(args, 1, 1, (char*)"file_size(path)");
    assert_string(args, args[0], (char*)"path", (char*)"file_size(path)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get filename
    v8::String::Utf8Value s(iso, args[0]);
    const char *fn = ToCString(s);

    // get file size
    size_t sz = system_file_size(fn, "file_size(path)", iso);

    // set return value
    args.GetReturnValue().Set(v8::Number::New(iso, sz));
}

