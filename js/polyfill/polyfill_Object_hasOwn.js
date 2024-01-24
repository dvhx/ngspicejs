// Polyfill for Object.hasOwn
// linter: ngspicejs-lint
"use strict";

if (!Object.hasOwn) {
    Object.hasOwn = Object.call.bind(Object.hasOwnProperty);
}

globalThis.exports = {};
