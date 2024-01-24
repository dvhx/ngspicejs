// Render spice netlist
// linter: ngspicejs-lint --internal
"use strict";

function netlist_render(aNetlistDevices, aLineMarkers, aMustHaveGround, aIsSubCkt) {
    // Render spice netlist
    assert_arguments_length(arguments, 4, 4, 'netlist_render(netlist_devices, line_markers, must_have_ground, is_sub)');
    assert_array(aLineMarkers, 'line_markers', 'netlist_render(netlist_devices, line_markers, must_have_ground, is_sub)');
    assert_boolean(aMustHaveGround, 'must_have_ground', 'netlist_render(netlist_devices, line_markers, must_have_ground, is_sub)');
    assert_boolean(aIsSubCkt, 'is_sub', 'netlist_render(netlist_devices, line_markers, must_have_ground, is_sub)');
    check_parallel_sources(aNetlistDevices);
    aLineMarkers.length = 0;
    var i;
    var spice = [];
    var name;
    var names = {};
    var nets = {};
    var n;
    var dnet = {};
    var z;
    var zzz;
    spice.push('** netlist_render BEGIN');
    for (i = 0; i < aNetlistDevices.length; i++) {
        // add line marker
        aLineMarkers.push({
            line: spice.length,
            device: i
        });
        // extra checks
        if (!aNetlistDevices[i].hasOwnProperty('expected_prefix')) {
            echo(aNetlistDevices[i].expected_prefix);
            internal_error('device #' + i + ' of type ' + aNetlistDevices[i].type + ' named "' + aNetlistDevices[i].attr.name + '" has no expected_prefix!');
        }
        if (typeof aNetlistDevices[i].is_voltage_source !== 'boolean') {
            internal_error('device #' + i + ' of type ' + aNetlistDevices[i].type + ' named "' + aNetlistDevices[i].attr.name + '" does not correctly specify if it is voltage source by using boolean "is_voltage_source"!');
        }
        if (typeof aNetlistDevices[i].is_net_device !== 'boolean') {
            internal_error('device #' + i + ' of type ' + aNetlistDevices[i].type + ' named "' + aNetlistDevices[i].attr.name + '" does not correctly specify if it is net device by using boolean "is_net_device"!');
        }
        if (aNetlistDevices[i].hasOwnProperty('name_suffix')) {
            internal_error('device #' + i + ' of type ' + aNetlistDevices[i].type + ' named "' + aNetlistDevices[i].attr.name + '" has name_suffix - this is deprecated!');
            echo_json(aNetlistDevices);
            exit(1);
        }

        // check for footgun: resistor('C1', 1, 0, '100n');
        if (aNetlistDevices[i].expected_prefix) {
            assert_expected_prefix(aNetlistDevices[i].attr.name, aNetlistDevices[i]);
        }

        // must have render function
        if (!aNetlistDevices[i].render || (typeof aNetlistDevices[i].render !== 'function')) {
            error("netlist device #" + i + " of type " + aNetlistDevices[i].type + " does not have render function");
            return;
        }

        // must have validate function
        if (!aNetlistDevices[i].validate || typeof aNetlistDevices[i].validate !== 'function') {
            error("Device " + aNetlistDevices[i].type + " does not have validate() method");
            return;
        }

        // validate and render
        aNetlistDevices[i].validate();
        spice = spice.concat(aNetlistDevices[i].render().split('\n'));

        // must have get_nets and must be connected to some nets
        if (aNetlistDevices[i].is_net_device) {
            if (typeof aNetlistDevices[i].get_nets !== 'function') {
                internal_error('Net device ' + device_summary(aNetlistDevices[i]) + ' does not have get_nets() function!');
            }
            dnet = aNetlistDevices[i].get_nets();
            if (Object.keys(dnet).length === 0) {
                internal_error('Net device ' + device_summary(aNetlistDevices[i]) + ' did not set nets correctly during render(nets)');
            }
        }

        // add device nets to all nets
        zzz = Object.keys(dnet);
        for (z = 0; z < zzz.length; z++) {
            n = zzz[z];
            nets[dnet[n]] = {device: aNetlistDevices[i], pin: n};
        }

        // check unique device names
        name = '';
        if (aNetlistDevices[i].type !== 'spice') {
            name = aNetlistDevices[i].attr.name;
        }
        if (name) {
            if (names[name]) {
                error("Duplicate device name '" + name + "' caused by device " + aNetlistDevices[i].type);
                return;
            }
            names[name] = true;
        }
    }
    // end of netlist
    spice.push('** netlist_render END');
    if (aIsSubCkt) {
        spice.push('.ends');
    } else {
        spice.push('.end');
    }

    // last line marker
    aLineMarkers.push({
        line: spice.length,
        device: aNetlistDevices.length
    });

    // check ground
    if (aMustHaveGround && !nets.hasOwnProperty('0')) {
        error('Missing ground, at least one network has to be named "0"');
    }

    // exit on error
    if (error.happened) {
        exit(19); // EXIT_NETLIST
    }

    // this is only for debugging purposes
    netlist_render.used_nets = nets;

    return spice.join('\n');
}

globalThis.exports = {netlist_render};
globalThis.netlist_render = netlist_render;
