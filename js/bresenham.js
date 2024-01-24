// Bresenham line algorithm
// linter: ngspicejs-lint --internal
"use strict";

function bresenham(x1, y1, x2, y2, pixelCallback) {
    // Bresenham line algorithm
    assert_arguments_length(arguments, 5, 5, 'bresenham(x1,y1,x2,y2,pixel_callback)');
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var x = x1;
    var y = y1;
    var hs = (x1 < x2) ? 1 : -1;
    var vs = (y1 < y2) ? 1 : -1;
    var d = dx - dy;
    var d2;
    while (true) {
        d2 = 2 * d;
        if (d2 > -dy) {
            d -= dy;
            x += hs;
        }
        if (d2 < dx) {
            d += dx;
            y += vs;
        }
        if ((x == x2) && (y == y2)) {
            break;
        }
        pixelCallback(x, y);
    }
    pixelCallback(x1, y1);
    pixelCallback(x2, y2);
}

globalThis.exports = {bresenham};
Internal.bresenham = bresenham;
