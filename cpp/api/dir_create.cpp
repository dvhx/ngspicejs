// Create directory and it's parents if needed

void js_dir_create(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Create drectory and it's parents if needed
    assert_arguments_length(args, 1, 1, (char*)"dir_create(path)");
    assert_string(args, args[0], (char*)"path", (char*)"dir_create(path)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // path
    v8::String::Utf8Value s(iso, args[0]);
    char *path = (char*)ToCString(s);

    // remove trailing slash
    if (path[strlen(path) - 1] == '/') {
        path[strlen(path) - 1] = '\0';
    }

    // if path exists return true
    if (system_file_exists(path)) {
        args.GetReturnValue().Set(v8::Boolean::New(iso, true));
        return;
    }

    // create dir
    gint i = g_mkdir_with_parents(path, 0755);
    //printf("i=%d\n", i);

    // return true if ok, false on error (usually permissions)
    args.GetReturnValue().Set(v8::Boolean::New(iso, i == 0 ? true : false));
}


