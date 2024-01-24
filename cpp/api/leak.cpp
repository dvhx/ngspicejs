// Various functions to test for memory leaks

void js_leak_1kB(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Intentionally leak 1kB to test memory leak detection
    leak_str = (char*)malloc(1000);
    leak_str[0] = '!';
    leak_str[1] = '\0';
    printf("Intentionally leaking 1kB%s\n", leak_str);
}

void js_leak_2kB(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Intentionally leak 2kB to test memory leak detection
    leak_str = (char*)malloc(2000);
    leak_str[0] = '!';
    leak_str[1] = '\0';
    printf("Intentionally leaking 2kB%s\n", leak_str);
}

void js_leak_4kB(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Intentionally leak 4kB to test memory leak detection
    leak_str = (char*)malloc(4000);
    leak_str[0] = '!';
    leak_str[1] = '\0';
    printf("Intentionally leaking 4kB%s\n", leak_str);
}

void js_leak_8kB(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Intentionally leak 2kB to test memory leak detection
    leak_str = (char*)malloc(8000);
    leak_str[0] = '!';
    leak_str[1] = '\0';
    printf("Intentionally leaking 8kB%s\n", leak_str);
}

void js_leak_16kB(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Intentionally leak 2kB to test memory leak detection
    leak_str = (char*)malloc(16000);
    leak_str[0] = '!';
    leak_str[1] = '\0';
    printf("Intentionally leaking 16kB%s\n", leak_str);
}

void js_leak_32kB(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Intentionally leak 32kB to test memory leak detection
    leak_str = (char*)malloc(32000);
    leak_str[0] = '!';
    leak_str[1] = '\0';
    printf("Intentionally leaking 32kB%s\n", leak_str);
}

void js_leak_500kB(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Intentionally leak 32kB to test memory leak detection
    leak_str = (char*)malloc(500000);
    leak_str[0] = '!';
    leak_str[1] = '\0';
    printf("Intentionally leaking 500kB%s\n", leak_str);
}
