// Create formated string, like sprintf but allocates everything and return it

#include <stdarg.h>

char* string_format(const char *fmt, ...) {
    // C is a primitive and stupid language
    // https://stackoverflow.com/questions/75736525/stdarg-h-formating-string-via-snprintf-not-working-arguments-are-ignored
    va_list args,copy;
    va_start(args, fmt);
    va_copy(copy, args);
    size_t len = vsnprintf(NULL, 0, fmt, args);
    char *s;
    if (len > 0) {
        s = (char*)malloc(len + 1);
        if (s) {
            vsnprintf(s, len + 1, fmt, copy);
        } else {
            fprintf(stderr, "error: string_format() failed to allocate %ld chars\n", len + 1);
            exit(1);
        }
    }
    va_end(args);
    va_end(copy);
    return s;
}
