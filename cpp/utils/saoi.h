// Static Array Of Integers

#include <stddef.h>
#include <assert.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

typedef struct Saoi Saoi;

Saoi* saoi(size_t length);
void saoi_free(Saoi *a);
void saoi_clear(Saoi *a);
void saoi_debug(Saoi *a);
size_t saoi_add(Saoi *a, int i);
size_t saoi_length(Saoi *a);
int saoi_nth(Saoi *a, size_t n);


