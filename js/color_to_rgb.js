// XY Chart rendered in terminal using either sixels (if supported) or as ascii art
// linter: ngspicejs-lint --internal
"use strict";

function color_to_rgb(aColor) {
    // Convert color in various formats into [R,G,B] 0..255
    // [255,127,0]
    if (Array.isArray(aColor) && aColor.length === 3 && typeof aColor[0] === 'number') {
        return aColor.slice();
    }
    // '#ff0000'
    if (typeof aColor === 'string' && aColor.match(/\#[0-9a-fA-F]{6}/)) {
        return [
            parseInt(aColor.substr(1,2), 16),
            parseInt(aColor.substr(3,2), 16),
            parseInt(aColor.substr(5,2), 16),
        ];
    }
    throw new Exception('Unsupported color format "' + aColor + '", use [r,g,b] r,g,b=0..255 or use hex string "#RRGGBB"');
}

function color_to_sixel(aColor) {
    // Convert color in various formats into [R,G,B] 0..100
    return color_to_rgb(aColor).map((v) => Math.floor(100 * v/255));
}

//echo(color_to_rgb([255,127,0]));
//echo(color_to_rgb('#ff7700'));

function color_gradient(aFrom, aTo, aSteps) {
    // Create a gradient between 2 colors with given number of steps
    return Array.from({
        length: aSteps
    }, (v, i) => {
        const t = i / (aSteps - 1);
        return [
            Math.round(aFrom[0] + (aTo[0] - aFrom[0]) * t), // R
            Math.round(aFrom[1] + (aTo[1] - aFrom[1]) * t), // G
            Math.round(aFrom[2] + (aTo[2] - aFrom[2]) * t)  // B
        ];
    });
}

//echo_json(color_gradient([255,0,0], [255, 255, 255], 5));


globalThis.color_to_rgb = color_to_rgb;
globalThis.color_to_sixel = color_to_sixel;
globalThis.color_gradient = color_gradient;
globalThis.exports = {color_to_rgb, color_to_sixel, color_gradient};
