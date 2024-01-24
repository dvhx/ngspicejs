// Receive the combined all-in-one core.js with filenames and line offsets

void js_assign_core_library(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Receive the combined all-in-one core.js with filenames and line offsets
    assert_arguments_length(args, 3, 3, "assign_core_library(lines,files,offsets)");
    assert_array(args, args[0], "lines", "assign_core_library(lines,files,offsets)");
    assert_array(args, args[1], "files", "assign_core_library(lines,files,offsets)");
    assert_array(args, args[2], "offsets", "assign_core_library(lines,files,offsets)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // lines of code (core_lines)
    v8::Local<v8::Value> a0 = args[0];
    v8::Handle<v8::Array> p0 = v8::Handle<v8::Array>::Cast(a0);
    if (core_lines) {
        saos_free(core_lines);
    }
    core_lines = saos(p0->Length());
    for (size_t i = 0; i < core_lines->length; i++) {
        v8::Local<v8::Value> val = p0->Get(i);
        v8::String::Utf8Value st(iso, val);
        const char *s = ToCString(st);
        saos_add(core_lines, s);
    }

    // file names (core_files)
    v8::Local<v8::Value> a1 = args[1];
    v8::Handle<v8::Array> p1 = v8::Handle<v8::Array>::Cast(a1);
    if (core_files) {
        saos_free(core_files);
    }
    core_files = saos(p1->Length());
    for (size_t i = 0; i < core_files->length; i++) {
        v8::Local<v8::Value> val = p1->Get(i);
        v8::String::Utf8Value st(iso, val);
        const char *s = ToCString(st);
        saos_add(core_files, s);
    }

    // line offsets (core_offsets)
    v8::Local<v8::Value> a2 = args[2];
    v8::Handle<v8::Array> p2 = v8::Handle<v8::Array>::Cast(a2);
    if (core_offsets) {
        saoi_free(core_offsets);
    }
    core_offsets = saoi(p2->Length());
    for (size_t i = 0; i < core_offsets->length; i++) {
        v8::Local<v8::Value> val = p2->Get(i);
        v8::String::Utf8Value st(iso, val);
        const char *s = ToCString(st);
        saoi_add(core_offsets, atoi(s));
    }

    /*
    printf("core_lines %zu\n", core_lines->length);
    saos_debug(core_lines);
    printf("core_files %zu\n", core_files->length);
    saos_debug(core_files);
    printf("core_offsets %zu\n", core_offsets->length);
    saoi_debug(core_offsets);
    */

    // small highlighting test
    //core_library_highlight(core_lines, core_files, core_offsets, 4, 2);
}

