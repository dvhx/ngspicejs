// Get single character from user without waiting for ENTER key

#include <termios.h>
#include <unistd.h>

void js_read_char(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Get single character from user without waiting for ENTER key
    assert_arguments_length(args, 0, 1, (char*)"read_char(optional_prompt)");
    if (args.Length() > 0) {
        assert_string(args, args[0], (char*)"optional_prompt", (char*)"read_char(optional_prompt)");
    }

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // optional prompt
    const char *prompt;
    if (args.Length() == 1) {
        v8::String::Utf8Value str(iso, args[0]);
        prompt = ToCString(str);
        printf("%s", prompt);
        fflush(stdout);
    }

    // get single character
    struct termios oldt, newt;
    tcgetattr(STDIN_FILENO, &oldt);
    newt = oldt;
    newt.c_lflag &= ~(ICANON); // Disable canonical mode
    tcsetattr(STDIN_FILENO, TCSANOW, &newt);
    char c = getchar();
    tcsetattr(STDIN_FILENO, TCSANOW, &oldt); // Restore old settings

    // return it as string
    char *s = (char*)malloc(2);
    s[0] = c;
    s[1] = '\0';

    // set return value
    // args.GetReturnValue().Set(v8::String::NewFromUtf8(iso, s));
    v8::Local<v8::String> local_string = v8::String::NewFromUtf8(iso, s, v8::NewStringType::kNormal).ToLocalChecked();
    args.GetReturnValue().Set(local_string);

    free(s);
}





