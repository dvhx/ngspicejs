// Make sure function argument is string

void assert_string(const v8::FunctionCallbackInfo < v8::Value > &aArguments, v8::Local<v8::Value> aValue, char* aVariableName, char* aFunctionName) {
    // Make sure function argument is string
    if (!aValue->IsString()) {
        hint_args(aFunctionName, aArguments);
        fatal_msg_stack(globalIsolate, EXIT_ARGS, "variable '%s' in function '%s' should be string", aVariableName, aFunctionName);
        exit(EXIT_UNREACHABLE);
    }
}

