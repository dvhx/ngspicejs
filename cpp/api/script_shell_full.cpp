// Return full path to shell that executed the script (usually /home/username/ngspicejs/ngspicejs) or undefined

void js_script_shell_full(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Return full path to shell that executed the script (usually /home/username/ngspicejs/ngspicejs) or undefined
    assert_arguments_length(args, 0, 0, (char*)"script_shell_full()");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    args.GetReturnValue().Set(v8::String::NewFromUtf8(iso, exe_path));
};


