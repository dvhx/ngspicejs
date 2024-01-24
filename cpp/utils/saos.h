// Static Array Of Strings

#include <stddef.h>
#include <assert.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

typedef struct Saos Saos;

Saos* saos(size_t length);
void saos_free(Saos *a);
void saos_clear(Saos *a);
void saos_debug(Saos *a);
size_t saos_add(Saos *a, const char *s);
size_t saos_length(Saos *a);
char* saos_nth(Saos *a, size_t n);


