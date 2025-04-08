// Gif saving functions

uint32_t v8_value_to_int(v8::Local<v8::Value> val) {
    // Convert JS argument to integer
    v8::Maybe<uint32_t> maybe_uint = val->Uint32Value(globalContext);
    if (maybe_uint.IsJust()) {
        return maybe_uint.FromJust();
    }
    fatal(EXIT_ARGS);
    return 0;
}

void js_gif_begin(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Create new gif
    assert_arguments_length(args, 7, 7, (char*)"gif_begin(filename,width,height,palette,depth,bgindex,loop)");
    assert_string(args, args[0], (char*)"filename", (char*)"gif_begin(filename,width,height,palette,depth,bgindex,loop)");
    assert_integer(args, args[1], (char*)"width", (char*)"gif_begin(filename,width,height,palette,depth,bgindex,loop)");
    assert_integer(args, args[2], (char*)"height", (char*)"gif_begin(filename,width,height,palette,depth,bgindex,loop)");
    assert_array(args, args[3], (char*)"palette", (char*)"gif_begin(filename,width,height,palette,depth,bgindex,loop)");
    assert_integer(args, args[4], (char*)"depth", (char*)"gif_begin(filename,width,height,palette,depth,bgindex,loop)");
    assert_integer(args, args[5], (char*)"bgindex", (char*)"gif_begin(filename,width,height,palette,depth,bgindex,loop)");
    assert_integer(args, args[6], (char*)"loop", (char*)"gif_begin(filename,width,height,palette,depth,bgindex,loop)");

    if (gif != NULL) {
        fatal_msg_stack(globalIsolate, EXIT_WRONG_ORDER, "currently only 1 gif can be created at a time");
        exit(EXIT_UNREACHABLE);
    }

    v8::Isolate *iso = args.GetIsolate();
    v8::Local<v8::Context> context = iso->GetCurrentContext();

    // filename
    v8::String::Utf8Value s(iso, args[0]);
    const char *filename = ToCString(s);
    // width
    uint32_t width = v8_value_to_int(args[1]);
    // height
    uint32_t height = v8_value_to_int(args[2]);
    // palette
    v8::Local<v8::Array> pal = v8::Local<v8::Array>::Cast(args[3]);
    //printf("pal length = %d\n", pal->Length());
    uint8_t *palette = (uint8_t*)malloc(sizeof(uint8_t) * pal->Length());
    //printf("size %d\n", pal->Length());
    for (size_t i = 0; i < pal->Length(); i++) {
        v8::Local<v8::Value> val;
        if (!pal->Get(context, i).ToLocal(&val)) {
            std::cerr << "error: failed to get value in gif_begin(...)" << std::endl;
            exit(EXIT_MODERN);
        }
        palette[i] = v8_value_to_int(val);
        if (palette[i] > 255) {
            fatal_msg_stack(globalIsolate, EXIT_LIB, "gif_begin() palette value %ld must be between 0 and 255\n", palette[i]);
            exit(EXIT_UNREACHABLE);
        }
        //printf("palette[%ld]=%d\n", i, palette[i]);
    }
    // check palette length
    int cols = pal->Length() / 3;
    if (cols != 2 && cols != 4 && cols != 8 && cols != 16 && cols != 32 && cols != 64 && cols != 128 && cols != 256) {
        fatal_msg_stack(globalIsolate, EXIT_LIB, "in function gif_begin(...) number of colors in palette is %d, but it must be 2^n, e.g. 2, 4, 8, 16, 32, 64, 128, 256! (add extra colors to palette to make it 2^n)", cols);
        exit(EXIT_UNREACHABLE);
    }
    // depth
    uint32_t depth = v8_value_to_int(args[4]);
    //printf("depth=%d\n", depth);
    // only 2^n depths are allowed
    if (depth < 1 || depth > 8) {
        fatal_msg_stack(globalIsolate, EXIT_LIB, "gif_begin(...) depth=%d is not allowed, allowed depths are 1 (2 colors) to 8 (256 colors)", depth);
        exit(EXIT_UNREACHABLE);
    }
    int z = 1;
    for (size_t i = 0; i < depth; i++) {
        z *= 2;
    }
    //printf("depth=%d cols=%d z=%d pl=%d\n", depth, cols, z, pal->Length());
    if (cols != z) {
        fatal_msg_stack(globalIsolate, EXIT_LIB, "in function gif_begin(...) depth=%d but it must be such that 2^depth=number of colors in palette (which is now %d) so either add extra colors or decrease the depth", depth, cols);
        exit(EXIT_UNREACHABLE);
    }

    // bgindex
    uint32_t bgindex = v8_value_to_int(args[5]);
    //printf("bgindex=%d\n", bgindex);
    // loop
    uint32_t loop = v8_value_to_int(args[6]);
    //printf("loop=%d\n", loop);
    gif = ge_new_gif(filename, width, height, palette, depth, bgindex, loop);
    if (gif == NULL) {
        printf("filename: %s\n", filename);
        printf("width   : %d\n", width);
        printf("height  : %d\n", height);
        fatal_msg_stack(globalIsolate, EXIT_LIB, "gif_begin() fail");
        exit(EXIT_UNREACHABLE);
    }
    free(palette);
    gif_freeables = freeables();
}

void js_gif_frame(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Add one frame to gif
    assert_arguments_length(args, 2, 2, (char*)"gif_frame(pixels,delay)");
    assert_array(args, args[0], (char*)"pixels", (char*)"gif_frame(pixels,delay)");
    assert_integer(args, args[1], (char*)"delay", (char*)"gif_frame(pixels,delay)");

    // pixels
    v8::Local<v8::Array> pix = v8::Local<v8::Array>::Cast(args[0]);
    uint8_t *pixels = (uint8_t*)malloc(sizeof(uint8_t) * pix->Length());

    v8::Isolate *iso = args.GetIsolate();
    v8::Local<v8::Context> context = iso->GetCurrentContext();

    //printf("px length %d\n", pix->Length());
    v8::Local<v8::Value> val;
    for (size_t i = 0; i < pix->Length(); i++) {
        if (!pix->Get(context, i).ToLocal(&val)) {
            std::cerr << "error: failed to get pixel in js_gif_frame(...)" << std::endl;
            exit(EXIT_MODERN);
        }
        pixels[i] = v8_value_to_int(val);
        if (pixels[i] > 255) {
            fatal_msg_stack(globalIsolate, EXIT_LIB, "gif_frame(pixels,delay) color value %ld must be between 0 and 255\n", pixels[i]);
            exit(EXIT_UNREACHABLE);
        }
    }

    // delay
    uint8_t delay = v8_value_to_int(args[1]);

    // add frame
    memcpy(gif->frame, pixels, pix->Length());
    ge_add_frame(gif, delay);
    //free(pixels); // probably cant?
    freeables_add(gif_freeables, pixels);
}

void js_gif_end(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Finalize gif file
    assert_arguments_length(args, 0, 0, (char*)"gif_end()");
    if (gif == NULL) {
        fatal_msg_stack(globalIsolate, EXIT_WRONG_ORDER, "gif_begin() must be called before gif_end()");
        exit(EXIT_UNREACHABLE);
    }
    ge_close_gif(gif);
    freeables_free(gif_freeables);
    gif = NULL;
    gif_freeables = NULL;
}

