// Make various beeping sounds

void beep_check(int ret) {
    // check if alsa function returned non-zero code and exit on error
    if (ret < 0) {
        fprintf(stderr, "error: %s (%d)\n", snd_strerror(ret), ret);
        exit(1);
    }
}

void beep(int frequency, int duration_ms) {
    // beep with given frequency for given duration in ms
    snd_pcm_t *pcm;
    uint16_t amplitude = 10000;
    int samples = duration_ms * 48000 / 1000;
    short *buffer = (short*)malloc(samples * sizeof(short));
    beep_check(snd_pcm_open(&pcm, "default", SND_PCM_STREAM_PLAYBACK, 0));
    snd_pcm_hw_params_t *hw_params;
    snd_pcm_hw_params_alloca(&hw_params);
    beep_check(snd_pcm_hw_params_any(pcm, hw_params));
    beep_check(snd_pcm_hw_params_set_access(pcm, hw_params, SND_PCM_ACCESS_RW_INTERLEAVED));
    beep_check(snd_pcm_hw_params_set_format(pcm, hw_params, SND_PCM_FORMAT_S16_LE));
    beep_check(snd_pcm_hw_params_set_channels(pcm, hw_params, 1));
    beep_check(snd_pcm_hw_params_set_rate(pcm, hw_params, 48000, 0));
    //beep_check(snd_pcm_hw_params_set_periods(pcm, hw_params, 10, 0));
    //beep_check(snd_pcm_hw_params_set_period_time(pcm, hw_params, 100000, 0)); // 0.1 seconds period time
    beep_check(snd_pcm_hw_params(pcm, hw_params));
    //printf("%zu\n", samples);
    for (int i = 0; i < samples; i++) {
        buffer[i] = amplitude * sinf(((float)i / (float)48000) * 2 * 3.14159265358979323846 * frequency);
    }
    beep_check(snd_pcm_writei(pcm, buffer, samples));
    beep_check(snd_pcm_drain(pcm));
    beep_check(snd_pcm_close(pcm));
    snd_pcm_hw_free(pcm);
    //snd_pcm_hw_params_free(hw_params);
}

void beep_cleanup() {
    // Free alsa stuff
    snd_config_update_free_global();
}
