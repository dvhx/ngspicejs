// Make sure function argument is string, number or boolean

void assert_simple_type(const v8::FunctionCallbackInfo < v8::Value > &aArguments, v8::Local<v8::Value> aValue, char* aVariableName, char* aFunctionName) {
    // Make sure function argument is string, number or boolean
    if (!aValue->IsString() && !aValue->IsNumber() && !aValue->IsBoolean()) {
        hint_args(aFunctionName, aArguments);
        fatal_msg_stack(globalIsolate, EXIT_ARGS, "variable '%s' in function '%s' should be string, number or boolean", aVariableName, aFunctionName);
        exit(EXIT_UNREACHABLE);
    }
}


