// Generate animated gif from array of sixel canvases
// linter: ngspicejs-lint --internal
"use strict";

function gif(aFileName, aCanvases, aDelay) {
    // Generate animated gif from array of sixel canvases
    assert_arguments_length(arguments, 3, 3, 'gif(filename,canvases,delay)');
    assert_string(aFileName, 'filename', 'gif(filename,canvases,delay)');
    assert_array(aCanvases, 'canvases', 'gif(filename,canvases,delay)');
    assert_number(aDelay, 'delay', 'gif(filename,canvases,delay)', 0, 100000);

    // combine palette from all canvases into single gif palette
    var i, f, palette = [], canvas_palette = [], seen = {}, cp, c, col = 0, key;
    for (i = 0; i < aCanvases.length; i++) {
        f = aCanvases[i];
        if (f.type !== 'sixel_canvas') {
            if (script_args().includes('--no-gif')) {
                warn('gif(' + aFileName + ',canvases,delay) - not saving gif because of the --no-gif param (perhaps a unit test?)');
                return;
            }
            throw new Exception("All gif frames must be sixel_canvas, not " + f.type);
        }
        // canvases must be same size
        if (f.width !== aCanvases[0].width || f.height !== aCanvases[0].height) {
            hint('Canvas #0 size: ' + aCanvases[0].width + 'x' + aCanvases[0].height);
            hint('Canvas #' + i + ' size: ' + f.width + 'x' + f.height);
            throw new Exception("When creating gif '" + aFileName + "' all canvases must be same size");
        }
        cp = {};
        canvas_palette.push(cp);
        //echo_json(f.palette);
        for (c = 0; c < f.palette.length; c++) {
            key = f.palette[c].r + ',' + f.palette[c].g + ',' + f.palette[c].b;
            col = seen[key];
            if (!seen.hasOwnProperty(key)) {
                col = palette.push({r: f.palette[c].r, g: f.palette[c].g, b: f.palette[c].b});
                seen[key] = col;
            }
            cp[c] = col;
        }
    }
    if (Object.keys(palette).length > 256) {
        throw new Exception('Too many colors (' + Object.keys(palette).length + ') in GIF "' + aFileName + '", limit is 256 colors');
    }

    // flatten palette into 1D array
    var flat = [];
    Object.values(palette).forEach((c) => {flat.push(c.r); flat.push(c.g); flat.push(c.b); });
    // convert RGB values from 0..100% to 0..255
    flat = flat.map((b) => Math.floor(255 * b / 100));
    var allowed_palette_size = [2, 4, 8, 16, 32, 64, 128, 256];
    while (!allowed_palette_size.includes(Math.floor(flat.length / 3))) {
        flat = flat.concat([0, 0, 0]);
    }
    var calculated_depth = allowed_palette_size.indexOf(Math.floor(flat.length / 3)) + 1;
    //echo('colors', flat.length, Math.floor(flat.length / 3), calculated_depth);
    //echo_json(flat);

    // gif header
    gif_begin(
        aFileName,
        aCanvases[0].width,
        aCanvases[0].height,
        flat,
        calculated_depth,
        -1,
        0
    );

    // add frames
    aCanvases.forEach((f) => {
        echo_progress();

        // 50% faster than array.flat() function for 2d array: arr.flat() = 150ms, this function = 30ms
        var fl = [];
        f.data.forEach(function (row) {
            row.forEach((pixel) => fl.push(pixel));
        });

        gif_frame(fl, aDelay);
    });

    // close gif
    gif_end();
}

globalThis.exports = {gif};
globalThis.gif = gif;
