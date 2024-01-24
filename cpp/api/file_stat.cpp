// Return file status/statistics

void js_file_stat(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Return file status/statistics
    assert_arguments_length(args, 1, 1, (char*)"file_stat(path)");
    assert_string(args, args[0], (char*)"path", (char*)"file_stat(path)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get filename
    v8::String::Utf8Value s(iso, args[0]);
    const char *fn = ToCString(s);

    // get file attributes
    struct stat st;
    if (stat(fn, &st) != 0) {
        fatal_msg_stack(iso, EXIT_FILE, "file_stat(%s) failed", fn);
        exit(EXIT_UNREACHABLE);
    }

    // returning object
    v8::Handle<v8::Object> o = v8::Object::New(iso);
    o->Set(v8::String::NewFromUtf8(iso, "mode"), v8::Number::New(iso, st.st_mode));
    o->Set(v8::String::NewFromUtf8(iso, "path"), v8::String::NewFromUtf8(iso, fn));
    o->Set(v8::String::NewFromUtf8(iso, "file"), v8::Boolean::New(iso, S_ISREG(st.st_mode) ? true : false));
    o->Set(v8::String::NewFromUtf8(iso, "dir"), v8::Boolean::New(iso, S_ISDIR(st.st_mode) ? true : false));
    o->Set(v8::String::NewFromUtf8(iso, "pipe"), v8::Boolean::New(iso, S_ISFIFO(st.st_mode) ? true : false));
    o->Set(v8::String::NewFromUtf8(iso, "symlink"), v8::Boolean::New(iso, S_ISLNK(st.st_mode) ? true : false));
    //S_ISCHR(m)  character device?
    //S_ISBLK(m)  block device?
    //S_ISSOCK(m) socket?  (Not in POSIX.1-1996.)
    o->Set(v8::String::NewFromUtf8(iso, "size"), v8::Number::New(iso, st.st_size));
    o->Set(v8::String::NewFromUtf8(iso, "accessed"), v8::Number::New(iso, st.st_atim.tv_sec));
    o->Set(v8::String::NewFromUtf8(iso, "modified"), v8::Number::New(iso, st.st_mtim.tv_sec));
    o->Set(v8::String::NewFromUtf8(iso, "created"), v8::Number::New(iso, st.st_ctim.tv_sec));
    args.GetReturnValue().Set(o);
}

