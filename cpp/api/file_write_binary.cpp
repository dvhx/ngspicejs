// Write file from array of bytes

void js_file_write_binary(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Write file from array of bytes
    assert_arguments_length(args, 2, 2, (char*)"file_write_binary(path,array_of_bytes)");
    assert_string(args, args[0], (char*)"path", (char*)"file_write_binary(path,array_of_bytes)");
    assert_array(args, args[1], (char*)"array_of_bytes", (char*)"file_write_binary(path,array_of_bytes)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get filename
    v8::String::Utf8Value s(iso, args[0]);
    const char *fn = ToCString(s);

    // open file
    FILE *f = (FILE*)fopen(fn, "w");
    if (!f) {
        fatal_msg_stack(iso, EXIT_FILE, "file_write_binary('%s',array) failed to open file!", fn);
        exit(EXIT_UNREACHABLE);
    }

    // convert array to buffer
    v8::Local<v8::Array> arr = v8::Local<v8::Array>::Cast(args[1]);
    size_t sz = arr->Length();
    unsigned char *buf = (unsigned char*)malloc(sz * sizeof(unsigned char));
    if (buf == NULL) {
        fatal_msg_stack(iso, EXIT_FILE, "file_write_binary(%s) cannot allocate %ld bytes", fn, sz);
        exit(EXIT_UNREACHABLE);
    }
    for (size_t i = 0; i < sz; i++) {
        v8::Local<v8::Value> n; // = arr->Get(i);
        if (!arr->Get(iso->GetCurrentContext(), i).ToLocal(&n)) {
          // Successfully retrieved the value at index `i`
          //n = v8::Undefined(isolate); // Assign undefined if retrieval failed
          std::cerr << "error: js_file_write_binary(...) failed to get array item" << std::endl;
          exit(EXIT_MODERN);
        }

        v8::Maybe<uint32_t> maybe_uint = n->Uint32Value(globalContext);
        if (!maybe_uint.IsJust()) {
            fatal_msg_stack(iso, EXIT_FILE, "file_write_binary(%s) conversion to uint failed after %ld bytes", fn, sz);
            exit(EXIT_UNREACHABLE);
        }
        uint32_t z = maybe_uint.FromJust();
        buf[i] = z;
    }

    // write buffer to file
    size_t w = fwrite(buf, sz, sizeof(unsigned char), f);
    if (w != 1) {
        fatal_msg_stack(iso, EXIT_FILE, "file_write_binary('%s',arr) could not write %ld bytes\n", fn, sz);
        exit(EXIT_UNREACHABLE);
    }

    // close file and free the buffer
    fclose(f);
    free(buf);
}

