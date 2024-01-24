// Flush current output stream

void js_echo_flush(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Flush current output stream
    fflush(echo_stream_id);
};

