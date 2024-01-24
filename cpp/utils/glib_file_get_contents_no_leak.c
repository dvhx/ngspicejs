// GLib's g_file_get_contents() leaks which makes it impossible to debug other part of the software
// I've spent 30 minutes trying to login to gnome gitlab bugzilla without success
// This is leak-free reimplementation of that function

#include <stdio.h>
#include <glib.h>
#include <sys/stat.h>

gboolean g_file_get_contents (const gchar* filename, gchar** contents, gsize* length, GError** error) {
    // Non-leaky version of g_file_get_conents()
    // open file
    FILE *f = (FILE*)fopen(filename, "r");
    if (!f) {
        fprintf(stderr, "error: cannot open file '%s'\n", filename);
        return FALSE;
    }

    struct stat st;

    // get file attributes
    if (stat(filename, &st) != 0) {
        fprintf(stderr, "error: cannot stat file '%s'\n", filename);
        return FALSE;
    }

    // read entire content in 1 read
    *contents = (gchar*)malloc(sizeof(gchar)*(st.st_size + 1));
    if (*contents == NULL) {
        fprintf(stderr, "error: cannot open file '%s' to allocate %ld chars\n", filename, (st.st_size+1));
        return FALSE;
    }
    size_t r = fread(*contents, sizeof(gchar), st.st_size, f);
    //printf("r=%ld\n", r);
    if (r != (size_t)st.st_size) {
        fprintf(stderr, "error: in file '%s' stat reported size %ld but actual read was %ld\n", filename, st.st_size, r);
        return FALSE;
    }
    fclose(f);
    //printf("size=%ld\n", st.st_size);
    //*contents[r - 1] = '\0';
    gchar *s = *contents;
    s[r] = '\0';
    // set returning file size
    if (length != NULL) {
        *length = st.st_size;
    }
    return TRUE;
}

