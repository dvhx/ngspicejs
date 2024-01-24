// Highlight error in source file

#include <ctype.h>

void highlight_error_in_file(const char *filename, int line, int column, const char *prefix) {
    // Highlight error in source file

    // skip highlighting if filename contains EVAL_COMBINE_SOURCE
    if (strcmp(filename, "EVAL_COMBINE_SOURCE") == 0) {
        fprintf(stderr, "%seval(combine_source(...));\n", prefix);
        fprintf(stderr, "%s%s^%s\n", prefix, color_arrow_stderr, color_reset_stderr);
        return;
    }

    // open source
    FILE* file = fopen(filename, "r");
    if (!file) {
        fprintf(stderr, "fatal: file '%s' not found in highlight_error_in_file()\n", filename);
        exit(1);
    }

    // read file by blocks
    char buffer[100000];
    int i = 0, j, f;
    while (fgets(buffer, sizeof(buffer), file)) {
        i++;
        if(i == line) {
            // find first non-space character
            f = 0;
            for (j = 0; j < (int)strlen(buffer); j++) {
                if (!isspace(buffer[j])) {
                    f = j;
                    break;
                }
            }
            // print buffer from that char with prefix
            fprintf(stderr, "%s%s", prefix, buffer + f);
            // print marker arrow
            for (j = 0; j < (int)(column - 1 + strlen(prefix) - f); j++) {
                fprintf(stderr, " ");
            }
            fprintf(stderr, "%s^%s\n", color_arrow_stderr, color_reset_stderr);
            break;
        }
    }
    fclose(file);
    fflush(stderr);
}

