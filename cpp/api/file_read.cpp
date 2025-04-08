// Load file content from disk and return it as string

gchar* system_file_read(const gchar *filename, size_t *size, const char *called_by_function, v8::Isolate *isolate) {
    // Load file content from disk and return it as string

    // *size contains actual size that was read (strlen(result) for text files, actual size for binary files since they would report smaller size if \0 byte is before EOF)
    if (size == NULL) {
        fatal_msg_stack(isolate, EXIT_INTERNAL, "incorrect call of system_file_read() function, missing 2nd parameter (filename='%s', *size_t, called_by_function='%s')", filename, called_by_function);
        exit(EXIT_UNREACHABLE);
    }

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
    if (st.st_size == 0) {
        *size = 0;
        return g_strdup("");
    }

    // we put some arbitrary limit on file size (e.g. 250 MB) because default linux' OOM killer is garbage
    if ((st.st_size < 0) || (st.st_size > FILE_SIZE_LIMIT) ) {
        fatal_msg_stack(isolate, EXIT_FILE, "file '%s' size is %ld which exceeds internal file size limit %ld (in function %s)", filename, st.st_size, FILE_SIZE_LIMIT, called_by_function);
        exit(EXIT_UNREACHABLE);
    }

    // get contents
    gchar *contents = NULL;
    if (!g_file_get_contents(filename, &contents, size, NULL)) {
        fatal_msg_stack(isolate, EXIT_FILE, "cannot read content of file '%s' (in function %s)", filename, called_by_function);
        exit(EXIT_UNREACHABLE);
    }

    return contents;
}

void js_file_read(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Load file content from disk and return it as string
    assert_arguments_length(args, 1, 1, (char*)"file_read(path)");
    assert_string(args, args[0], (char*)"path", (char*)"file_read(path)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get filename
    v8::String::Utf8Value s(iso, args[0]);
    const char *fn = ToCString(s);

    // read file
    size_t fs;
    gchar *contents = system_file_read(fn, &fs, "file_read", iso);

    // set return value
    v8::Local<v8::String> s2 = v8::String::NewFromUtf8(iso, contents, v8::NewStringType::kNormal).ToLocalChecked();
    args.GetReturnValue().Set(s2);

    g_free(contents);
}

void js_file_read_binary(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Load file content from disk and return it as array of bytes
    assert_arguments_length(args, 1, 1, (char*)"file_read_binary(path)");
    assert_string(args, args[0], (char*)"path", (char*)"file_read_binary(path)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get filename
    v8::String::Utf8Value s(iso, args[0]);
    const char *fn = ToCString(s);

    // get file size
    size_t sz = system_file_size(fn, "file_read_binary(path)", iso);
    //printf("sz=%zu\n", sz);

    // open file
    FILE *f = (FILE*)fopen(fn, "r");
    if (!f) {
        fatal_msg_stack(iso, EXIT_FILE, "error: file_read_binary('%s') failed to open file!\n", fn);
        exit(EXIT_UNREACHABLE);
    }
    // read entire content in 1 read
    unsigned char *buf = (unsigned char*)malloc(sz * sizeof(unsigned char));
    if (buf == NULL) {
        fatal_msg_stack(iso, EXIT_FILE, "error: file_read_binary(%s) cannot allocate %ld bytes\n", fn, sz);
        exit(EXIT_UNREACHABLE);
    }
    size_t r = fread(buf, sizeof(unsigned char), sz, f);
    if (r != sz) {
        fatal_msg_stack(iso, EXIT_FILE, "error: file_read_binary('%s') stat reported size %ld but actual read was %ld\n", fn, sz, r);
        exit(EXIT_UNREACHABLE);
    }
    fclose(f);

    // convert buffer to JS array
    v8::Handle<v8::Array> a = v8::Array::New(iso, sz);
    v8::Local<v8::Context> context = iso->GetCurrentContext();
    bool err = false;
    for (size_t i = 0; i < sz; i++) {
        v8::Local<v8::Number> number = v8::Number::New(iso, buf[i]);
        if (!a->Set(context, i, number).FromMaybe(false)) {
          err = true;
        }
    }
    if (err) {
      std::cerr << "error: failed to assign array item in js_file_read_binary(...)" << std::endl;
      exit(EXIT_MODERN);
    }
    free(buf);

    // set return value
    args.GetReturnValue().Set(a);
}

