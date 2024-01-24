// ARS = ARray of Strings

typedef struct Ars Ars;

// API
Ars*   ars();
Ars*   ars_clone(Ars *a);
Ars*   ars_from_cstr(char *s);
void   ars_free(Ars *a);
void   ars_clear(Ars *a);
void   ars_add(Ars *a, char *s);
void   ars_add_int(Ars *p, int i);
void   ars_add_uint(Ars *p, unsigned int i);
void   ars_delete(Ars *a, size_t index);
void   ars_debug(Ars *a);
void   ars_join(Ars *a, char *glue);
size_t ars_count(Ars *a);
size_t ars_total_len(Ars *a);
size_t ars_nth_len(Ars *a, size_t index);
char*  ars_first(Ars *a);
char*  ars_last(Ars *a);
char*  ars_nth(Ars *a, size_t index);
char*  ars_nth_dup(Ars *a, size_t index);
char*  ars_cstr_all(Ars *a);
void   ars_swap(Ars *a, size_t index1, size_t index2);
void   ars_insert(Ars *a, size_t index, char *s);
void   ars_set(Ars *a, size_t index, char *s);
void   ars_split_char(Ars *a, char delimiter);
char** ars_array(Ars *a, size_t *count_out);
void   ars_array_free(char **s, size_t count);


