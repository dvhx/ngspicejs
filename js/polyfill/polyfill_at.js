// Polyfill for ES-2022 .at method, e.g. ['a', 'b', 'c'].at(-1) returns 'c'
// linter: ngspicejs-lint --internal
"use strict";

/* jshint -W040 */

(function () {
    if (Array.prototype.at) {
        return;
    }
    function at(n) {
        // ToInteger() abstract op
        n = Math.trunc(n) || 0;
        // Allow negative indexing from the end
        if (n < 0) {
            n += this.length;
        }
        // OOB access is guaranteed to return undefined
        if (n < 0 || n >= this.length) {
            return undefined;
        }
        // Otherwise, this is just normal property access
        return this[n];
    }

    const TypedArray = Reflect.getPrototypeOf(Int8Array);
    for (const C of [Array, String, TypedArray]) {
        Object.defineProperty(C.prototype, "at",
                              { value: at,
                                writable: true,
                                enumerable: false,
                                configurable: true });
    }

}());
/* jshint +W040 */

globalThis.exports = {};
