// When something fail print hints to help user fix error, hints are buffered unprinted and printed after first error

void hint_buffer_print();
void hint_args(const char *function_name, const v8::FunctionCallbackInfo < v8::Value > &args);

