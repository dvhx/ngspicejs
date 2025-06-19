// Calculate SHA1 hash of a file

#include <openssl/evp.h>

gchar* system_file_sha1(const char *filename, const char *called_by_function, v8::Isolate *isolate) {
    // Calculate SHA1 hash of a file

    // check if file exists
    if (!g_file_test(filename, G_FILE_TEST_EXISTS)) {
        fatal_msg_stack(isolate, EXIT_FILE, "file not found '%s' (in function %s)", filename, called_by_function);
        exit(EXIT_UNREACHABLE);
        return NULL;
    }

    // SHA1 boilerplate begin
    FILE *file = fopen(filename, "rb");
    if (!file) {
        fatal_msg_stack(isolate, EXIT_FILE, "failed to open file '%s' (in function %s)", filename, called_by_function);
        exit(EXIT_UNREACHABLE);
        return NULL;
    }
    EVP_MD_CTX *mdctx = EVP_MD_CTX_new();
    const EVP_MD *md = EVP_sha1();
    if (!mdctx || !md) {
        fclose(file);
        fatal_msg_stack(isolate, EXIT_FILE, "failed to initialize digest context to calculate SHA1 of file '%s' (in function %s)", filename, called_by_function);
        exit(EXIT_UNREACHABLE);
        return NULL;
    }
    EVP_DigestInit_ex(mdctx, md, NULL);
    unsigned char buffer[8192];
    size_t bytes_read;
    while ((bytes_read = fread(buffer, 1, sizeof(buffer), file)) > 0) {
        EVP_DigestUpdate(mdctx, buffer, bytes_read);
    }
    if (ferror(file)) {
        fclose(file);
        EVP_MD_CTX_free(mdctx);
        fatal_msg_stack(isolate, EXIT_FILE, "cannot read file '%s' (in function %s)", filename, called_by_function);
        exit(EXIT_UNREACHABLE);
        return NULL;
    }
    fclose(file);
    unsigned char hash[EVP_MAX_MD_SIZE];
    unsigned int hash_length;
    EVP_DigestFinal_ex(mdctx, hash, &hash_length);
    EVP_MD_CTX_free(mdctx);
    gchar *output = (gchar*)malloc(sizeof(char) * (hash_length * 2 + 1));
    for (unsigned int i = 0; i < hash_length; i++) {
        sprintf(output + (i * 2), "%02x", hash[i]);
    }
    output[hash_length * 2] = '\0';
    // SHA1 boilerplate end

    return output;
}

void js_file_sha1(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Calculate SHA1 hash of a file
    assert_arguments_length(args, 1, 1, (char*)"file_sha1(path)");
    assert_string(args, args[0], (char*)"path", (char*)"file_sha1(path)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get filename
    v8::String::Utf8Value s(iso, args[0]);
    const char *fn = ToCString(s);

    // read file
    gchar *contents = system_file_sha1(fn, "file_sha1", iso);

    // set return value
    v8::Local<v8::String> s2 = v8::String::NewFromUtf8(iso, contents, v8::NewStringType::kNormal).ToLocalChecked();
    args.GetReturnValue().Set(s2);

    g_free(contents);
}

