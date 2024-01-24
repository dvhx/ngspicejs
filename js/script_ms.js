// Return milliseconds since script started
// linter: ngspicejs-lint --internal
"use strict";

var script_ms_t0 = Date.now();

function script_ms() {
    // Return milliseconds since script started
    return Date.now() - script_ms_t0;
}

globalThis.exports = {script_ms};
globalThis.script_ms = script_ms;

