// Convert js string to C string

const char* ToCString(const v8::String::Utf8Value& value);
const char* ToCStringDefault(const v8::String::Utf8Value& value, const char *def);
const char* ToNullTerminatedString(const unsigned char *s, size_t len);
