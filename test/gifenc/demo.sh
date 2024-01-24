rm ./demo 2>/dev/null
rm F.gif 2>/dev/null
gcc -o demo demo.c && ./demo && md5sum F.gif
