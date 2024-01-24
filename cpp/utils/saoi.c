// Static Array Of Strings

struct Saoi {
    size_t length;
    size_t index;
    int *data;
};

Saoi* saoi(size_t length) {
    // Create new Saoi of given length
    assert(length > 0);
    Saoi *a = (Saoi*)malloc(sizeof(Saoi));
    a->length = length;
    a->data = (int*)malloc(sizeof(int) * length);
    for (size_t i = 0; i < a->length; i++) {
        a->data[i] = 0;
    }
    a->index = 0;
    return a;
}

void saoi_free(Saoi *a) {
    // Free Saoi and all it's data
    assert(a);
    free(a->data);
    free(a);
}

void saoi_clear(Saoi *a) {
    // Clear and free all items, set index to zero
    assert(a);
    for (size_t i = 0; i < a->length; i++) {
        a->data[i] = 0;
    }
    a->index = 0;
}

void saoi_debug(Saoi *a) {
    // Print entire Saoi
    assert(a);
    for (size_t i = 0; i < a->length; i++) {
        printf("[%zu] = %d\n", i, a->data[i]);
    }
    printf("\n");
}

size_t saoi_add(Saoi *a, int i) {
    // Add one string to Saoi, return index of inserted string, increment index
    assert(a->index < a->length);
    a->data[a->index] = i;
    a->index++;
    return a->index - 1;
}

size_t saoi_length(Saoi *a) {
    // Return length of array
    return a->length;
}

int saoi_nth(Saoi *a, size_t n) {
    // Return n-th integer
    assert(a);
    assert(n <= a->index);
    return (int)(size_t)(a->data[n]);
}
