// Fix for new V8 lib

#include <iostream>

v8::Local<v8::Value> LocalValueNewFromUtf8(v8::Isolate *isolate, const char *s) {
    // This is equivalent to older code:
    //   v8::Local<v8::Value> key = v8::String::NewFromUtf8(globalIsolate, "stack");
    // In Ubuntu 24.04 it look like this:
    v8::MaybeLocal<v8::String> maybe_string = v8::String::NewFromUtf8(isolate, s, v8::NewStringType::kNormal);
    v8::Local<v8::String> local_string;
    if (maybe_string.ToLocal(&local_string)) {
        // Successfully converted MaybeLocal to Local
        return local_string;
    } else {
        // Handle the case where conversion fails
        std::cerr << "error: LocalValueNewFromUtf8(" << s << ")" << std::endl;
        exit(1);
    }
}
