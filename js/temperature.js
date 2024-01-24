// Manage simulation temperature
// linter: ngspicejs-lint --internal
"use strict";

Internal.simulation_temperature = 27;

function temperature(aDegreesC) {
    // Set simulation temperature, return current temperature
    assert_arguments_length(arguments, 0, 1, 'temperature(degrees)');
    if (aDegreesC === undefined) {
        return Internal.simulation_temperature;
    }
    Internal.simulation_temperature = aDegreesC;
    return Internal.simulation_temperature;
}

function temperature_apply() {
    // Apply current temperature (this needs to be called after every destroy all)
    assert_arguments_length(arguments, 0, 0, 'temperature_apply()');
    Internal.ngspice_command('set temp = ' + Internal.simulation_temperature);
}

globalThis.temperature = temperature;
globalThis.exports = {temperature, temperature_apply};

