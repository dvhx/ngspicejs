// Update access time and modification time of a file

#include <utime.h>

void js_file_touch(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Update access time and modification time of a file
    assert_arguments_length(args, 1, 3, (char*)"file_touch(path,atime,mtime)");
    assert_string(args, args[0], (char*)"path", (char*)"file_touch(path,atime,mtime)");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get filename
    v8::String::Utf8Value s(iso, args[0]);
    const char *fn = ToCString(s);

    // defaults to current time
    useconds_t atime = time(NULL);
    useconds_t mtime = atime;

    // get atime
    if (args.Length() >= 2) {
        v8::String::Utf8Value str1(iso, args[1]);
        const char *cstr1 = ToCString(str1);
        atime = atoi(cstr1);
    };

    // get mtime
    if (args.Length() >= 3) {
        v8::String::Utf8Value str2(iso, args[2]);
        const char *cstr2 = ToCString(str2);
        mtime = atoi(cstr2);
    }

    // update times
    struct utimbuf new_times;
    new_times.actime = atime;
    new_times.modtime = mtime;
    int r = utime(fn, &new_times);
    if (r != 0) {
        hint_args("file_touch(path,atime,mtime)", args);
        fatal_msg_stack(iso, EXIT_FILE, "failed to touch file '%s', code %d", fn, r);
        exit(EXIT_UNREACHABLE);
    }
}


