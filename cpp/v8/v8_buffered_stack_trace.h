
Ars *stack_trace_buffer = ars();
//bool stack_trace_buffer_printed = false;

void v8_buffered_stack_trace(v8::Isolate *isolate, bool only_first_user_error, const char *message);
