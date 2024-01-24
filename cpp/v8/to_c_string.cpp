// Convert js string to C string

const char* ToCString(const v8::String::Utf8Value& value) {//, char * place
    // Convert js string to C string
    return *value ? *value : "";
}

const char* ToCStringDefault(const v8::String::Utf8Value& value, const char *def) {//, char * place
    // Convert js string to C string with custom default value
    return *value ? *value : def;
}

const char* ToNullTerminatedString(const unsigned char *s, size_t len) {
    // Adds extra \0
    char *r = (char*)malloc(sizeof(char) * (len + 1));
    size_t i;
    for (i = 0; i < len; i++) {
        r[i] = s[i];
    }
    r[len] = '\0';
    return r;
}

