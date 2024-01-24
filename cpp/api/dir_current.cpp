// Return path to current working directory including trailing slash

#include <unistd.h>
#include <stdio.h>
#include <limits.h>

void js_dir_current(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Return path to current working directory including trailing slash
    assert_arguments_length(args, 0, 0, (char*)"dir_current()");

    // get current dir
    char cwd[PATH_MAX + 1];
    if (getcwd(cwd, sizeof(cwd)) == NULL) {
        fatal_msg_stack(globalIsolate, EXIT_SYSTEM, "dir_current() failed\n");
        exit(EXIT_UNREACHABLE);
    }
    size_t len = strlen(cwd);
    cwd[len] = '/';
    cwd[len + 1] = '\0';

    // set return value
    args.GetReturnValue().Set(v8::String::NewFromUtf8(args.GetIsolate(), cwd));
}


