// Initialize V8

void ngspice_v8_init() {
    // Initialize V8
    v8::V8::InitializeICUDefaultLocation(arg_items[0]);
    v8::V8::InitializeExternalStartupData(arg_items[0]);
    platform = v8::platform::NewDefaultPlatform();
    v8::V8::InitializePlatform(platform.get());
#ifdef V8_ENABLE_SANDBOX
    if (!v8::V8::InitializeSandbox()) {
        fprintf(stderr, "Error initializing the V8 sandbox\n");
        exit(EXIT_V8);
    }
#endif
    v8::V8::Initialize();

    // Create a new Isolate and make it the current one.
    global_create_params.array_buffer_allocator = v8::ArrayBuffer::Allocator::NewDefaultAllocator();
    //v8::Isolate* isolate = v8::Isolate::New(global_create_params);
    globalIsolate = v8::Isolate::New(global_create_params);
}
