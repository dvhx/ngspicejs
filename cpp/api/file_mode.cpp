// Change file mode, return true on success

#include "sys/stat.h"

void js_file_mode(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Change file mode, return true on success
    assert_arguments_length(args, 2, 2, (char*)"file_mode(path,octal_mode)");
    assert_string(args, args[0], (char*)"path", (char*)"file_mode(path,octal_mode)");
    assert_integer(args, args[1], (char*)"mode", (char*)"file_mode(path,octal_mode)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get filename
    v8::String::Utf8Value s(iso, args[0]);
    const char *fn = ToCString(s);

    // convert second argument to mode number
    v8::String::Utf8Value s1(iso, args[1]);
    const char *m = ToCString(s1);
    v8::Maybe<uint32_t> maybe_uint = args[1]->Uint32Value(globalContext);
    if (!maybe_uint.IsJust()) {
        fatal_msg_stack(iso, EXIT_FILE, "file_mode(%s,%s) octal mode must be integer between 0 and 0777 (you can use parseInt('0777', 8))", fn, m);
        exit(EXIT_UNREACHABLE);
    }
    uint32_t mode = maybe_uint.FromJust();
    //printf("mode = %d\n", mode);

    // set mode
    int res = chmod(fn, mode);
    //printf("res = %d\n", res);
    if (res == -1) {
        char *s = strerror(errno);
        fatal_msg_stack(iso, EXIT_FILE, "file_mode(%s,%s) failed, %s (chmod returned -1, errno=%d)", fn, m, s, errno);
        exit(EXIT_UNREACHABLE);
    }

    // set true
    args.GetReturnValue().Set(v8::Boolean::New(args.GetIsolate(), true));
}

