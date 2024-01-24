// Ascii canvas
// linter: ngspicejs-lint --internal
"use strict";

function AsciiCanvas(aWidth, aHeight) {
    // Constructor
    assert_arguments_length(arguments, 2, 2, 'ascii_canvas(width, height)');
    assert_equal(aWidth > 0, true, 'width', 'ascii_canvas(width, height)', 'Ascii canvas width must be positive');
    assert_equal(aHeight > 0, true, 'height', 'ascii_canvas(width, height)', 'Ascii canvas height must be positive');
    this.type = "ascii_canvas";
    this.width = aWidth;
    this.height = aHeight;
    this.data = new Array(aHeight).fill(null).map(() => new Array(aWidth).fill(' '));
    this.log = [];
}

function ascii_canvas(aWidth, aHeight) {
    // Create ascii canvas of given size
    assert_arguments_length(arguments, 2, 2, 'ascii_canvas(width, height)');
    return new AsciiCanvas(aWidth, aHeight);
}

AsciiCanvas.prototype.pixel = function (aX, aY, aCharacter) {
    // Put a character on [x,y] coordinates of canvas
    if (aX >= 0 && aY >= 0 && aX <= this.width - 1 && aY <= this.height - 1) {
        this.data[aY][aX] = aCharacter;
    }
    return this;
};

AsciiCanvas.prototype.fill_rect = function (aX, aY, aWidth, aHeight, aCharacter) {
    // Fill rectangle with given character
    assert_arguments_length(arguments, 5, 5, 'ascii_canvas.fill_rect(x,y,width,height,char)');
    assert_number(aX, 'x', 'ascii_canvas.fill_rect(x,y,w,h,character)', 0, this.width - 1);
    assert_number(aY, 'y', 'ascii_canvas.fill_rect(x,y,w,h,character)', 0, this.height - 1);
    assert_number(aWidth, 'w', 'ascii_canvas.fill_rect(x,y,w,h,character)', 0);
    assert_number(aHeight, 'h', 'ascii_canvas.fill_rect(x,y,w,h,character)', 0);
    assert_string(aCharacter, 'character', 'ascii_canvas.fill_rect(x,y,w,h,character)');
    var x, y;
    for (y = aY; y < aY + aHeight; y++) {
        for (x = aX; x < aX + aWidth; x++) {
            this.pixel(x, y, aCharacter);
        }
    }
    return this;
};

AsciiCanvas.prototype.clear = function (aCharacter) {
    // Clear canvas with given character
    assert_arguments_length(arguments, 0, 1, 'ascii_canvas.clear(char)');
    if (arguments.length >= 1) {
        assert_string(aCharacter, 'character', 'ascii_canvas.pixel(x,y,w,h,character)');
    }
    aCharacter = aCharacter || ' ';
    this.data = new Array(this.height).fill(null).map(() => new Array(this.width).fill(aCharacter));
};

AsciiCanvas.prototype.stroke_rect = function (aX, aY, aWidth, aHeight, aCharacter) {
    // Stroke rectangle
    assert_arguments_length(arguments, 5, 5, 'ascii_canvas.stroke_rect(x,y,width,height,char)');
    assert_number(aX, 'x', 'ascii_canvas.stroke_rect(x,y,w,h,character)', 0, this.width - 1);
    assert_number(aY, 'y', 'ascii_canvas.stroke_rect(x,y,w,h,character)', 0, this.height - 1);
    assert_number(aWidth, 'w', 'ascii_canvas.stroke_rect(x,y,w,h,character)', 0);
    assert_number(aHeight, 'h', 'ascii_canvas.stroke_rect(x,y,w,h,character)', 0);
    assert_string(aCharacter, 'character', 'ascii_canvas.pixel(x,y,w,h,character)');
    this.move_to(aX, aY);
    this.line_to(aX + aWidth, aY, aCharacter);
    this.line_to(aX + aWidth, aY + aHeight, aCharacter);
    this.line_to(aX, aY + aHeight, aCharacter);
    this.line_to(aX, aY, aCharacter);
    return this;
};

AsciiCanvas.prototype.line = function (aX1, aY1, aX2, aY2, aCharacter) {
    // Draw a line
    assert_arguments_length(arguments, 5, 5, 'ascii_canvas.line(x1,y1,x2,y2,character)');
    assert_integer(aX1, 'x1', 'ascii_canvas.line(x1,y1,x2,y2,character)');
    assert_integer(aY1, 'y1', 'ascii_canvas.line(x1,y1,x2,y2,character)');
    assert_integer(aX1, 'x2', 'ascii_canvas.line(x1,y1,x2,y2,character)');
    assert_integer(aX2, 'y2', 'ascii_canvas.line(x1,y1,x2,y2,character)');
    assert_string(aCharacter, 'character', 'ascii_canvas.pixel(x,y,w,h,character)');
    var t = this;
    function one(aX, aY) {
        t.pixel(aX, aY, aCharacter);
    }
    one(aX1, aY1);
    bresenham(aX1, aY1, aX2, aY2, one);
    one(aX2, aY2);
    this.x = aX2;
    this.y = aY2;
    return this;
};

AsciiCanvas.prototype.move_to = function (aX, aY) {
    // Move cursor to given position
    assert_arguments_length(arguments, 2, 2, 'ascii_canvas.move_to(x,y)');
    assert_number(aX, 'x', 'ascii_canvas.move_to(x,y)');
    assert_number(aY, 'y', 'ascii_canvas.move_to(x,y)');
    this.x = aX;
    this.y = aY;
};

AsciiCanvas.prototype.line_to = function (aX, aY, aCharacter) {
    // Draw line from current cursor position to new position
    assert_arguments_length(arguments, 3, 3, 'ascii_canvas.line_to(x,y,character)');
    assert_number(aX, 'x', 'ascii_canvas.line_to(x,y,character)');
    assert_number(aY, 'y', 'ascii_canvas.line_to(x,y,character)');
    assert_string(aCharacter, 'character', 'ascii_canvas.line_to(x,y,character)');
    this.line(this.x, this.y, aX, aY, aCharacter);
    this.x = aX;
    this.y = aY;
    return this;
};

AsciiCanvas.prototype.label = function (aText, aX, aY) {
    // Draw text label at given position
    assert_arguments_length(arguments, 3, 4, 'ascii_canvas.label(text,x,y)'); // allow 4 so that it can be called the same as sixel version
    assert_string(aText, 'text', 'ascii_canvas.label(text,x,y)');
    assert_integer(aX, 'x', 'ascii_canvas.label(text,x,y)');
    assert_integer(aY, 'y', 'ascii_canvas.label(text,x,y)');
    for (var i = 0; i < aText.length; i++) {
        this.pixel(aX + i, aY, aText.charAt(i));
    }
    return this;
};

AsciiCanvas.prototype.show = function () {
    // Show canvas on screen
    assert_arguments_length(arguments, 0, 0, 'ascii_canvas.show()');
    echo(this.data.map(a => a.join('')).join('\n'));
    return this;
};

globalThis.exports = {AsciiCanvas, ascii_canvas};
globalThis.ascii_canvas = ascii_canvas;
Internal.AsciiCanvas = AsciiCanvas;
