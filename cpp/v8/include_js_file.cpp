// Compile and execute js code from file

void include_js_file(v8::Local<v8::Context> context, v8::Isolate* isolate, const char *filename, const char *filename_origin, bool prepend_source_dir) {
    // Compile and execute js code from file
    gchar *contents = NULL;
    gchar *contents2 = NULL;
    gchar *full_path = NULL;

    if (prepend_source_dir) {
        full_path = g_strconcat(js_src_dir_full, "/", filename, NULL);
    } else {
        full_path = g_strconcat(filename, NULL);
    }

    // check if file exists
    if (!g_file_test(full_path, G_FILE_TEST_EXISTS)) {
        //fprintf(stderr, "js_src_dir_full=%s\n", js_src_dir_full);
        //fprintf(stderr, "       filename=%s\n", filename);
        //fprintf(stderr, "      full_path=%s\n", full_path);
        ars_add(hint_buffer, string_format("filename=%s, js_src_dir_full=%s", filename, js_src_dir_full));
        fatal_msg(EXIT_FILE, "js file not found '%s'", full_path);
    }

    // check if file can be read
    if (!g_file_get_contents(full_path, &contents, NULL, NULL)) {
        fatal_msg(EXIT_FILE, "cannot read content of file '%s'", filename);
    }

    // if file start with hashbang, comment that line out
    if (g_str_has_prefix(contents, "#!")) {
        contents2 = g_strconcat("//", contents, NULL);
        g_free(contents);
        contents = contents2;
    }

    // include code
    include_js_code(context, isolate, contents, filename, filename_origin);

    g_free(contents);
    g_free(full_path);
}
