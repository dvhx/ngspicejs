// Get string from user

#include <readline/readline.h>
#include <readline/history.h>

void js_read(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Get string from user
    assert_arguments_length(args, 0, 1, (char*)"read(optional_prompt)");
    if (args.Length() > 0) {
        assert_string(args, args[0], (char*)"optional_prompt", (char*)"read(optional_prompt)");
    }

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // optional prompt
    const char *prompt;
    char *s;
    if (args.Length() == 1) {
        v8::String::Utf8Value str(iso, args[0]);
        prompt = ToCString(str);
        s = readline(prompt);
    } else {
        s = readline("");
    }

    // set return value
    args.GetReturnValue().Set(v8::String::NewFromUtf8(iso, s));

    // add prompt to history (arrow up)
    add_history(s);
    free(s);
}




