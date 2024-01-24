#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <string.h>
#include <stdbool.h>
#include <unistd.h>
#include <ctype.h>
#include <sys/types.h>
#include <time.h>

#include "../../cpp/utils/ars.h"
#include "../../cpp/utils/ars.c"

// Testset

void test_nothing() {
    printf("### %s ", __func__);
    Ars *s = ars();
    ars_debug(s);
    printf("joined: ");
    ars_join(s, "_");
    ars_debug(s);
    ars_free(s);
}

void test_hello() {
    printf("### %s ", __func__);
    Ars *s = ars();
    ars_add(s, "hello");
    ars_debug(s);
    printf("joined: ");
    ars_join(s, "_");
    ars_debug(s);
    ars_free(s);
}

void test_one_empty_string() {
    printf("### %s ", __func__);
    Ars *s = ars();
    ars_add(s, "");
    ars_debug(s);
    printf("joined: ");
    ars_join(s, "_");
    ars_debug(s);
    ars_free(s);
}

void test_two_strings() {
    printf("### %s ", __func__);
    Ars *s = ars();
    ars_add(s, "hello");
    ars_add(s, "world");
    ars_debug(s);
    printf("joined: ");
    ars_join(s, "_");
    ars_debug(s);
    ars_free(s);
}

void test_string_empty_string() {
    printf("### %s ", __func__);
    Ars *s = ars();
    ars_add(s, "hello");
    ars_add(s, "");
    ars_add(s, "world");
    ars_debug(s);
    printf("joined: ");
    ars_join(s, "_");
    ars_debug(s);
    ars_free(s);
}

void test_join_empty_glue() {
    printf("### %s ", __func__);
    Ars *s = ars();
    ars_add(s, "hello");
    ars_add(s, "world");
    ars_debug(s);
    printf("joined: ");
    ars_join(s, "");
    ars_debug(s);
    ars_free(s);
}

void test_count() {
    printf("### %s ", __func__);
    Ars *s = ars();
    printf("0=%zu\n", ars_count(s));
    ars_add(s, "hello");
    printf("1=%zu\n", ars_count(s));
    ars_add(s, "world");
    printf("2=%zu\n", ars_count(s));
    ars_join(s, "");
    printf("1=%zu\n", ars_count(s));
    ars_free(s);
}

void test_nth() {
    printf("### %s ", __func__);
    Ars *s = ars();
    ars_add(s, "hello");
    ars_add(s, "world");
    printf("0=%s\n", ars_nth(s, 0));
    printf("1=%s\n", ars_nth(s, 1));
    ars_join(s, "");
    printf("0=%s\n", ars_nth(s, 0));
    ars_free(s);
}

void test_nth_dup() {
    printf("### %s ", __func__);
    Ars *s = ars();
    ars_add(s, "hello");
    ars_add(s, "world");
    char *t = ars_nth_dup(s, 1);
    printf("%s\n", t);
    free(t);
    ars_free(s);
}

void test_delete() {
    printf("### %s ", __func__);
    Ars *s = ars();
    ars_add(s, "aaaaa");
    ars_add(s, "bbbb");
    ars_add(s, "ccc");
    ars_add(s, "dddd");
    ars_add(s, "eeeee");
    ars_delete(s, 2);
    ars_debug(s);
    ars_free(s);
}

void test_insert() {
    printf("### %s ", __func__);
    Ars *s = ars();
    ars_add(s, "first");
    ars_add(s, "second");
    ars_add(s, "third");
    ars_add(s, "fourth");
    ars_add(s, "fifth");
    ars_insert(s, 2, "SecondAndHalf");
    ars_debug(s);
    ars_free(s);
}

void test_total_len() {
    printf("### %s ", __func__);
    printf("\n");
    Ars *a = ars();
    ars_add(a, "aaa");
    printf("3=%zu\n", ars_total_len(a));
    ars_add(a, "bbbbb");
    printf("8=%zu\n", ars_total_len(a));
    ars_add(a, "cccccc");
    printf("14=%zu\n", ars_total_len(a));
    ars_join(a, "");
    printf("14=%zu\n", ars_total_len(a));
    //char *s = ars_cstr_all(a);
    //printf("cstr  = %s\n", s);
    //free(s);
    ars_free(a);
}

void test_clone() {
    printf("### %s ", __func__);
    Ars *a = ars();
    ars_add(a, "aaa");
    ars_add(a, "bbbbb");
    ars_add(a, "cccccc");
    Ars *b = ars_clone(a);
    ars_free(a);
    ars_debug(b);
    ars_free(b);
}

void test_cstr_all() {
    printf("### %s ", __func__);
    Ars *a = ars();
    ars_add(a, (char*)"; voltage divider");
    ars_add(a, (char*)"V1 1 0 9");
    ars_add(a, (char*)"R1 1 2 1k");
    ars_add(a, (char*)"R2 2 0 500");
    ars_add(a, (char*)".end");
    ars_join(a, (char*)"\n");
    char *s = ars_cstr_all(a);
    printf("cstr  = %s\n", s);
    free(s);
    ars_free(a);
}

void test_set() {
    printf("### %s ", __func__);
    Ars *a = ars();
    ars_add(a, "Apple");
    ars_add(a, "is");
    ars_add(a, "green");
    ars_add(a, "fruit");
    ars_set(a, 2, "red");
    ars_join(a, " ");
    ars_debug(a);
    ars_free(a);
}

void test_split_char() {
    printf("### %s ", __func__);
    Ars *a = ars();
    ars_add(a, "red|green||blue");
    ars_split_char(a, '|');
    ars_debug(a);
    ars_free(a);
}

void test_last() {
    printf("### %s ", __func__);
    Ars *a = ars();
    ars_add(a, "red");
    printf("%s\n", ars_last(a));
    ars_add(a, "green");
    printf("%s\n", ars_last(a));
    ars_add(a, "blue");
    printf("%s\n", ars_last(a));
    ars_debug(a);
    ars_free(a);
}

void test_array() {
    printf("### %s ", __func__);
    Ars *a = ars();
    ars_add(a, "red");
    ars_add(a, "green");
    ars_add(a, "blue");
    size_t c = 0;
    char **s = ars_array(a, &c);
    printf("c=%zu\n", c);
    //printf("%s\n", *s);
    ars_array_free(s, c);
    ars_free(a);
}

void test_add_int() {
    printf("### %s ", __func__);
    Ars *a = ars();
    ars_add_uint(a, 15);
    ars_add(a, "Apples");
    ars_add_uint(a, 7);
    ars_add(a, "Bananas");
    ars_add_int(a, -123);
    ars_add(a, "Coins");
    ars_join(a, " ");
    ars_debug(a);
    ars_free(a);
}

void test_clear() {
    printf("### %s ", __func__);
    Ars *a = ars();
    ars_add(a, "aa");
    ars_add(a, "bbbb");
    ars_debug(a);
    ars_clear(a);
    ars_debug(a);
    ars_add(a, "cccc");
    ars_add(a, "ddddddd");
    ars_debug(a);
    ars_clear(a);
    ars_free(a);

    Ars *b = ars();
    ars_debug(b);
    ars_clear(b);
    ars_debug(b);
    ars_free(b);
}

void test_from_cstr() {
    printf("### %s ", __func__);
    Ars *a = ars_from_cstr("red|green|blue");
    ars_debug(a);
    ars_split_char(a, '|');
    ars_debug(a);
    ars_free(a);
}

void test_replace_empty_line() {
    printf("### %s ", __func__);
    Ars *a = ars_from_cstr("red|green||blue|white");
    ars_split_char(a, '|');
    ars_debug(a);
    for (size_t i = 0; i < ars_count(a); i++) {
        if (strlen(ars_nth(a, i)) == 0) {
            ars_set(a, i, "*");
        }
    }
    ars_debug(a);
    printf("length: %zu %zu %zu %zu %zu\n", ars_nth_len(a, 0), ars_nth_len(a, 1), ars_nth_len(a, 2), ars_nth_len(a, 3), ars_nth_len(a, 4));
    ars_free(a);
}

void tests() {
    test_hello();
    test_two_strings();
    test_one_empty_string();
    test_string_empty_string();
    test_nothing();
    test_join_empty_glue();
    test_count();
    test_nth();
    test_delete();
    test_insert();
    test_total_len();
    test_clone();
    test_cstr_all();
    test_nth_dup();
    test_set();
    test_split_char();
    test_last();
    test_array();
    test_add_int();
    test_clear();
    test_from_cstr();
    test_replace_empty_line();
}

int main(void) {
    tests();
    printf("DONE\n");
    return 0;
}
