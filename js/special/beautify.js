// JS Beautify boilerplate, used only in ngspicejs-beautify
// linter: ngspicejs-lint --internal
"use strict";

var js_beautify = globalThis.js_beautify;

function beautify() {
    // Beautify argument of the: ngspicejs-beautify <filename>

    // no arguments?
    if (script_args().length === 0) {
        echo('usage: ngspicejs-beautify <filename>');
        throw "NGSPICEJS_SOFT_EXIT";
    }

    // get filename
    var fn = script_self();

    // Check if file exists
    if (!file_exists(fn)) {
        echo('ngspicejs-beautify: file not found "' + fn + '"');
        throw "NGSPICEJS_SOFT_EXIT";
    }

    var code = file_read(fn);
    //echo('fn', fn);

    // disable hashbang
    var hashbang = code.startsWith('#!');
    if (hashbang) {
        code = '//' + code;
    }

    // beautify
    code = js_beautify(code, {
        jslint_happy: true
    });

    // enable hashbang
    if (hashbang) {
        code = code.substr(2);
    }

    // print code
    echo(code);
}

// Call beautify
beautify();

