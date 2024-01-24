// Return left-trimmed substring, from the first non-space character to the end of string

char* ltrim(const char *s) {
    // Return left-trimmed substring, from the first non-space character to the end of string
    size_t len = strlen(s);
    for (size_t i = 0; i < len; i++) {
        if (!isspace(s[i])) {
            //printf("i=%zu\n", i);
            return (char*)s + i;
            break;
        }
    }
    return (char*)"";
}

