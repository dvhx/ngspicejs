// Palette of visually distinct colors, used in multi-series charts
// linter: ngspicejs-lint --internal
"use strict";

// jshint -W079
var distinct_colors = {
    red: [255,0,0],              // 0
    green: [0,255,0],            // 1
    blue: [0,0,255],             // 2
    orange: [223, 120, 18],      // 3
    aqua: [0,255,255],           // 4
    fuchsia: [255,0,255],        // 5
    brown: [119,18,18],          // 6
    dark_green: [62,119,18],     // 7
    sky: [90,143,210],           // 8
    pink: [255,169,250],         // 9
    yellow: [255,190,0],         // 10
    black: [0, 0, 0],            // 11
    dark_gray: [63, 63, 63],     // 12
    gray: [127, 127, 127],       // 13
    light_gray: [191, 191, 191], // 14
};
// jshint +W079

globalThis.distinct_colors = distinct_colors;
globalThis.exports = {distinct_colors};
