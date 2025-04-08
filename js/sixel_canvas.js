// Sixel canvas
// linter: ngspicejs-lint --internal
"use strict";

function SixelCanvas(aWidth, aHeight) {
    // Constructor
    assert_arguments_length(arguments, 2, 2, 'sixel_canvas(width, height)');
    assert_equal(aWidth > 0, true, 'width', 'sixel_canvas(width, height)', 'Sixel canvas width must be positive');
    assert_equal(aHeight > 0, true, 'height', 'sixel_canvas(width, height)', 'Sixel canvas height must be positive');
    assert_equal(aHeight % 6, 0, 'height', 'sixel_canvas(width, height)', 'Sixel canvas height ' + aHeight + ' must be divisible by 6 (try ' + (aHeight - aHeight % 6 + 6) + ')');
    this.type = "sixel_canvas";
    this.palette = [];
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = aWidth;
    this.y2 = aHeight;
    this.width = aWidth;
    this.height = aHeight;
    this.data = new Array(aHeight).fill(null).map(() => new Array(aWidth).fill(0));
    this.log = [];
}

function sixel_canvas(aWidth, aHeight) {
    // Create sixel canvas of given size
    assert_arguments_length(arguments, 2, 2, 'sixel_canvas(width, height)');
    return new SixelCanvas(aWidth, aHeight);
}

SixelCanvas.prototype.echo = function (oMessage) {
    // Print canvas pixels on screen for debugging, to actually see graphics use .show()
    assert_arguments_length(arguments, 0, 1, 'sixel_canvas.echo(<message>)');
    if (oMessage !== undefined) {
        echo(oMessage);
    }
    echo(this.data.join('\n'));
    return this;
};

SixelCanvas.prototype.color = function (aR, aG, aB) {
    // Define new color and return it's index, RGB are from 0..100
    assert_arguments_length(arguments, 3, 3, 'sixel_canvas.color(r,g,b)');
    assert_integer(aR, 'r', 'sixel_canvas.color(r,g,b)', 0, 100);
    assert_integer(aG, 'g', 'sixel_canvas.color(r,g,b)', 0, 100);
    assert_integer(aB, 'b', 'sixel_canvas.color(r,g,b)', 0, 100);
    return this.palette.push({r: aR, g: aG, b: aB}) - 1;
};

SixelCanvas.prototype.viewport = function (aX, aY, aWidth, aHeight) {
    // Limit active region to given rectangle
    if (arguments.length === 0) {
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = this.width;
        this.y2 = this.height;
        return this;
    }
    assert_arguments_length(arguments, 4, 4, 'sixel_canvas.viewport(x,y,width,height)');
    assert_integer(aX, 'x', 'sixel_canvas.viewport(x,y,width,height)', 0, this.width);
    assert_integer(aY, 'y', 'sixel_canvas.viewport(x,y,width,height)', 0, this.height);
    assert_integer(aWidth, 'width', 'sixel_canvas.viewport(x,y,width,height)', 0, this.width);
    assert_integer(aHeight, 'height', 'sixel_canvas.viewport(x,y,width,height)', 0, this.height);
    this.x1 = aX;
    this.y1 = aY;
    this.x2 = aX + aWidth;
    this.y2 = aY + aHeight;
    return this;
};

SixelCanvas.prototype.pixel = function (aX, aY, aColor) {
    // Draw pixel
    if (aX >= this.x1 &&
        aY >= this.y1 &&
        aX <= (this.x2 - 1) &&
        aY <= (this.y2 - 1) &&
        aColor <= this.palette.length - 1) {
        if (this.data[aY]) {
            this.data[aY][aX] = aColor;
        }
    }
};

SixelCanvas.prototype.fill_rect = function (aX, aY, aWidth, aHeight, aColor) {
    // Fill rectangle with color
    assert_arguments_length(arguments, 5, 5, 'sixel_canvas.fill_rect(x,y,w,h,color)');
    assert_number(aX, 'x', 'sixel_canvas.fill_rect(x,y,w,h,color)');//, 0, this.width - 1);
    assert_number(aY, 'y', 'sixel_canvas.fill_rect(x,y,w,h,color)');//, 0, this.height - 1);
    assert_number(aWidth, 'w', 'sixel_canvas.fill_rect(x,y,w,h,color)', 0);
    assert_number(aHeight, 'h', 'sixel_canvas.fill_rect(x,y,w,h,color)', 0);
    assert_number(aColor, 'color', 'sixel_canvas.fill_rect(x,y,w,h,color)', 0, this.palette.length - 1);
    var x, y;
    for (y = aY; y < aY + aHeight; y++) {
        for (x = aX; x < aX + aWidth; x++) {
            this.pixel(x, y, aColor);
        }
    }
    return this;
};

SixelCanvas.prototype.clear = function (aColor) {
    // Clear canvas using color
    assert_arguments_length(arguments, 1, 1, 'sixel_canvas.clear(color)');
    assert_number(aColor, 'color', 'sixel_canvas.clear(color)', 0, this.palette.length - 1);
    this.data = new Array(this.height).fill(null).map(() => new Array(this.width).fill(aColor));
};

SixelCanvas.prototype.stroke_rect = function (aX, aY, aWidth, aHeight, aColor) {
    // Stroke rectangle
    assert_arguments_length(arguments, 5, 5, 'sixel_canvas.stroke_rect(x,y,w,h,color)');
    assert_number(aX, 'x', 'sixel_canvas.stroke_rect(x,y,w,h,color)', 0, this.width - 1);
    assert_number(aY, 'y', 'sixel_canvas.stroke_rect(x,y,w,h,color)', 0, this.height - 1);
    assert_number(aWidth, 'w', 'sixel_canvas.stroke_rect(x,y,w,h,color)', 0);
    assert_number(aHeight, 'h', 'sixel_canvas.stroke_rect(x,y,w,h,color)', 0);
    assert_number(aColor, 'color', 'sixel_canvas.stroke_rect(x,y,w,h,color)', 0, this.palette.length - 1);
    this.line(aX, aY, aX + aWidth, aY, aColor);
    this.line(aX + aWidth, aY, aX + aWidth, aY + aHeight, aColor);
    this.line(aX + aWidth, aY + aHeight, aX, aY + aHeight, aColor);
    this.line(aX, aY + aHeight, aX, aY, aColor);
    return this;
};

SixelCanvas.prototype.line = function (aX1, aY1, aX2, aY2, aColor) {
    // Draw line, uses fast algorithm for orthogonal line and bresenham for diagonal lines
    assert_arguments_length(arguments, 5, 5, 'sixel_canvas.line(x1,y1,x2,y2,color)');
    assert_integer(aX1, 'x1', 'sixel_canvas.line(x1,y1,x2,y2,color)');
    assert_integer(aY1, 'y1', 'sixel_canvas.line(x1,y1,x2,y2,color)');
    assert_integer(aX1, 'x2', 'sixel_canvas.line(x1,y1,x2,y2,color)');
    assert_integer(aX2, 'y2', 'sixel_canvas.line(x1,y1,x2,y2,color)');
    assert_integer(aColor, 'color', 'sixel_canvas.line(x1,y1,x2,y2,color)');
    assert_number(aColor, 'color', 'sixel_canvas.pixel(x1,y1,x2,y2,color)', 0, this.palette.length - 1);
    var t = this, x, y;
    function one(aX, aY) {
        t.pixel(aX, aY, aColor);
    }
    // if 2 points outside screen skip it
    if (
        (aX1 < 0 && aX2 < 0) ||
        (aY1 < 0 && aY2 < 0) ||
        (aX1 > this.width && aX2 > this.width) ||
        (aY1 > this.height && aY2 > this.height)
        ) {
        return this;
    }
    // horizontal line
    if (aY1 === aY2) {
        if (aX1 > aX2) {
            [aX1, aX2] = [aX2, aX1];
        }
        for (x = aX1; x <= aX2; x++) {
            one(x, aY1);
        }
        return this;
    }
    // vertical line
    if (aX1 === aX2) {
        if (aY1 > aY2) {
            [aY1, aY2] = [aY2, aY1];
        }
        for (y = aY1; y <= aY2; y++) {
            one(aX1, y);
        }
        return this;
    }
    // arbitrary line
    bresenham(aX1, aY1, aX2, aY2, one);
};

SixelCanvas.prototype.move_to = function (aX, aY) {
    // Move cursor to [x,y]
    assert_arguments_length(arguments, 2, 2, 'sixel_canvas.move_to(x,y)');
    assert_number(aX, 'x', 'sixel_canvas.move_to(x,y)');
    assert_number(aY, 'y', 'sixel_canvas.move_to(x,y)');
    this.x = aX;
    this.y = aY;
};

SixelCanvas.prototype.line_to = function (aX, aY, aColor) {
    // Draw line to [x,y] and move cursor there
    assert_arguments_length(arguments, 3, 3, 'sixel_canvas.line_to(x,y,color)');
    assert_number(aX, 'x', 'sixel_canvas.line_to(x,y,color)');
    assert_number(aY, 'y', 'sixel_canvas.line_to(x,y,color)');
    this.line(this.x, this.y, aX, aY, aColor);
    this.x = aX;
    this.y = aY;
};

SixelCanvas.prototype.label = function (aText, aX, aY, oColor, oFont) {
    // Draw text
    assert_arguments_length(arguments, 4, 5, 'sixel_canvas.label(text,x,y,color,font)');
    assert_string(aText, 'text', 'sixel_canvas.label(text,x,y,color,font)');
    assert_integer(aX, 'x', 'sixel_canvas.label(text,x,y,color,font)');
    assert_integer(aY, 'y', 'sixel_canvas.label(text,x,y,color,font)');
    oFont = oFont || globalThis.font_neo_sans;
    oColor = oColor === undefined ? 1 : oColor;
    aY -= oFont.baseline - 1;
    var i, g, j, x, y, k = oFont.kerning, c, cold;
    for (i = 0; i < aText.length; i++) {
        cold = c;
        c = aText.charAt(i);
        g = oFont[c] || oFont.missing;
        if (k.hasOwnProperty(cold + c)) {
            aX += k[cold + c];
        }
        for (j = 1; j < g.length; j+= 2) {
            x = g[j];
            y = g[j + 1];
            this.pixel(aX + x, aY + y, oColor);
        }
        aX += g[0] + 0;
    }
    return this;
};

SixelCanvas.prototype.label_size = function (aText, oFont) {
    // Measure text width, height and baseline position of text
    assert_arguments_length(arguments, 1, 2, 'sixel_canvas.label_size(text,font)');
    assert_string(aText, 'text', 'sixel_canvas.label_size(text,font)');
    oFont = oFont || globalThis.font_neo_sans;
    var i, g, k = oFont.kerning, c, cold, ret = 0;
    for (i = 0; i < aText.length; i++) {
        cold = c;
        c = aText.charAt(i);
        g = oFont[c] || oFont.missing;
        if (k.hasOwnProperty(cold + c)) {
            ret += k[cold + c];
        }
        ret += g[0] + 0;
    }
    return {
        width: ret,
        height: oFont.height,
        baseline: oFont.baseline
    };
};

SixelCanvas.prototype.label_width = function (aText, oFont) {
    // Measure label width
    assert_arguments_length(arguments, 1, 2, 'sixel_canvas.label_width(text,font)');
    return this.label_size(aText, oFont).width;
};

SixelCanvas.prototype.show = function () {
    // Show graphics on screen
    assert_arguments_length(arguments, 0, 0, 'sixel_canvas.show()');
    echo_raw(String.fromCharCode(27) + 'Pq\n');
    this.palette.forEach((cc,ii) => {
        echo_raw('#' + ii + ';2;' + cc.r + ';' + cc.g + ';' + cc.b);
    });
    echo_raw('\n');
    var x, y, p, d = this.data, pl = this.palette.length - 1;
    function one(c, i) {
        echo_raw('#' + i);
        for (x = 0; x < d[0].length; x++) {
            p = 63 +
                (d[y][x] === i ? 1 : 0) +
                2 * (d[y + 1][x] === i ? 1 : 0) +
                4 * (d[y + 2][x] === i ? 1 : 0) +
                8 * (d[y + 3][x] === i ? 1 : 0) +
                16 * (d[y + 4][x] === i ? 1 : 0) +
                32 * (d[y + 5][x] === i ? 1 : 0);
            echo_raw(String.fromCharCode(p));
        }
        echo_raw((i === pl ? '$-' : '$') + '\n');
    }
    for (y = 0; y < d.length; y += 6) {
        this.palette.forEach(one);
    }
    echo_raw(String.fromCharCode(27) + '\\');
    echo_raw("\n");
    echo_flush();
};

globalThis.exports = {SixelCanvas, sixel_canvas};
globalThis.sixel_canvas = sixel_canvas;
Internal.SixelCanvas = SixelCanvas;
