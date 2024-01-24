// Read wav file, return sample rate, times and samples
// linter: ngspicejs-lint --internal
"use strict";

function file_read_wav(aFileName) {
    // Read wav file, return sample rate, times and samples
    assert_arguments_length(arguments, 1, 1, 'file_read_wav(filename)');
    assert_string(aFileName, 'filename', 'file_read_wav(filename)');
    assert_string(aFileName, 'filename', 'file_read_wav(filename)');
    if (!file_exists(aFileName)) {
        throw new Exception('Wav file "' + aFileName + '" does not exist!');
    }
    var b = file_read_binary(aFileName),
        h = b.slice(0, 44),
        len,
        i;
    //echo_json(b.slice(44));
    // check header for known wav format
    if (h.slice(0, 4).map((a) => String.fromCharCode(a)).join('') !== 'RIFF') {
        throw new Exception("file_read_wav('" + aFileName + "') - RIFF header is missing");
    }
    if (h.slice(8, 16).map((a) => String.fromCharCode(a)).join('') !== 'WAVEfmt ') {
        throw new Exception("file_read_wav('" + aFileName + "') - WAVEfmt header is missing");
    }
    // [16,0,0,0] = PCM
    if (h[16] !== 16 || h[17] !== 0 || h[18] !== 0 || h[19] !== 0) {
        throw new Exception("file_read_wav('" + aFileName + "') - only 16-bit PCM format is supported (expected 16,0,0,0 at position 16..19)");
    }
    // @20 [1,0] = quantization
    if (h[20] !== 1 || h[21] !== 0) {
        throw new Exception("file_read_wav('" + aFileName + "') - only linear PCM quantization is supported (expected 1,0 at position 20..21)");
    }
    // @22 [1,0] = one channel
    if (h[22] !== 1 || h[23] !== 0) {
        throw new Exception("file_read_wav('" + aFileName + "') - only 1 channel (MONO) is supported (expected 1,0 at position 22..23)");
    }
    // @24 [x,x,x,x] = sample rate
    var sample_rate = h[24] + h[25] * 256 + h[26] * 256 * 256 + h[27] * 256 * 256 * 256;
    //if (sample_rate !== '44100')
    //echo(sample_rate);
    // @28 [x,x,x,x] = byte rate
    //var byte_rate = h[28] + h[29] * 256 + h[30] * 256 * 256 + h[31] * 256 * 256 * 256;
    //echo(byte_rate);
    // @32,33 = block align
    // @34,35 = bits per sample
    var bits_per_sample = h[34] + h[35] * 256;
    if (bits_per_sample !== 16) {
        throw new Exception("file_read_wav('" + aFileName + "') - only 16 bits per sample is supported (expected 16,0 at position 34..35)");
    }
    // @36..39 = "data"
    if (h.slice(36, 40).map((a) => String.fromCharCode(a)).join('') !== 'data') {
        throw new Exception("file_read_wav('" + aFileName + "') - 'data' header is missing at position 36..39");
    }
    // @40..43 data size
    var data_size = h[40] + h[41] * 256 + h[42] * 256 * 256 + h[43] * 256 * 256 * 256;
    if (data_size !== b.length - 44) {
        throw new Exception("file_read_wav('" + aFileName + "') - expected data size " + b.length + "-44 but got " + data_size);
    }
    // parse data
    len = (b.length - 44) / 2;
    //echo('len', len);
    var tim = new Array(len);
    var ret = new Array(len);
    var o = 0, dt = 1 / sample_rate;
    for (i = 0; i < 2 * len; i += 2) {
        ret[o] = b[44 + i] + b[44 + i + 1] * 256;
        if (ret[o] > 32768) {
            ret[o] = ret[o] - 65535;
        }
        ret[o] /= 32768;
        tim[o] = o * dt;
        o++;
    }
    return {
        sample_rate,
        time: tim,
        data: ret
    };
}

globalThis.exports = {file_read_wav};
globalThis.file_read_wav = file_read_wav;
