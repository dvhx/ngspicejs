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
    v8::Local<v8::Context> context = iso->GetCurrentContext();
    v8::Handle<v8::Object> o = v8::Object::New(iso);
    v8::Local<v8::String> sMode = v8::String::NewFromUtf8(iso, "mode", v8::NewStringType::kNormal).ToLocalChecked();
    v8::Local<v8::String> sPath = v8::String::NewFromUtf8(iso, "path", v8::NewStringType::kNormal).ToLocalChecked();
    v8::Local<v8::String> sFile = v8::String::NewFromUtf8(iso, "file", v8::NewStringType::kNormal).ToLocalChecked();
    v8::Local<v8::String> sDir = v8::String::NewFromUtf8(iso, "dir", v8::NewStringType::kNormal).ToLocalChecked();
    v8::Local<v8::String> sPipe = v8::String::NewFromUtf8(iso, "pipe", v8::NewStringType::kNormal).ToLocalChecked();
    v8::Local<v8::String> sSymlink = v8::String::NewFromUtf8(iso, "symlink", v8::NewStringType::kNormal).ToLocalChecked();
    v8::Local<v8::String> sSize = v8::String::NewFromUtf8(iso, "size", v8::NewStringType::kNormal).ToLocalChecked();
    v8::Local<v8::String> sAccessed = v8::String::NewFromUtf8(iso, "accessed", v8::NewStringType::kNormal).ToLocalChecked();
    v8::Local<v8::String> sModified = v8::String::NewFromUtf8(iso, "modified", v8::NewStringType::kNormal).ToLocalChecked();
    v8::Local<v8::String> sCreated = v8::String::NewFromUtf8(iso, "created", v8::NewStringType::kNormal).ToLocalChecked();
    v8::Local<v8::String> vPath = v8::String::NewFromUtf8(iso, fn, v8::NewStringType::kNormal).ToLocalChecked();
    bool err = false;
    if (!o->Set(context, sMode, v8::Number::New(iso, st.st_mode)).FromMaybe(false)) { err = true; }
    if (!o->Set(context, sPath, vPath).FromMaybe(false)) { err = true; }
    if (!o->Set(context, sFile, v8::Boolean::New(iso, S_ISREG(st.st_mode) ? true : false)).FromMaybe(false)) { err = true; }
    if (!o->Set(context, sDir, v8::Boolean::New(iso, S_ISDIR(st.st_mode) ? true : false)).FromMaybe(false)) { err = true; }
    if (!o->Set(context, sPipe, v8::Boolean::New(iso, S_ISFIFO(st.st_mode) ? true : false)).FromMaybe(false)) { err = true; }
    if (!o->Set(context, sSymlink, v8::Boolean::New(iso, S_ISLNK(st.st_mode) ? true : false)).FromMaybe(false)) { err = true; }
    //S_ISCHR(m)  character device?
    //S_ISBLK(m)  block device?
    //S_ISSOCK(m) socket?  (Not in POSIX.1-1996.)
    if (!o->Set(context, sSize, v8::Number::New(iso, st.st_size)).FromMaybe(false)) { err = true; }
    if (!o->Set(context, sAccessed, v8::Number::New(iso, st.st_atim.tv_sec)).FromMaybe(false)) { err = true; }
    if (!o->Set(context, sModified, v8::Number::New(iso, st.st_mtim.tv_sec)).FromMaybe(false)) { err = true; }
    if (!o->Set(context, sCreated, v8::Number::New(iso, st.st_ctim.tv_sec)).FromMaybe(false)) { err = true; }
    args.GetReturnValue().Set(o);
    if (err) {
      std::cerr << "error: failed to set return attribute in js_file_stat" << std::endl;
      exit(EXIT_MODERN);
    }
}

