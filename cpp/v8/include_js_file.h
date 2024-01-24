// Compile and execute js code from file

void include_js_file(
    v8::Local<v8::Context> context,
    v8::Isolate* isolate,
    const char *filename,
    const char *filename_origin,
    bool prepend_source_dir
);
