// Make sure function argument is array

void assert_array(const v8::FunctionCallbackInfo < v8::Value > &aArguments, v8::Local<v8::Value> aValue, const char* aVariableName, const char* aFunctionName) {
    // Make sure function argument is array
    if (!aValue->IsArray()) {
        hint_args(aFunctionName, aArguments);
        fatal_msg_stack(globalIsolate, EXIT_ARGS, "variable '%s' in function '%s' should be array", aVariableName, aFunctionName);
        exit(EXIT_UNREACHABLE);
    }
}


