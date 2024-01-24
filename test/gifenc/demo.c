#include "../../cpp/depend/gifenc/gifenc.h"
#include "../../cpp/depend/gifenc/gifenc.c"

int main(int argc, char** argv) {
    uint8_t palette[] = {
        0x00, 0x00, 0x00,   /* entry 0: black */
        0xFF, 0xFF, 0xFF,   /* entry 1: white */
        0xFF, 0x00, 0x00,   /* entry 2: red */
        0x00, 0x00, 0xFF,   /* entry 3: blue */
    };
    int depth = 2;          /* palette has 1 << 2 (i.e. 4) entries */
    uint8_t pixels[] = {
        2, 2, 2, 2,
        2, 1, 1, 1,
        2, 1, 1, 1,
        2, 2, 2, 1,
        2, 1, 1, 1,
        2, 1, 1, 1,
        2, 1, 1, 1
    };
    uint8_t pixels2[] = {
        2, 1, 1, 2,
        2, 1, 1, 2,
        2, 1, 1, 2,
        2, 1, 1, 2,
        2, 1, 1, 2,
        2, 1, 1, 2,
        1, 2, 2, 1
    };
    uint8_t pixels3[] = {
        2, 1, 1, 2,
        2, 1, 1, 2,
        1, 1, 1, 1,
        1, 2, 2, 1,
        1, 1, 1, 1,
        2, 1, 1, 2,
        1, 2, 2, 1
    };
    char *s = (char*)malloc(123);
    s[0] = 'a';
    s[1] = '\0';
    printf("%s\n", s);
    ge_GIF *gif = ge_new_gif("F.gif", 4, 7, palette, depth, -1, 0);
    memcpy(gif->frame, pixels, sizeof(pixels));
    ge_add_frame(gif, 100);
    memcpy(gif->frame, pixels2, sizeof(pixels2));
    ge_add_frame(gif, 100);
    memcpy(gif->frame, pixels3, sizeof(pixels3));
    ge_add_frame(gif, 100);
    ge_close_gif(gif);
    return 0;
}
