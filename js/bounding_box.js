// Find optimal bounding box for chart values
// linter: ngspicejs-lint --internal
"use strict";

function bounding_box(aDataX, aDataY, aBbox) {
    // Find optimal bounding box for chart values
    assert_arguments_length(arguments, 2, 3, 'bounding_box(data_x, data_y, bbox)');
    if (aDataX.length > 200000) {
        warn('bounding_box with ' + aDataX.length + ' data points may take a while to render!');
    }
    aBbox.min_x = aBbox.min_x !== undefined ? aBbox.min_x : Number.MAX_VALUE;
    aBbox.min_y = aBbox.min_y !== undefined ? aBbox.min_y : Number.MAX_VALUE;
    aBbox.max_x = aBbox.max_x !== undefined ? aBbox.max_x : -Number.MAX_VALUE;
    aBbox.max_y = aBbox.max_y !== undefined ? aBbox.max_y : -Number.MAX_VALUE;
    // find bounding box
    var min_x = array_min([array_min(aDataX), aBbox.min_x]);
    var max_x = array_max([array_max(aDataX), aBbox.max_x]);
    var min_y = array_min([array_min(aDataY), aBbox.min_y]);
    var max_y = array_max([array_max(aDataY), aBbox.max_y]);
    // round to nearest 2nd digit up/down

    function round(aValue, aMultiplier, aCeil) {
        // Round number optimally to N digits up/down
        var s = aValue.toExponential().split('e');
        var n = aCeil ? Math.ceil(aMultiplier * s[0]) : Math.floor(aMultiplier * s[0]);
        return parseFloat(n / aMultiplier + 'e' + s[1]);
    }

    var r_max_y = round(max_y, 10, true);
    var r_min_y = round(min_y, 10, false);
    var r_max_x = round(max_x, 10, true);
    var r_min_x = round(min_x, 10, false);
    //echo_json({r_min_x, r_max_x, r_min_y, r_max_y});
    // find values span
    var span_x = r_max_x - r_min_x;
    var span_y = r_max_y - r_min_y;
    // if min and max are the same make it spread a bit
    var limit = 1000 * Number.EPSILON;
    //echo_json({r_min_x, r_max_x, r_min_y, r_max_y, span_x, span_y});
    if (Math.abs(r_min_x - r_max_x) <= limit) {
        r_min_x = r_min_x - limit;
        r_max_x = r_max_x + limit;
    }
    if (Math.abs(r_min_y - r_max_y) <= limit) {
        r_min_y = r_min_y - limit;
        r_max_y = r_max_y + limit;
    }
    span_x = r_max_x - r_min_x;
    span_y = r_max_y - r_min_y;
    // bbox
    aBbox.min_x = r_min_x;
    aBbox.min_y = r_min_y;
    aBbox.max_x = r_max_x;
    aBbox.max_y = r_max_y;
    aBbox.span_x = span_x;
    aBbox.span_y = span_y;
    // echo('BBOX');
    // echo_json(aBbox);
    return aBbox;
}

globalThis.bounding_box = bounding_box;
globalThis.exports = {bounding_box};

