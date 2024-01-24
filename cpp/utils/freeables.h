// Freeables = Collection of anything that can (and will) be freed (all at once)

typedef struct Freeables Freeables;

// API
Freeables* freeables();
void       freeables_add(Freeables *a, void *ptr);
void       freeables_free(Freeables *a);

