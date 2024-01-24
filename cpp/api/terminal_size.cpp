// Return terminal size (columns, rows, pixel_width, pixel_height, result of ioctl operation)

#include <sys/ioctl.h>
#include <stdio.h>
#include <unistd.h>

void js_terminal_size(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Return terminal size (columns, rows, pixel_width, pixel_height, result of ioctl operation)
    assert_arguments_length(args, 0, 0, (char*)"terminal_size()");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // get window size
    struct winsize w;
    int i = ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
    if (i != 0) {
        w.ws_col = 0;
        w.ws_row = 0;
        w.ws_xpixel = 0;
        w.ws_ypixel = 0;
    }

    // returning object
    v8::Handle<v8::Object> o = v8::Object::New(iso);
    o->Set(v8::String::NewFromUtf8(iso, "result"), v8::Number::New(iso, i));
    //o->Set(v8::String::NewFromUtf8(iso, "errno"), v8::Number::New(iso, errno));
    o->Set(v8::String::NewFromUtf8(iso, "columns"), v8::Number::New(iso, w.ws_col));
    o->Set(v8::String::NewFromUtf8(iso, "rows"), v8::Number::New(iso, w.ws_row));
    o->Set(v8::String::NewFromUtf8(iso, "pixel_width"), v8::Number::New(iso, w.ws_xpixel));
    o->Set(v8::String::NewFromUtf8(iso, "pixel_height"), v8::Number::New(iso, w.ws_ypixel));

    // return
    args.GetReturnValue().Set(o);
}
