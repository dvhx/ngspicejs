// Return full path including trailing slash to the user's config directory ~/.config/ngspicejs/
// linter: ngspicejs-lint --internal
"use strict";

function config_path() {
    // Return full path including trailing slash to the user's config directory ~/.config/ngspicejs/
    return env('HOME') + '/.config/ngspicejs/';
}

globalThis.exports = {config_path};
globalThis.config_path = config_path;
