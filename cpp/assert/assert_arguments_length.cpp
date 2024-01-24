// Make sure JS function was called with correct amount of arguments

void assert_arguments_length(const v8::FunctionCallbackInfo < v8::Value > &aArguments, size_t aMinLength, size_t aMaxLength, const char* aFunctionName) {
    // Make sure JS function was called with correct amount of arguments
    size_t l = aArguments.Length();
    if (l < aMinLength || l > aMaxLength) {
        hint_args(aFunctionName, aArguments);
        if (aMinLength == aMaxLength) {
            fatal_msg_stack(aArguments.GetIsolate(), EXIT_ARGS, "%s require exactly %d arguments but %d was given", aFunctionName, aMinLength, l);
            exit(EXIT_UNREACHABLE);
        } else if (l < aMinLength) {
            fatal_msg_stack(aArguments.GetIsolate(), EXIT_ARGS, "%s require at least %d arguments but only %d was given", aFunctionName, aMinLength, l);
            exit(EXIT_UNREACHABLE);
        } else if (l > aMaxLength) {
            fatal_msg_stack(aArguments.GetIsolate(), EXIT_ARGS, "%s require at most %d arguments but %d was given", aFunctionName, aMaxLength, l);
            exit(EXIT_UNREACHABLE);
        }
    }
}

