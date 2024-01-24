// Freeables = Collection of anything that can (and will) be freed

#include <assert.h>

// Structure (do not use directly, only via api calls)

struct Freeables {
    size_t count;
    void** items;
};

// Implementation

Freeables* freeables() {
    // Create empty freeables
    Freeables *f = (Freeables*)malloc(sizeof(Freeables));
    assert(f);
    f->count = 0;
    f->items = NULL;
    return f;
}

void freeables_add(Freeables *f, void *ptr) {
    // Add one pointer to Freeables
    assert(f);
    assert(ptr);
    Freeables *n = freeables();
    n->items = (void**)malloc((f->count + 1) * sizeof(void*));
    for (size_t i = 0; i < f->count; i++) {
        n->items[i] = f->items[i];
    }
    n->items[f->count] = ptr;
    free(f->items);
    f->items = n->items;
    f->count++;
    free(n);
}

void freeables_free(Freeables *f) {
    // Free freeables and it's items
    assert(f);
    if (f->items != NULL) {
        for (size_t i = 0; i < f->count; i++) {
            free(f->items[i]);
        }
        free(f->items);
    }
    free(f);
}

