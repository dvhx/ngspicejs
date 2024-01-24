// Static Array Of Strings

struct Saos {
    char **data;
    size_t length;
    size_t index;
};

Saos* saos(size_t length) {
    // Create new saos of given length
    assert(length > 0);
    Saos *a = (Saos*)malloc(sizeof(Saos));
    a->length = length;
    a->data = (char**)malloc(sizeof(char**) * length);
    for (size_t i = 0; i < a->length; i++) {
        a->data[i] = NULL;
    }
    a->index = 0;
    return a;
}

void saos_free(Saos *a) {
    // Free saos and all it's data
    assert(a);
    saos_clear(a);
    free(a->data);
    free(a);
}

void saos_clear(Saos *a) {
    // Clear and free all items, set index to zero
    assert(a);
    for (size_t i = 0; i < a->length; i++) {
        free(a->data[i]);
        a->data[i] = NULL;
    }
    a->index = 0;
}

void saos_debug(Saos *a) {
    // Print entire saos
    assert(a);
    for (size_t i = 0; i < a->length; i++) {
        printf("[%zu] = %s\n", i, a->data[i]);
    }
    printf("\n");
}

size_t saos_add(Saos *a, const char *s) {
    // Add one string to saos, return index of inserted string, increment index
    assert(a->index < a->length);
    size_t len = strlen(s);
    a->data[a->index] = (char*)malloc(sizeof(char) * (len + 1));
    memcpy(a->data[a->index], s, len + 1);
    a->index++;
    return a->index - 1;
}

size_t saos_length(Saos *a) {
    // Return length of the array
    assert(a);
    return a->length;
}

char* saos_nth(Saos *a, size_t n) {
    // Return n-th string
    assert(a);
    assert(n <= a->index);
    return a->data[n];
}
