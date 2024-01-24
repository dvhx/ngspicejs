// Counter for things
// linter: ngspicejs-lint --internal
"use strict";

function Tally(oName) {
    // Constructor
    this.name = oName;
    this.counts = {};
}

function tally(oName) {
    // Create tally
    return new Tally(oName);
}

Tally.prototype.inc = function () {
    // Increment any key provided in arguments, e.g. a.inc('foo', 'bar')
    var key = Array.from(arguments).join(',');
    this.counts[key] = this.counts[key] || 0;
    this.counts[key]++;
    return {key, count: this.counts[key]};
};

Tally.prototype.echo = function () {
    // Print tally counts
    if (this.name) {
        echo(this.name + ':');
    }
    Object.entries(this.counts).sort(function (a, b) {
        return b[1] - a[1];
    }).forEach((e) => echo('  ' + e[1] + 'x ' + e[0]));
};

globalThis.exports = {Tally,tally};
globalThis.tally = tally;
