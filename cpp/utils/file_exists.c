// Return true if file exists

gboolean system_file_exists(const gchar *filename) {
    // Return true if file exists
    if (g_file_test(filename, G_FILE_TEST_EXISTS)) {
        return TRUE;
    }
    return FALSE;
}
