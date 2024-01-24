// XY Chart rendered in terminal using either sixels (if supported) or as ascii art
// linter: ngspicejs-lint --internal
"use strict";

function ChartXy(aWidth, aHeight, aMinX, aMaxX, aMinY, aMaxY, aTitle, aLabelX, aLabelY, aLogX, aLogY, aSeries) {
    // Constructor
    assert_arguments_length(arguments, 0, 14, 'chart_xy(width,height,minX,maxX,minY,maxY,title,labelX,labelY,logX,logY,series)');
    this.type = 'chart_xy';
    this.attr = {width: 640, height: 240, series: []};
    // all attr as object in first argument
    if (arguments.length === 1 && typeof aWidth === 'object') {
        for (const [k, v] of Object.entries(aWidth)) {
            this.attr[k] = v;
        }
        this.validate();
        return;
    }
    // individual arguments
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
    if (aSeries !== undefined) {
        assert_array(aSeries, 'series', 'chart_xy(width,height,minX,maxX,minY,maxY,title,labelX,labelY,series)');
        aSeries.forEach(ser => this.add_series(ser.data_x, ser.data_y, ser.label));
    }
}

ChartXy.fixed_width = 0;
ChartXy.fixed_height = 0;
ChartXy.ascii_scale_width = 0.16;
ChartXy.ascii_scale_height = 0.09;
ChartXy.force_ascii = false;

function chart_xy(aWidth, aHeight, aMinX, aMaxX, aMinY, aMaxY, aTitle, aLabelX, aLabelY, aLogX, aLogY, aSeries) {
    // Create XY chart
    assert_arguments_length(arguments, 0, 14, 'chart_xy(width,height,minX,maxX,minY,maxY,title,labelX,labelY,logX,logY,series)');
    if (arguments.length === 1 && typeof aWidth === 'object') {
        return new ChartXy(aWidth);
    }
    if (arguments.length === 2 && Array.isArray(aWidth) && Array.isArray(aHeight) && aWidth.length === aHeight.length) {
        return new ChartXy().add_series(aWidth, aHeight);
    }
    return new ChartXy(aWidth, aHeight, aMinX, aMaxX, aMinY, aMaxY, aTitle, aLabelX, aLabelY, aLogX, aLogY, aSeries);
}

ChartXy.prototype.data_x = function (aValue) {
    // Set X data
    assert_arguments_length(arguments, 1, 1, 'chart_xy.data_x(array)');
    if (this.attr.series.length === 0) {
        this.attr.series.push({});
    }
    this.attr.series[0].data_x = aValue;
    return this;
};

ChartXy.prototype.data_y = function (aValue) {
    // Set Y data
    assert_arguments_length(arguments, 1, 1, 'chart_xy.data_y(array)');
    if (this.attr.series.length === 0) {
        this.attr.series.push({});
    }
    this.attr.series[0].data_y = aValue;
    return this;
};

ChartXy.prototype.width = function (aValue) {
    // Set chart width
    assert_arguments_length(arguments, 1, 1, 'chart_xy.width(value)');
    assert_number(aValue, 'value', 'chart_xy.width(value)');
    this.attr.width = aValue;
    return this;
};

ChartXy.prototype.height = function (aValue) {
    // Set chart height
    assert_arguments_length(arguments, 1, 1, 'chart_xy.height(value)');
    this.attr.height = aValue;
    return this;
};

ChartXy.prototype.min_x = function (aValue) {
    // Set x-axis minimal value
    assert_arguments_length(arguments, 1, 1, 'chart_xy.min_x(value)');
    this.attr.min_x = aValue;
    return this;
};

ChartXy.prototype.max_x = function (aValue) {
    // Set x-axis maximal value
    assert_arguments_length(arguments, 1, 1, 'chart_xy.max_x(value)');
    this.attr.max_x = aValue;
    return this;
};

ChartXy.prototype.min_y = function (aValue) {
    // Set y-axis minimal value
    assert_arguments_length(arguments, 1, 1, 'chart_xy.min_y(value)');
    this.attr.min_y = aValue;
    return this;
};

ChartXy.prototype.max_y = function (aValue) {
    // Set y-axis maximal value
    assert_arguments_length(arguments, 1, 1, 'chart_xy.max_y(value)');
    this.attr.max_y = aValue;
    return this;
};

ChartXy.prototype.title = function (aValue) {
    // Set chart title
    assert_arguments_length(arguments, 1, 1, 'chart_xy.title(value)');
    this.attr.title = aValue;
    return this;
};

ChartXy.prototype.label_x = function (aValue) {
    // Set x-axis label
    assert_arguments_length(arguments, 1, 1, 'chart_xy.label_x(value)');
    this.attr.label_x = aValue;
    return this;
};

ChartXy.prototype.label_y = function (aValue) {
    // Set y-axis label
    assert_arguments_length(arguments, 1, 1, 'chart_xy.label_y(value)');
    this.attr.label_y = aValue;
    return this;
};

ChartXy.prototype.log_x = function (aValue) {
    // Make x-axis logarithmic
    assert_arguments_length(arguments, 1, 1, 'chart_xy.log_x(value)');
    this.attr.log_x = aValue;
    return this;
};

ChartXy.prototype.log_y = function (aValue) {
    // Make y-axis logarithmic
    assert_arguments_length(arguments, 1, 1, 'chart_xy.log_y(value)');
    this.attr.log_y = aValue;
    return this;
};

ChartXy.prototype.add_series = function (aDataX, aDataY, aLabel) {
    // Add one series (x data, y data and series label)
    if (aDataY.includes(Infinity) || aDataY.includes(-Infinity)) {
        throw new Exception('ChartXy cannot display infinity (y value)');
    }
    var x, y;
    if (arguments.length === 1 && typeof aDataX === 'object' && Array.isArray(aDataX.data_x) && Array.isArray(aDataX.data_y)) {
        x = aDataX.data_x;
        y = aDataX.data_y;
    } else {
        assert_arguments_length(arguments, 2, 3, 'chart_xy.series(data_x,data_y,label)');
        x = aDataX;
        y = aDataY;
    }
    assert_array_of_numbers(x, 'data_x', 'chart_xy.series(data_x,data_y,label)', true);
    assert_array_of_numbers(y, 'data_y', 'chart_xy.series(data_x,data_y,label)', true);
    if (aLabel) {
        assert_string(aLabel, 'label', 'chart_xy.add_series(data_x,data_y,label)');
    }
    this.attr.series = this.attr.series || [];
    this.attr.series.push({
        data_x: x,
        data_y: y,
        label: aLabel || ''
    });
    return this;
};

ChartXy.prototype.validate = function () {
    // Validate chart_xy parameters
    assert_arguments_length(arguments, 0, 0, 'chart_xy.validate()');
    device_attr_check(this, this.attr, {
        "width": {type: "number", required: !true, eng: true, min: 10, max: 22000},
        "height": {type: "number", required: !true, eng: true, min: 10, max: 22000},
        "min_x": {type: "number", required: !true, eng: true},
        "max_x": {type: "number", required: !true, eng: true},
        "min_y": {type: "number", required: !true, eng: true},
        "max_y": {type: "number", required: !true, eng: true},
        "title": {type: "string", required: !true, min: 0, max: 1000},
        "label_x": {type: "string", required: !true, min: 0, max: 1000},
        "label_y": {type: "string", required: !true, min: 0, max: 1000},
        "log_x": {type: "boolean", required: false},
        "log_y": {type: "boolean", required: false},
        "series": {type: "array", required: false},
    });
    device_attr_assign(this, this.attr, ['series']);
};

ChartXy.transform_function = function (aSize, aBorder1, aBorder2, aMinValue, aMaxValue, aLog, aInverted) {
    // Return function that transforms from real value to canvas coordinates
    assert_arguments_length(arguments, 6, 7, 'chart_xy.transform_function(size,border1,border2,min_value,max_value,log,inverted)');
    if (aLog) {
        if (aMinValue <= 0) {
            throw new Exception('chart_xy() with log axis cannot have negative value (' + aMinValue + ')');
        }
        if (aMaxValue <= 0) {
            throw new Exception('chart_xy() with log axis cannot have negative value (' + aMaxValue + ')');
        }
        aMinValue = Math.log(aMinValue);
        aMaxValue = Math.log(aMaxValue);
    }
    if (aMinValue === aMaxValue) {
        throw new Exception('chart_xy() min and max value cannot be the same: ' + aMinValue);
    }
    var u = 0, v = 1;
    if (aInverted) {
        u = 1;
        v = -1;
    }
    if (aLog) {
        return function (aValue) {
            if (aValue <= 0) {
                throw new Exception('chart_xy with log axis cannot have negative value (' + aValue + ')');
            }
            return aBorder1 + Math.round((aSize - aBorder1 - aBorder2) * (u + v * (Math.log(aValue) - aMinValue) / (aMaxValue - aMinValue)));
        };
    }
    return function (aValue) {
        return aBorder1 + Math.round((aSize - aBorder1 - aBorder2) * (u + v * (aValue - aMinValue) / (aMaxValue - aMinValue)));
    };
};

function enough_digits_for_values(aValues) {
    // for label values use the minimal amount of digits that produces distinct labels
    // e.g. having label [1.2 1.3 1.3 1.4] is wrong because 2 labels have same string
    // so it must be increased to 2 digits: [1.25 1.30 1.35 1.4]
    if (aValues.length <= 1) {
        return 0;
    }
    var enough = 14, i, uni, s;
    for (var digits = 0; digits < 10; digits++) {
        uni = {};
        for (i = 0; i < aValues.length; i++) {
            s = aValues[i].toEng(digits); // toPrecision(digits);
            uni[s] = true;
            //echo(i, digits, s);
        }
        //echo('uni', Object.keys(uni));
        if (Object.keys(uni).length === aValues.length) {
            //echo(digits, 'is sufficient', Object.keys(uni));
            enough = digits;
            break;
        }
    }
    //echo('zz', aValues, enough, aValues.map(a => a.toEng(enough)));
    return enough;
}

ChartXy.grid_function = function (aMin, aMax, aTransformCallback, aLog) {
    // Calculate optimal grid tick marks positions
    assert_arguments_length(arguments, 4, 4, 'chart_xy.grid_function(min,max,transform_callback,log)');
    //echo('grid_function min', aMin, 'max', aMax, 'log', aLog);
    var a, b, p, r, i, ret = [];
    // log
    if (aLog) {
        a = Math.floor(Math.log10(aMin));
        b = Math.ceil(Math.log10(aMax));
        for (i = a; i <= b; i += 1) {
            r = Math.pow(10, i);
            if (r >= aMin && r <= aMax) {
                p = aTransformCallback(r);
                ret.push({real: r, str: r.toEng(), canvas: p, extreme: i === a || i === b});
            }
        }
        return ret;
    }
    // lin
    var span, g, g0;
    span = aMax - aMin;
    function round(aValue, aMultiplier, aCeil) {
        // Round to N digit up/down
        var s = aValue.toExponential().split('e');
        var n = aCeil ? Math.ceil(aMultiplier * s[0]) : Math.floor(aMultiplier * s[0]);
        return parseFloat(n / aMultiplier + 'e' + s[1]);
    }
    g = round(span / 10, 1 / 10, true);
    if (span / g < 4) {
        g /= 2;
    }
    //echo('sg', span / g);
    g0 = aMin - g - aMin % g;
    //echo('grid span', span, 'g', g, 'g0', g0);
    for (i = g0; i <= aMax + g / 2; i += g) {
        if (i >= aMin && i <= aMax) {
            p = aTransformCallback(i);
            //echo('i', i, 'ig', ig);
            ret.push({real: Math.abs(i) < 1e-12 ? 0 : i, canvas: p, extreme: i === aMin || i === aMax});
        }
    }
    // for label values use the minimal amount of digits that produces distinct labels
    // e.g. having label [1.2 1.3 1.3 1.4] is wrong because 2 labels have same string
    // so it must be increased to 2 digits: [1.25 1.30 1.35 1.4]
    var enough = enough_digits_for_values(ret.map(a => a.real)) + 1;
    if (enough > 6) {
        enough = 6;
    }
    for (i = 0; i < ret.length; i++) {
        ret[i].str = ret[i].real.toEng(enough);
        ret[i].digits = enough;
    }
    return ret;
};

ChartXy.prototype.validate_bbox = function (aBbox, aOriginalBbox) {
    // Check if bbox size is non-zero
    assert_arguments_length(arguments, 2, 2, 'chart_xy.validate_bbox(bbox,original_bbox)');
    if (aBbox.min_x === aBbox.max_x) {
        if (this.attr.min_x !== undefined) {
            hint('you manually set min_x is ' + this.attr.min_x);
        }
        if (this.attr.max_x !== undefined) {
            hint('you manually set max_x is ' + this.attr.max_x);
        }
        hint('calculated bounding box is ' + JSON.stringify(aBbox));
        hint('   updated bounding box is ' + aOriginalBbox);
        throw new Exception('chart_xy() min_x and max_x cannot have the same value: ' + aBbox.min_y + ' (this would make the area infinitely small)');
    }
    if (aBbox.min_y === aBbox.max_y) {
        if (this.attr.min_y !== undefined) {
            hint('you manually set min_y is ' + this.attr.min_y);
        }
        if (this.attr.max_y !== undefined) {
            hint('you manually set max_y is ' + this.attr.max_y);
        }
        hint('calculated bounding box is ' + JSON.stringify(aBbox));
        hint('   updated bounding box is ' + aOriginalBbox);
        throw new Exception('chart_xy() min_y and max_y cannot have the same value: ' + aBbox.min_y + ' (this would make the area infinitely small)');
    }
};

ChartXy.prototype.render_sixel = function () {
    // Render chart as a sixel canvas and return it (for additional modifications or stacking as frames of gif)
    assert_arguments_length(arguments, 0, 0, 'chart_xy.render_sixel()');
    this.validate();

    // calculate data bounding box
    var bbox = {};
    this.attr.series.forEach((s) => {
        bounding_box(s.data_x, s.data_y, bbox);
    });

    // override calculated bounding box
    var orig_bbox = JSON.stringify(bbox);
    bbox.min_x = this.attr.min_x !== undefined ? this.attr.min_x : bbox.min_x;
    bbox.max_x = this.attr.max_x !== undefined ? this.attr.max_x : bbox.max_x;
    bbox.min_y = this.attr.min_y !== undefined ? this.attr.min_y : bbox.min_y;
    bbox.max_y = this.attr.max_y !== undefined ? this.attr.max_y : bbox.max_y;
    bbox.span_x = bbox.max_x - bbox.min_x;
    bbox.span_y = bbox.max_y - bbox.min_y;
    //echo_json(bbox);
    this.validate_bbox(bbox, orig_bbox);

    // sixel canvas
    var w = this.attr.width,
        h = this.attr.height;
    var s = sixel_canvas(w, h);
    s.white = s.color(100, 100, 100);
    s.gray = s.color(66, 66, 66);
    s.black = s.color(0, 0, 0);
    //s.red = s.color(100, 0, 0);
    var series_color = [], dc, dc_r, dc_g, dc_b;
    var pal = Object.values(globalThis.distinct_colors);
    for (i = 0; i < this.attr.series.length + 1; i++) {
        dc = pal[i];
        dc_r = Math.round(100 * dc[0] / 255);
        dc_g = Math.round(100 * dc[1] / 255);
        dc_b = Math.round(100 * dc[2] / 255);
        //echo('color', i, dc, dc_r, dc_g, dc_b);
        series_color.push(s.color(dc_r, dc_g, dc_b));
    }
    s.clear(s.white);

    // y-axis
    // measure y-axis label width
    var f = globalThis.font_neo_sans;
    var by = f.height + 8;

    // left border
    var border_left = Math.max(
        s.label_size(bbox.max_y.toEng()).width,
        s.label_size('0').width,
        s.label_size('-100.00m').width,
        s.label_size(bbox.min_y.toEng()).width
    ) + 3;

    // right border
    var border_right = s.label_width(this.attr.label_y || '');
    if (this.attr.label_x) {
        border_right = Math.max(border_right, s.label_width(this.attr.label_x));
    }
    this.attr.series.forEach((ser) => {
        border_right = Math.max(border_right, s.label_width(ser.label));
    });
    border_right += 2 * 8;

    // canvas transformation functions
    var tx = ChartXy.transform_function(w, border_left, border_right, bbox.min_x, bbox.max_x, this.attr.log_x, false);
    var ty = ChartXy.transform_function(h, by, by, bbox.min_y, bbox.max_y, this.attr.log_y, true);

    var gridx = ChartXy.grid_function(bbox.min_x, bbox.max_x, tx, this.attr.log_x);
    var gridy = ChartXy.grid_function(bbox.min_y, bbox.max_y, ty, this.attr.log_y);

    // black box around
    s.line(border_left, by, border_left, h - by, s.black);
    s.line(w - border_right, by, w - border_right, h - by, s.black);

    // horizontal lines
    s.line(border_left, by, w - border_right, by, s.black);
    s.line(border_left, h - by, w - border_right, h - by, s.black);

    // y axis grid
    gridy.forEach((tick) => {
        var l = tick.str || '?'; //real.toEng(); // y_digits
        s.label(l, border_left - s.label_size(l).width - 1, tick.canvas + f.height / 2 - 1, s.black);
        if (!tick.extreme) {
            s.line(border_left + 1, tick.canvas, w - border_right - 1, tick.canvas, s.gray);
        }
    });
    // x axis grid
    gridx.forEach((tick) => {
        var l = tick.str || '?'; //real.toEng();
        s.label(l, Math.round(tick.canvas - s.label_size(l).width / 2), h - 2, s.black);
        if (!tick.extreme) {
            s.line(tick.canvas, by + 1, tick.canvas, h - by - 1, s.gray);
        }
    });

    // prevent series to draw outside the viewport
    s.viewport(border_left, by, w - border_left - border_right + 1, h - 2 * by + 1);

    // draw series
    var i;
    this.attr.series.forEach((ser, index) => {
        //echo(index, ser.label, ser.data_x.length);
        var i, x, y;
        for (i = 0; i < ser.data_x.length; i++) {
            x = tx(ser.data_x[i]);
            y = ty(ser.data_y[i]);
            //echo('i', i, 'x', x, 'y', y, ser.data_y[i], 'index', index);
            if (i === 0) {
                s.move_to(x, y);
            } else {
                s.line_to(x, y, series_color[index]);
            }
        }
    });

    // full viewport
    s.viewport();

    // legend
    var ly = by + Math.round((h - 2 * by) / 2);
    ly += f.baseline - this.attr.series.length * (f.height + 4) / 2 - f.height / 2;
    this.attr.series.forEach((ser, index) => {
        ly += f.height + 4;
        s.label(ser.label, w - border_right + 8, ly, series_color[index]);
    });

    // label_y
    if (this.attr.label_y) {
        s.label(this.attr.label_y, Math.max(4, border_left - s.label_width(this.attr.label_y) - 2), by - 6, s.black);
    }
    // label_x
    if (this.attr.label_x) {
        s.label(this.attr.label_x, w - border_right + 8, h - by - f.height / 2 + f.baseline, s.black);
    }

    // title
    if (this.attr.title) {
        s.label(this.attr.title, Math.round(w / 2 - s.label_size(this.attr.title).width / 2), by - 6, s.black);
    }

    this.canvas = s;
    return this;
};

ChartXy.prototype.render_ascii = function () {
    // Render ascii art XY chart
    assert_arguments_length(arguments, 0, 0, 'chart_xy.render_ascii()');
    this.validate();

    // calculate data bounding box
    var bbox = {};
    this.attr.series.forEach((s) => {
        bounding_box(s.data_x, s.data_y, bbox);
    });
    // override calculated bounding box
    var orig_bbox = JSON.stringify(bbox);
    bbox.min_x = this.attr.min_x !== undefined ? this.attr.min_x : bbox.min_x;
    bbox.max_x = this.attr.max_x !== undefined ? this.attr.max_x : bbox.max_x;
    bbox.min_y = this.attr.min_y !== undefined ? this.attr.min_y : bbox.min_y;
    bbox.max_y = this.attr.max_y !== undefined ? this.attr.max_y : bbox.max_y;
    bbox.span_x = bbox.max_x - bbox.min_x;
    bbox.span_y = bbox.max_y - bbox.min_y;
    //echo_json(bbox);
    this.validate_bbox(bbox, orig_bbox);

    // size
    var w = Math.round(ChartXy.ascii_scale_width * this.attr.width);
    var h = Math.round(ChartXy.ascii_scale_height * this.attr.height);
    // keep height odd so that if it is symmetrical there is always zero
    /*
    if (h % 2 === 1) {
        h++;
    }
    */
    // in tests this forces chart size to be always the same
    if (chart_xy.force_width) {
        w = chart_xy.force_width;
    }
    if (chart_xy.force_height) {
        h = chart_xy.force_height;
    }

    // 2d ascii canvas (+8 wide for y labels, +1 tall for x labels)
    var canvas = ascii_canvas(w + 8, h + 2);
    canvas.clear('-');
    canvas.line(0, 0, w + 8, 0, ' ');

    var current_color = '1';
    function pixel(x, y) {
        canvas.pixel(x, y, current_color);
    }

    // y labels
    var ly, s;
    var zero = false;
    var y_values = [];
    for (y = 1; y < h; y++) {
        ly = bbox.min_y + bbox.span_y * (h - y - 1) / (h - 2);
        y_values.push(ly);
    }
    var enough = enough_digits_for_values(y_values) + 1;
    if (enough > 5) {
        enough = 5;
    }
    //echo('e', enough, y_values);
    for (i = 0; i < y_values.length; i++) {
        y = i + 1;
        var q = y_values[i].toEng(enough, true);
        s = ' ' + q;
        canvas.label('                     '.substr(0, 8), w + 8 - 8, y);
        canvas.label(s, w + 8 - s.length, y);
        //s = ('                       ' + q).substr(-(Math.max(7, q.length)));
        //canvas.label(' ' + s + '        ', w, y); //data[y] = canvas[y].join('') + ' ' + ly.toFixed(3);
        if (y_values[i] <= 0 && !zero) {
            if (y !== 1 || (y === 1 && y_values[i] === 0)) {
                canvas.line(0, y, w - 1, y, "=");
            }
            zero = true;
        }
    }
    // draw chart
    var x;
    var y;
    var i;
    var ix;
    var iy;
    var ox;
    var oy;
    var tit = (this.attr.title || '') + '(';
    for (var a = 0; a < this.attr.series.length; a++) {
        current_color = a;
        if (a === 0 && this.attr.series.length === 1) {
            current_color = '*';
        }
        var data_x = this.attr.series[a].data_x;
        var data_y = this.attr.series[a].data_y;
        var label = this.attr.series[a].label;
        if (label) {
            tit += a + '=' + label + ' ';
        }
        for (i = 0; i < data_x.length; i++) {
            x = (w - 1) * (data_x[i] - bbox.min_x) / bbox.span_x;
            y = (h - 2) - (h - 2) * (data_y[i] - bbox.min_y) / bbox.span_y + 1;
            ix = Math.round(x);
            iy = Math.round(y);
            //echo_json({i, x, ix, y, iy}, 2);
            if (i > 0) {
                bresenham(ox, oy, ix, iy, pixel);
            }
            //pixel(ix, iy, '0');
            //canvas[h - iy][ix] = '*';
            ox = ix;
            oy = iy;
        }
    }
    tit = tit.trim() +  ')';
    // x labels
    enough = enough_digits_for_values([bbox.min_x, bbox.max_x]) + 1;
    canvas.fill_rect(0, h, w + 8, h + 1, ' ');
    if (tit !== '()') {
        canvas.label(tit, 0, 0);
    }
    canvas.label(bbox.min_x.toEng(enough), 0, h);
    s = bbox.max_x.toEng(enough);
    canvas.label(s, w - s.length, h);
    //canvas.push(min_x + ' '.repeat(w - min_x.toString().length) + max_x);
    this.canvas = canvas; //{type: "ascii_canvas", data: canvas};
    return this;
};

ChartXy.prototype.render = function () {
    // Render chart
    assert_arguments_length(arguments, 0, 0, 'chart_xy.render()');
    if (!ChartXy.force_ascii && terminal_colors()) {
        this.render_sixel();
    } else {
        this.render_ascii();
    }
    return this;
};

ChartXy.prototype.show = function () {
    // Show chart on screen
    assert_arguments_length(arguments, 0, 0, 'chart_xy.show()');
    if (!this.canvas || this.canvas.shown) {
        this.render();
    }
    this.canvas.show();
    this.canvas.shown = true;
    return this;
};

ChartXy.prototype.gif = function (aFileName) {
    // Save chart as gif file
    assert_arguments_length(arguments, 1, 1, 'chart_xy.gif(filename)');
    assert_string(aFileName, 'filename', 'chart_xy.gif(filename)');
    if (!this.canvas || this.canvas.shown) {
        this.render();
    }
    gif(aFileName, [this.canvas], 1);
};

globalThis.chart_xy = chart_xy;
globalThis.ChartXy = ChartXy;

globalThis.exports = {ChartXy, chart_xy};
