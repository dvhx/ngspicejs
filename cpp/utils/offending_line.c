// Return offending line of file, trimmed

char* offending_line(const char *filename, int line, int *trim_count) {
    // Return offending line of file, trimmed
    char *ret = NULL;
    // read file in blocks
    FILE* file = fopen(filename, "r");
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
            //printf("f=%d sb=%zu\n", f, strlen(buffer));
            // ret = trimmed buffer
            size_t nl = strlen(buffer) - f;
            *trim_count = f;
            ret = (char*)malloc(sizeof(char) * (nl + 1));
            snprintf(ret, nl, "%s", buffer + f);
            break;
        }
    }
    if (ret == NULL) {
        ret = (char*)malloc(sizeof(char) * 1);
        ret[0] = '\0';
    }
    fclose(file);
    return ret;
}

char* offending_column(int column) {
    // Return ^ arrow pointing to offending column
    Ars *a = ars();
    for (int i = 0; i < column - 1; i++) {
        ars_add(a, (char*)" ");
    }
    ars_add(a, color_arrow_stderr);
    ars_add(a, (char*)"^");
    ars_add(a, color_reset_stderr);
    ars_join(a, (char*)"");
    char *ret = ars_nth_dup(a, 0);
    ars_free(a);
    return ret;
}

