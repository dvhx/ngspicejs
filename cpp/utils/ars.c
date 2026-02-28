// ARS = ARray of Strings

#include <assert.h>

// Structure (do not use directly, only via api calls)

struct Ars {
    size_t count;
    char** items;
};

// Implementation

Ars* ars() {
    // Create empty ars
    Ars *r = (Ars*)malloc(sizeof(Ars));
    assert(r);
    r->count = 0;
    r->items = NULL;
    return r;
}

Ars* ars_clone(Ars *a) {
    // Create ars and clone items from other ars
    assert(a);
    Ars *r = ars();
    for (size_t i = 0; i < a->count; i++) {
        ars_add(r, a->items[i]);
    }
    return r;
}

Ars* ars_from_cstr(char *s) {
    // Create ars and add one string to it
    assert(s);
    Ars *r = ars();
    ars_add(r, s);
    return r;
}

void ars_free(Ars *a) {
    // Free ars and it's items
    assert(a);
    if (a->items != NULL) {
        for (size_t i = 0; i < a->count; i++) {
            free(a->items[i]);
        }
        free(a->items);
    }
    free(a);
}

void ars_clear(Ars *a) {
    // Free and clear items and set count to zero
    assert(a);
    for (size_t i = 0; i < a->count; i++) {
        free(a->items[i]);
    }
    free(a->items);
    a->items = NULL;
    a->count = 0;
}

void ars_add(Ars *a, char *s) {
    // Add one string to ars
    assert(a);
    assert(s);
    Ars *n = ars();
    n->items = (char**)malloc((a->count + 1) * sizeof(char*));
    for (size_t i = 0; i < a->count; i++) {
        n->items[i] = a->items[i];
    }
    size_t sl = strlen(s);
    n->items[a->count] = (char*)malloc((sl + 1) * sizeof(char));
    memcpy(n->items[a->count], s, sl + 1);
    n->items[a->count][sl] = '\0';
    free(a->items);
    a->items = n->items;
    a->count++;
    free(n);
}

void ars_debug(Ars *a) {
    // Print ars content to stdout
    assert(a);
    printf("Ars (%zu items):\n", a->count);
    for (size_t i = 0; i < a->count; i++) {
        printf("  [%zu] = '%s' (%zu)\n", i, a->items[i], strlen(a->items[i]));
    }
}

void ars_join(Ars *a, char *glue) {
    // Combine all items of ars together using glue string, put it into first item, free rest of the items
    // example: two items [Foo,Bar] into single item [Foo_Bar]
    assert(a);
    assert(glue);
    if (a->count == 0) {
        return;
    }
    size_t total = 0, gl = strlen(glue), l;
    for (size_t i = 0; i < a->count; i++) {
        total += strlen(a->items[i]);
        if (i < a->count - 1) {
            total += gl;
        }
    }
    char *n = (char*)malloc((total + 1) * sizeof(char));
    //printf("total=%zu\n", total);
    total = 0;
    for (size_t i = 0; i < a->count; i++) {
        l = strlen(a->items[i]);
        //printf("to %zu assign a[%zu] len=%zu\n", total, i, l);
        memcpy(n + total, a->items[i], l);
        total += l;
        if (i < a->count - 1) {
            //printf("to %zu assign glue len=%zu\n", total, gl);
            memcpy(n + total, glue, gl);
            total += gl;
        }
    }
    n[total] = '\0';
    for (size_t i = 0; i < a->count; i++) {
        free(a->items[i]);
    }
    a->items[0] = n;
    a->count = 1;
}

size_t ars_count(Ars *a) {
    // Return how many items are in ars
    assert(a);
    return a->count;
}

char*  ars_nth(Ars *a, size_t index) {
    // Return pointer to the nth item
    assert(a);

    if (index >= a->count) {
        fprintf(stderr, "index=%ld count=%ld\n", index, a->count);
        fflush(stderr);
        ars_debug(a);
    }

    assert(index < a->count);
    return a->items[index];
}

char* ars_nth_dup(Ars *a, size_t index) {
    // Return new independent duplicate of the nth item
    assert(a);
    assert(index < a->count);
    char *src = a->items[index];
    size_t len = strlen(src) + 1;
    char *dst = (char*)malloc(len);
    if (dst == NULL) {
        return NULL;
    }
    memcpy (dst, src, len);
    return dst;
}

void ars_delete(Ars *a, size_t index) {
    // Delete and free nth item, shift all items to fill the void
    assert(a);
    assert(index < a->count);
    free(a->items[index]);
    for (size_t i = index; i < a->count - 1; i++) {
        a->items[i] = a->items[i + 1];
    }
    a->count--;
    // Note: not returning deleted item is intentional
}

void ars_swap(Ars *a, size_t index1, size_t index2) {
    // Swap two items
    assert(index1 <= a->count - 1);
    assert(index2 <= a->count - 1);
    assert(index1 != index2);
    char *tmp = a->items[index1];
    a->items[index1] = a->items[index2];
    a->items[index2] = tmp;
}

void ars_insert(Ars *a, size_t index, char *s) {
    // Insert string to given position, shifts items to make space for it
    assert(a);
    assert(index < a->count);
    assert(s);
    if (index > a->count - 1) {
        fprintf(stderr, "error: in ars_insert(a,index,s) index %zu must be <= %zu\n", index, a->count - 1);
        ars_debug(a);
        exit(1);
    }
    ars_add(a, s);
    char *tmp = a->items[a->count - 1];
    for (size_t i = a->count - 1; i > index; i--) {
        a->items[i] = a->items[i - 1];
    }
    a->items[index] = tmp;
}

size_t ars_total_len(Ars *a) {
    // Return sum of length of all items
    assert(a);
    size_t i, t = 0;
    for (i = 0; i < a->count; i++) {
        t += strlen(a->items[i]);
    }
    return t;
}

size_t ars_nth_len(Ars *a, size_t index) {
    // Return length of nth item
    assert(a);
    assert(index < a->count);
    return strlen(a->items[index]);
}

char* ars_cstr_all(Ars *a) {
    // Return new string that is combination of all items
    assert(a);
    Ars *b = ars_clone(a);
    ars_join(b, (char*)"");
    char *s = ars_nth_dup(b, 0);
    ars_free(b);
    return s;
}

void ars_set(Ars *a, size_t index, char *s) {
    // Set nth item to new value
    assert(a);
    assert(index <= a->count);
    assert(s);
    free(a->items[index]);
    size_t len = strlen(s) + 1;
    char *dst = (char*)malloc(len);
    assert(dst != NULL);
    memcpy (dst, s, len);
    a->items[index] = dst;
}

void ars_split_char(Ars *a, char delimiter) {
    // Split ars by single-character delimiter
    assert(a);
    assert(delimiter > 0);
    assert(a->count == 1);
    Ars *n = ars();
    char *src = a->items[0];
    size_t len = strlen(src);
    size_t p = 0;
    for (size_t i = 0; i <= len; i++) {
        //printf("%zu %c\n", i, src[i]);
        if (src[i] == delimiter || i == len) {
            size_t nl = i + 1 - p;
            char *ns = (char*)malloc((nl + 1) * sizeof(char));
            //printf("--- cut p=%zu nl=%zu\n", p, nl);
            memcpy(ns, src + p, nl - 1);
            ns[nl - 1] = '\0';
            //printf("--- ns=%s\n", ns);
            ars_add(n, ns);
            free(ns);
            p = i + 1;
        }
    }
    ars_delete(a, 0);
    free(a->items);
    a->items = n->items;
    a->count = n->count;
    free(n);
}

char* ars_first(Ars *a) {
    // Return first item
    assert(a);
    if (ars_count(a) == 0) {
        return (char*)"";
    }
    return ars_nth(a, 0);
}

char* ars_last(Ars *a) {
    // Return last item
    assert(a);
    return ars_nth(a, a->count - 1);
}

char** ars_array(Ars *a, size_t *count_out) {
    // Convert Ars to char** (array of strings + NULL as last item), size is returned in count_out
    assert(a);
    assert(count_out);
    size_t c = a->count + 1;
    char **r = (char**)malloc(c * sizeof(char*));
    for (size_t i = 0; i < a->count; i++) {
        //printf("i=%zu\n", i);
        r[i] = ars_nth_dup(a, i);
    }
    //printf("i=%zu\n", c - 1);
    r[c - 1] = NULL;
    *count_out = c;
    return r;
}

void ars_array_free(char **s, size_t count) {
    // Free array created by ars_array()
    assert(s);
    for (size_t i = 0; i < count; i++) {
        free(s[i]);
    }
    free(s);
}

void ars_add_int(Ars *a, int i) {
    // Add signed integer converted to string
    assert(a);
    int length = snprintf(NULL, 0, "%d", i);
    char* str = (char*)malloc(length + 1);
    snprintf(str, length + 1, "%d", i);
    ars_add(a, str);
    free(str);
}

void ars_add_uint(Ars *a, unsigned int i) {
    // Add unsigned integer converted to string
    assert(a);
    int length = snprintf(NULL, 0, "%u", i);
    char* str = (char*)malloc(length + 1);
    snprintf(str, length + 1, "%u", i);
    ars_add(a, str);
    free(str);
}
