// Write transient analysis vector to wav file
// linter: ngspicejs-lint --internal
"use strict";

function file_write_wav(aFileName, aTimes, aSamples, aScale) {
    // Write transient analysis vector to wav file (scale should be 1 or other multiplier, if undefined wav volume will be normalized)
    assert_arguments_length(arguments, 3, 4, 'file_write_wav(filename,times,samples,<scale>)');
    Internal.assert_string(aFileName, 'filename', 'file_write_wav(filename,times,samples,scale)');
    Internal.assert_array_of_numbers(aTimes, 'times', 'file_write_wav(filename,times,samples,scale)', false);
    Internal.assert_array_of_numbers(aSamples, 'samples', 'file_write_wav(filename,times,samples,scale)', false);
    Internal.assert_array_same_length(aTimes, aSamples, 'file_write_wav(filename,times,samples,scale)');
    if (aScale === undefined) {
        aScale = 1 / array_range(aSamples);
    }
    aSamples = array_scale(aSamples, aScale);
    var dur = aTimes.at(-1);
    var len = Math.ceil(dur * 48000);
    //var dt = dur / len;
    //echo('dur', dur, 'len', len, 'dt', dt);
    var data = new Array(44 + 2 * len);
    var bits_per_sample = 16;
    // WAV header
    // 'RIFF'
    data[0] = 'R'.charCodeAt(0);
    data[1] = 'I'.charCodeAt(0);
    data[2] = 'F'.charCodeAt(0);
    data[3] = 'F'.charCodeAt(0);
    // chunk size
    var chunk_size = 38 + 2 * len - 2; // why - 2 ?
    data[4] = (chunk_size >> 0) % 256;
    data[5] = (chunk_size >> 8) % 256;
    data[6] = (chunk_size >> 16) % 256;
    data[7] = (chunk_size >> 24) % 256;
    // 'WAVEfmt '
    data[8] = 'W'.charCodeAt(0);
    data[9] = 'A'.charCodeAt(0);
    data[10] = 'V'.charCodeAt(0);
    data[11] = 'E'.charCodeAt(0);
    data[12] = 'f'.charCodeAt(0);
    data[13] = 'm'.charCodeAt(0);
    data[14] = 't'.charCodeAt(0);
    data[15] = ' '.charCodeAt(0);
    // [16,0,0,0] = PCM
    data[16] = 16;
    data[17] = 0;
    data[18] = 0;
    data[19] = 0;
    // @20 [1,0] = linear quantization
    data[20] = 1;
    data[21] = 0;
    // @22 [1,0] = one channel
    var num_channels = 1;
    data[22] = num_channels;
    data[23] = 0;
    // @24 [x,x,x,x] = sample rate 44100
    //var sample_rate = h[24] + h[25] * 256 + h[26] * 256 * 256 + h[27] * 256 * 256 * 256;
    var sample_rate = 48000;
    data[24] = (sample_rate >> 0) % 256;
    data[25] = (sample_rate >> 8) % 256;
    data[26] = (sample_rate >> 16) % 256;
    data[27] = (sample_rate >> 24) % 256;
    // @28 [x,x,x,x] = byte rate
    //var byte_rate = h[28] + h[29] * 256 + h[30] * 256 * 256 + h[31] * 256 * 256 * 256;
    var byte_rate = sample_rate * num_channels * bits_per_sample / 8;
    data[28] = (byte_rate >> 0) % 256;
    data[29] = (byte_rate >> 8) % 256;
    data[30] = (byte_rate >> 16) % 256;
    data[31] = (byte_rate >> 24) % 256;
    // @32,33 = block align
    var block_align = num_channels * bits_per_sample / 8;
    data[32] = (block_align >> 0) % 256;
    data[33] = (block_align >> 8) % 256;
    // @34,35 = bits per sample
    data[34] = 16;
    data[35] = 0;
    // @36..39 = "data"
    data[36] = 'd'.charCodeAt(0);
    data[37] = 'a'.charCodeAt(0);
    data[38] = 't'.charCodeAt(0);
    data[39] = 'a'.charCodeAt(0);
    // @40..43 data size
    //var data_size = h[40] + h[41] * 256 + h[42] * 256 * 256 + h[43] * 256 * 256 * 256;
    var data_size = len * num_channels * bits_per_sample / 8;
    data[40] = (data_size >> 0) % 256;
    data[41] = (data_size >> 8) % 256;
    data[42] = (data_size >> 16) % 256;
    data[43] = (data_size >> 24) % 256;
    // float data
    var fd = linearize(aTimes, aSamples, sample_rate, 'in file_write_wav(' + aFileName + '), lower the transient analysis step!');
    //echo_json(fd);
    var tt = [], i = 0;
    data.forEach(() => {i++; tt.push(i);});
    //chart_xy().add_series(tt, fd).show();
    // convert to 16 bit pcm
    var n = 44, s;
    for (i = 0; i <= fd.length; i++) {
        s = Math.floor(fd[i] * 32768);
        data[n] = s % 256;
        //echo(data[n]);
        n++;
        data[n] = (s >> 8) % 256;
        //echo(data[n]);
        n++;
    }
    return file_write_binary(aFileName, data);
}

globalThis.exports = {file_write_wav};
globalThis.file_write_wav = file_write_wav;
