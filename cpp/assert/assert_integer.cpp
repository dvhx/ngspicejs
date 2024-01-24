// Make sure function argument is integer

void assert_integer(const v8::FunctionCallbackInfo < v8::Value > &aArguments, v8::Local<v8::Value> aValue, char* aVariableName, char* aFunctionName) {
    // Make sure function argument is integer
    if (!aValue->IsNumber()) {
        hint_args(aFunctionName, aArguments);
        fatal_msg_stack(globalIsolate, EXIT_ARGS, "variable '%s' in function '%s' should be integer", aVariableName, aFunctionName);
        exit(EXIT_UNREACHABLE);
    }
    if (!aValue->IsInt32() && !aValue->IsUint32()) {
        hint_args(aFunctionName, aArguments);
        fatal_msg_stack(globalIsolate, EXIT_ARGS, "variable '%s' in function '%s' should be integer", aVariableName, aFunctionName);
        exit(EXIT_UNREACHABLE);
    }
}



