// Fix for new V8 lib

v8::Local<v8::Value> LocalValueNewFromUtf8(v8::Isolate *isolate, const char *s);
