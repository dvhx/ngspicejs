// Make various beeping sounds

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <alsa/asoundlib.h>
#include <alloca.h>

void beep(int frequency, int duration_ms);
void beep_cleanup();

