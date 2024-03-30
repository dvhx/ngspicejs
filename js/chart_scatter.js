// Color scatter plot (x,y,value)
// linter: ngspicejs-lint --internal
"use strict";

function ChartScatter(aDataX, aDataY, aValues, aWidth, aHeight, aMinX, aMaxX, aMinY, aMaxY, aTitle, aLabelX, aLabelY, aLogX, aLogY, aSize, aLevels) {
    // Constructor
    assert_arguments_length(arguments, 0, 16, 'chart_scatter(dataX,dataY,aValues,width,height,minX,maxX,minY,maxY,title,labelX,labelY,logx,logy,size,levels)');
    this.type = 'chart_scatter';
    this.attr = {width: 640, height: 480, size: 8, levels: 10};
    // all attr as object in first argument
    if (arguments.length === 1 && typeof aDataX === 'object') {
        for (const [k, v] of Object.entries(aDataX)) {
            this.attr[k] = v;
        }
        this.validate();
        return;
    }
    // individual arguments
    if (aDataX !== undefined) {
        this.data_x(aDataX);
    }
    if (aDataY !== undefined) {
        this.data_y(aDataY);
    }
    if (aValues !== undefined) {
        this.values(aValues);
    }
    if (aWidth !== undefined) {
        this.width(aWidth);
    }
    if (aHeight !== undefined) {
        this.height(aHeight);
    }
    if (aMinX !== undefined) {
        this.min_x(aMinX);
    }
    if (aMaxX !== undefined) {
        this.max_x(aMaxX);
    }
    if (aMinY !== undefined) {
        this.min_y(aMinY);
    }
    if (aMaxY !== undefined) {
        this.max_y(aMaxY);
    }
    if (aTitle !== undefined) {
        this.title(aTitle);
    }
    if (aLabelX !== undefined) {
        this.label_x(aLabelX);
    }
    if (aLabelY !== undefined) {
        this.label_y(aLabelY);
    }
    if (aLogX !== undefined) {
        this.log_x(aLogX);
    }
    if (aLogY !== undefined) {
        this.log_y(aLogY);
    }
    if (aSize !== undefined) {
        this.size(aSize);
    }
    if (aLevels !== undefined) {
        this.levels(aLevels);
    }
}

ChartScatter.fixed_width = 0;
ChartScatter.fixed_height = 0;
ChartScatter.ascii_scale_width = 0.16;
ChartScatter.ascii_scale_height = 0.09;
ChartScatter.force_ascii = false;

function chart_scatter(aDataX, aDataY, aValues, aWidth, aHeight, aMinX, aMaxX, aMinY, aMaxY, aTitle, aLabelX, aLabelY, aLogX, aLogY, aSize, aLevels) {
    // Create scatter chart
    assert_arguments_length(arguments, 0, 16, 'chart_scatter(dataX,dataY,values,width,height,minX,maxX,minY,maxY,title,labelX,labelY,logX,logY,size,levels)');
    if (arguments.length === 1 && typeof aDataX === 'object') {
        return new ChartScatter(aDataX);
    }
    return new ChartScatter(aDataX, aDataY, aValues, aWidth, aHeight, aMinX, aMaxX, aMinY, aMaxY, aTitle, aLabelX, aLabelY, aLogX, aLogY, aSize, aLevels);
}

ChartScatter.prototype.data_x = function (aValue) {
    // Set data_x attribute
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.data_x(array)');
    this.attr.data_x = aValue;
    return this;
};

ChartScatter.prototype.data_y = function (aValue) {
    // Set data_y attribute
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.data_y(array)');
    this.attr.data_y = aValue;
    return this;
};

ChartScatter.prototype.values = function (aValues) {
    // Set values attribute
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.values(array)');
    this.attr.values = aValues;
    return this;
};

ChartScatter.prototype.width = function (aValue) {
    // Set width attribute
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.width(value)');
    this.attr.width = aValue;
    return this;
};

ChartScatter.prototype.height = function (aValue) {
    // Set height attribute
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.height(value)');
    this.attr.height = aValue;
    return this;
};

ChartScatter.prototype.min_x = function (aValue) {
    // Set min_x attribute
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.min_x(value)');
    this.attr.min_x = aValue;
    return this;
};

ChartScatter.prototype.max_x = function (aValue) {
    // Set max_x attribute
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.max_x(value)');
    this.attr.max_x = aValue;
    return this;
};

ChartScatter.prototype.min_y = function (aValue) {
    // Set min_y attribute
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.min_y(value)');
    this.attr.min_y = aValue;
    return this;
};

ChartScatter.prototype.max_y = function (aValue) {
    // Set max_y attribute
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.max_y(value)');
    this.attr.max_y = aValue;
    return this;
};

ChartScatter.prototype.title = function (aValue) {
    // Set chart title
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.title(value)');
    this.attr.title = aValue;
    return this;
};

ChartScatter.prototype.label_x = function (aValue) {
    // Set x-axis label
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.label_x(value)');
    this.attr.label_x = aValue;
    return this;
};

ChartScatter.prototype.label_y = function (aValue) {
    // Set y-axis label
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.label_y(value)');
    this.attr.label_y = aValue;
    return this;
};

ChartScatter.prototype.log_x = function (aValue) {
    // Make x-axis logarithmic
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.log_x(value)');
    this.attr.log_x = aValue;
    return this;
};

ChartScatter.prototype.log_y = function (aValue) {
    // Make y-axis logarithmic
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.log_y(value)');
    this.attr.log_y = aValue;
    return this;
};

ChartScatter.prototype.log = function (aValue) {
    // Make both axis logarithmic
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.log(value)');
    this.attr.log_x = aValue;
    this.attr.log_y = aValue;
    return this;
};

ChartScatter.prototype.size = function (aSize) {
    // Set dot size
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.size(value)');
    this.attr.size = aSize;
    return this;
};

ChartScatter.prototype.levels = function (aLevels) {
    // Set number of levels
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.levels(value)');
    this.attr.levels = aLevels;
    return this;
};

ChartScatter.prototype.validate = function () {
    // Validate parameters
    assert_arguments_length(arguments, 0, 0, 'chart_scatter.validate()');
    device_attr_check(this, this.attr, {
        "data_x": {type: "array_of_numbers", required: true, eng: true},
        "data_y": {type: "array_of_numbers", required: true, eng: true},
        "values": {type: "array_of_numbers", required: true, eng: true},
        "width": {type: "number", required: !true, eng: true, min: 10, max: 22000},
        "height": {type: "number", required: !true, eng: true, min: 10, max: 22000},
        "min_x": {type: "number", required: !true, eng: true},
        "max_x": {type: "number", required: !true, eng: true},
        "min_y": {type: "number", required: !true, eng: true},
        "max_y": {type: "number", required: !true, eng: true},
        "title": {type: "string", required: !true, min: 0, max: 1000},
        "label_x": {type: "string", required: !true, min: 0, max: 1000},
        "label_y": {type: "string", required: !true, min: 0, max: 1000},
        "series": {type: "array", required: false},
        "log_x": {type: "boolean"},
        "log_y": {type: "boolean"},
        "size": {type: "number", required: true, eng: true, min: 1, max: 100},
        "levels": {type: "number", integer: true, required: true, min: 1, max: 100},
    });
    device_attr_assign(this, this.attr, ['series']);
    // reduce complex arrays to real arrays (ac)
    if (Array.isArray(this.attr.data_x[0])) {
        this.attr.data_x = array_modulus(this.attr.data_x);
    }
    if (Array.isArray(this.attr.data_y[0])) {
        this.attr.data_y = array_modulus(this.attr.data_y);
    }
    if (Array.isArray(this.attr.values[0])) {
        this.attr.values = array_modulus(this.attr.values);
    }
};

ChartScatter.prototype.render_sixel = function () {
    // Render chart as a sixel canvas and return it (for additional modifications or stacking as frames of gif)
    assert_arguments_length(arguments, 0, 0, 'chart_scatter.render_sixel()');
    this.validate();

    // calculate data bounding box
    var bbox = bounding_box(this.attr.data_x, this.attr.data_y, {});

    // override calculated bounding box
    bbox.min_x = this.attr.min_x !== undefined ? this.attr.min_x : bbox.min_x;
    bbox.max_x = this.attr.max_x !== undefined ? this.attr.max_x : bbox.max_x;
    bbox.min_y = this.attr.min_y !== undefined ? this.attr.min_y : bbox.min_y;
    bbox.max_y = this.attr.max_y !== undefined ? this.attr.max_y : bbox.max_y;
    bbox.span_x = bbox.max_x - bbox.min_x;
    bbox.span_y = bbox.max_y - bbox.min_y;
    //echo_json(bbox);

    // sixel canvas
    var w = this.attr.width,
        h = this.attr.height;
    var s = sixel_canvas(w, h);

    // basic colors
    s.white = s.color(100, 100, 100);
    s.gray = s.color(66, 66, 66);
    s.black = s.color(0, 0, 0);
    s.clear(s.white);

    // IR camera like gradient (that stops on yellow, not white)
    var colors = [];
    var labels = [];
    var levels = this.attr.levels || 10;
    var min = array_min(this.attr.values);
    var max = array_max(this.attr.values);
    var q = array_quantize(this.attr.values, levels);
    var x, y;
    for (var v = 0; v < levels; v++) {
        x = 0.8 * 433 * v / (levels - 1);
        var r = Math.floor((100 / 255) * Math.max(0, 4.18485e-6*x*x*x - 0.00532377*x*x + 2.19321*x - 39.1125));
        var g = Math.floor((100 / 255) * Math.max(0, 1.28826e-10*x*x*x*x*x-1.64251e-7*x*x*x*x+6.73208e-5*x*x*x-0.00808127*x*x+0.280643*x-1.61706));
        var b = Math.floor((100 / 255) * Math.max(0, 9.48804e-12*x*x*x*x*x-1.05015e-8*x*x*x*x+4.19544e-5*x*x*x-0.0232532*x*x+3.24907*x+30.466));
        colors.push(s.color(r, g, b));
        labels.push(((max - min) * v / (levels - 1) + min).toEng());
    }
    //echo_json(colors);

    // y-axis
    // measure y-axis label width
    var f = font_neo_sans;
    var by = f.height + 4;

    // left border
    var border_left = Math.max(
        s.label_size(bbox.max_y.toEng()).width,
        s.label_size('0').width,
        s.label_size('-100.00m').width,
        s.label_size(bbox.min_y.toEng()).width
    ) + 3;

    // right border
    var border_right = s.label_width(this.attr.label_y || '');
    labels.forEach((lab) => {
        border_right = Math.max(border_right, s.label_width(lab));
    });
    border_right += 2 * 8;

    // legend
    for (var j = 0; j < colors.length; j++) {
        s.fill_rect(4 + w - border_right, by + j * (f.height + 1), f.height - 1, f.height - 1, colors[j]);
        s.label(labels[j], 4 + w - border_right + f.height + 1, by + j * (f.height + 1) + f.baseline - 1, s.black);
    }

    // canvas transformation functions
    var tx = ChartXy.transform_function(w, border_left, border_right, bbox.min_x, bbox.max_x, this.attr.log_x);
    var ty = ChartXy.transform_function(h, by, by, bbox.min_y, bbox.max_y, this.attr.log_y, true);
    var gridx = ChartXy.grid_function(bbox.min_x, bbox.max_x, tx, this.attr.log_x);
    var gridy = ChartXy.grid_function(bbox.min_y, bbox.max_y, ty, this.attr.log_y);

    // black box around
    s.line(border_left, by, border_left, h - by, s.black);
    s.line(w - border_right, by, w - border_right, h - by, s.black);

    // horizontal lines
    s.line(border_left, by, w - border_right, by, s.black);
    s.line(border_left, h - by, w - border_right, h - by, s.black);

    var y_digits;
    if (bbox.span_y < 1) {
        y_digits = Math.abs(Math.floor(Math.log10(bbox.span_y))) + 1;
        if (y_digits > 3) {
            y_digits = 3;
        }
    }

    // y axis grid
    gridy.forEach((tick) => {
        var l = tick.real.toEng(y_digits); //
        s.label(l, border_left - s.label_size(l).width - 1, tick.canvas + f.height / 2 - 1, s.black);
        if (!tick.extreme) {
            s.line(border_left + 1, tick.canvas, w - border_right - 1, tick.canvas, s.gray);
        }
    });
    // x axis grid
    gridx.forEach((tick) => {
        var l = tick.real.toEng();
        s.label(l, Math.round(tick.canvas - s.label_size(l).width / 2), h - 2, s.black);
        if (!tick.extreme) {
            s.line(tick.canvas, by + 1, tick.canvas, h - by - 1, s.gray);
        }
    });

    // draw main data
    s.viewport(border_left, by, w - border_left - border_right + 1, h - 2 * by);
    var i, size = this.attr.size, size2 = Math.round(size / 2);
    for (i = 0; i < this.attr.data_x.length; i++) {
        x = tx(this.attr.data_x[i]);
        y = ty(this.attr.data_y[i]);
        s.fill_rect(x - size2, y - size2, size, size, colors[q[i]]);
    }
    // reset viewport to full canvas
    s.viewport();

    // title
    if (this.attr.title || this.attr.label_x || this.attr.label_y) {
        var tit = this.attr.title || '';
        if (this.attr.label_x && this.attr.label_y) {
            tit += ' (x=' + this.attr.label_x + ', y=' + this.attr.label_y + ')';
        }
        s.label(tit, Math.round(w / 2 - s.label_size(tit).width / 2), by - 2, s.black);
    }

    this.canvas = s;
    return this;
};

ChartScatter.prototype.render_ascii = function () {
    // Render ascii chart
    assert_arguments_length(arguments, 0, 0, 'chart_scatter.render_ascii()');
    this.validate();

    // calculate data bounding box
    var bbox = bounding_box(this.attr.data_x, this.attr.data_y, {});

    // override calculated bounding box
    bbox.min_x = this.attr.min_x !== undefined ? this.attr.min_x : bbox.min_x;
    bbox.max_x = this.attr.max_x !== undefined ? this.attr.max_x : bbox.max_x;
    bbox.min_y = this.attr.min_y !== undefined ? this.attr.min_y : bbox.min_y;
    bbox.max_y = this.attr.max_y !== undefined ? this.attr.max_y : bbox.max_y;
    bbox.span_x = bbox.max_x - bbox.min_x;
    bbox.span_y = bbox.max_y - bbox.min_y;
    //echo_json(bbox);

    // size
    var w = Math.round(ChartScatter.ascii_scale_width * this.attr.width);
    var h = Math.round(ChartScatter.ascii_scale_height * this.attr.height);
    // keep height odd so that if it is symmetrical there is always zero
    /*
    if (h % 2 === 1) {
        h++;
    }
    */
    // in tests this forces chart size to be always the same
    if (chart_scatter.force_width) {
        w = chart_scatter.force_width;
    }
    if (chart_scatter.force_height) {
        h = chart_scatter.force_height;
    }

    // 2d ascii canvas (+8 wide for y labels, +1 tall for x labels)
    var canvas = ascii_canvas(w + 8, h + 2);
    canvas.clear('-');
    canvas.line(0, 0, w + 8, 0, ' ');

    // y labels
    var ly, s;
    var zero = false;
    for (y = 1; y < h; y++) {
        ly = bbox.min_y + bbox.span_y * (h - y - 1) / (h - 2);
        s = ('        ' + ly.toEng(1, true)).substr(-7);
        canvas.label(' ' + s + '        ', w, y);
        if (ly <= 0 && !zero) {
            if (y !== 1 || (y === 1 && ly === 0)) {
                canvas.line(0, y, w - 1, y, "=");
            }
            zero = true;
        }
    }

    // ChartXy.transform_function(aSize, aBorder1, aBorder2, aMinValue, aMaxValue, aLog, aInverted)
    var tx = ChartXy.transform_function(w - 1, 0, 0, bbox.min_x, bbox.max_x, this.attr.log_x);
    var ty = ChartXy.transform_function(h - 1, 1, 0, bbox.min_y, bbox.max_y, this.attr.log_y, false);

    // draw chart
    var x;
    var y;
    var i;
    var q = lerp([[array_min(this.attr.values), 0], [array_max(this.attr.values), 9]]);
    for (i = 0; i < this.attr.data_x.length; i++) {
        x = tx(this.attr.data_x[i]);
        y = ty(this.attr.data_y[i]);
        var v = this.attr.values[i];
        var c = Math.floor(q.get(v));
        canvas.pixel(x, h - y, c);
    }

    // reset viewport to full canvas
    //canvas.viewport(0, 0, w, h);

    // x labels
    canvas.fill_rect(0, h, w + 8, h + 1, ' ');
    canvas.label(this.attr.title || 'Scatter chart', 0, 0);
    canvas.label(bbox.min_x.toEng(), 0, h);
    s = bbox.max_x.toEng();
    canvas.label(s, w - s.length, h);
    //canvas.push(min_x + ' '.repeat(w - min_x.toString().length) + max_x);
    this.canvas = canvas; //{type: "ascii_canvas", data: canvas};
    return this;
};

ChartScatter.prototype.render = function () {
    // Render chart
    assert_arguments_length(arguments, 0, 0, 'chart_scatter.render()');
    if (!ChartScatter.force_ascii && terminal_colors()) {
        this.render_sixel();
    } else {
        this.render_ascii();
    }
    return this;
};

ChartScatter.prototype.show = function () {
    // Show chart on screen
    assert_arguments_length(arguments, 0, 0, 'chart_scatter.show()');
    if (!this.canvas) {
        this.render();
    }
    this.canvas.show();
    return this;
};

ChartScatter.prototype.gif = function (aFileName) {
    // Save chart as gif
    assert_arguments_length(arguments, 1, 1, 'chart_scatter.gif(filename)');
    assert_string(aFileName, 'filename', 'chart_scatter.gif(filename)');
    gif(aFileName, [this.canvas], 0);
};

globalThis.exports = {ChartScatter, chart_scatter};

globalThis.chart_scatter = chart_scatter;
Internal.ChartScatter = ChartScatter;
