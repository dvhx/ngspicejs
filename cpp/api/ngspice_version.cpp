// Return NGSPICE version number

void js_ngspice_version(const v8::FunctionCallbackInfo<v8::Value>& args) {
    // Return NGSPICE version number
    assert_arguments_length(args, 0, 0, (char*)"version_ngspice()");
    int i = atoi((char*)NGSPICE_PACKAGE_VERSION);
    args.GetReturnValue().Set(v8::Number::New(args.GetIsolate(), i));
}
