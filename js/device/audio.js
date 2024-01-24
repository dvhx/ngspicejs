// Audio file (.wav, .m) voltage source
// linter: ngspicejs-lint --internal
"use strict";

function Audio(aName, aAnode, aCathode, aFilename, aOffset, aV, aDelay) {
    // Constructor
    assert_arguments_length(arguments, 0, 7, 'audio(name,anode,cathode,filename,offset,v,delay)');
    this.type = 'audio';
    this.expected_prefix = ['U', 'V'];
    this.netlist_devices = netlist_devices;
    this.netlist_devices.push(this);
    this.is_net_device = true;
    this.is_voltage_source = true;
    this.attr = {delay: 0, offset: 0};
    // single attr value, e.g. device({name: 'U1', anode: 1, cathode: 0, ...});
    if (arguments.length === 1 && typeof aName === 'object') {
        object_merge(this.attr, aName);
        this.validate();
        return;
    }
    // individual arguments
    if (aName !== undefined && typeof aName === 'string') {
        this.name(aName);
    }
    if (aAnode !== undefined) {
        this.anode(aAnode);
    }
    if (aCathode !== undefined) {
        this.cathode(aCathode);
    }
    if (aFilename !== undefined) {
        this.filename(aFilename);
    }
    if (aOffset !== undefined) {
        this.offset(aOffset);
    }
    if (aV !== undefined) {
        this.v(aV);
    }
    if (aDelay !== undefined) {
        this.phase(aDelay);
    }
}

function audio(aName, aAnode, aCathode, aFilename, aOffset, aV, aDelay) {
    // Add audio voltage source to netlist
    assert_arguments_length(arguments, 0, 7, 'audio(name,anode,cathode,filename,offset,v,delay)');
    if (arguments.length === 1 && typeof aName === 'object') {
        return new Audio(aName);
    }
    var d = new Audio(aName, aAnode, aCathode, aFilename, aOffset, aV, aDelay);
    warn_source_arguments_length(arguments, d, 3);
    return d;
}

Audio.prototype.name = function (aName, aAllowThisPrefix) {
    // Set name
    assert_arguments_length(arguments, 1, 2, 'audio.name(name,allow_this_prefix)');
    assert_name(aName, 'audio');
    assert_name_unique(aName, this, this.netlist_devices);
    update_expected_prefix(this, aName, aAllowThisPrefix);
    assert_expected_prefix(aName, this);
    this.attr.name = aName;
    return this;
};

Audio.prototype.anode = function (aAnode) {
    // Set anode
    assert_arguments_length(arguments, 1, 1, 'audio.anode(net)');
    assert_net(aAnode, 'net', 'audio.anode(net)');
    this.attr.anode = aAnode;
    return this;
};

Audio.prototype.cathode = function (aCathode) {
    // Set cathode
    assert_arguments_length(arguments, 1, 1, 'audio.cathode(net)');
    assert_net(aCathode, 'net', 'audio.cathode(net)');
    this.attr.cathode = aCathode;
    return this;
};

Audio.prototype.offset = function (aValue) {
    // Set offset
    assert_arguments_length(arguments, 1, 1, 'audio.offset(voltage)');
    this.attr.offset = eng(aValue, 1, 'audio.offset(voltage)');
    return this;
};

Audio.prototype.v = function (aValue) {
    // Set amplitude
    assert_arguments_length(arguments, 1, 1, 'audio.v(voltage)');
    this.attr.v = eng(aValue, 1, 'audio.v(voltage)');
    return this;
};

Audio.prototype.get_duration = function () {
    // Return duration of audio file
    if (!file_exists(this.attr.filename)) {
        throw new Exception('Audio file "' + this.attr.filename + '" not found!');
    }
    var ext = file_ext(this.attr.filename);
    if (ext === '.wav') {
        var w = file_read_wav(this.attr.filename);
        return w.time.at(-1);
    } else if (ext === '.m') {
        var m = file_read(this.attr.filename);
        return parseFloat(m.split('\n').at(-1).split(' ')[0]);
    } else {
        throw new Exception('Only .wav and .m audio files are supported, cannot get duration of ' + this.attr.filename);
    }
};

Audio.prototype.filename = function (aValue) {
    // Set .wav or .m filename
    assert_arguments_length(arguments, 1, 1, 'audio.filename(path)');
    if (!file_exists(aValue)) {
        throw new Exception("Audio file '" + aValue + "' not found!");
    }
    if (aValue.toLowerCase() !== aValue) {
        hint(aValue);
        hint((new Array(aValue.match(/[A-Z]/).index)).fill(' ').join('') + ' ↖ here');
        throw new Exception("ngspice cannot open filename with uppercase characters: " + aValue);
    }
    if (file_ext(aValue) === '.wav') {
        var w = aValue;
        var m = file_ext_replace(w, '.m');
        // if m exists and has same modified time as wav
        if (file_exists(m) && (file_stat(w).modified === file_stat(m).modified)) {
            // reuse it
            aValue = m;
            hint('audio() reusing existing m file "' + m + '" instead of wav file "' + w + '"');
        } else {
            hint('audio() converting wav file "' + w + '" to m file "' + m + '"');
            // transparently convert .wav to .m
            var wav = file_read_wav(w);
            file_write_m(m, wav.time, wav.data);
            // change .m modify time to be the same as .wav
            var ow = file_stat(w);
            file_touch(m, ow.accessed, ow.modified);
            aValue = m;
        }
    }
    if (file_ext(aValue) !== '.m') {
        throw new Exception("Audio currently only support .m files, cannot open " + aValue);
    }
    this.attr.filename = aValue;
    return this;
};

Audio.prototype.delay = function (aValue) {
    // Set delay
    assert_arguments_length(arguments, 1, 1, 'audio.delay(seconds)');
    this.attr.delay = eng(aValue, 1, 'audio.delay(seconds)');
    return this;
};

Audio.prototype.validate = function () {
    // Validate device attributes
    assert_arguments_length(arguments, 0, 0, 'audio.validate()');
    device_attr_check(this, this.attr, {
        name: {type: "string", required: true, min: 1, max: 100, alphanumeric: true, startalpha: true},
        anode: {type: "net", required: true},
        cathode: {type: "net", required: true},
        offset: {type: "number", min: -1e9, max: 1e9, eng: true, equation: true},
        v: {type: "number", min: 1e-12, max: 1e9, required: true, eng: true, equation: true},
        filename: {type: "string", min: 1, max: 5000, required: true, eng: false, equation: false},
        delay: {type: "number", min: 0, max: 1000, eng: true, equation: true}
    });
    device_attr_assign(this, this.attr);
};

Audio.prototype.get_value = function () {
    // Return main "principal" value (used only in informative schematic)
    assert_arguments_length(arguments, 0, 0, 'audio.get_value()');
    this.validate();
    return this.attr.filename + ' ' + this.attr.v + 'V';
};

Audio.prototype.get_nets = function () {
    // Return nets of this device
    assert_arguments_length(arguments, 0, 0, 'audio.get_nets()');
    return {
        anode: this.attr.anode,
        cathode: this.attr.cathode
    };
};

Audio.prototype.remove = function () {
    // Remove this device from netlist
    assert_arguments_length(arguments, 0, 0, 'audio.remove()');
    this.netlist_devices.splice(this.netlist_devices.indexOf(this), 1);
    return this;
};

Audio.prototype.render = function () {
    // Render spice netlist
    assert_arguments_length(arguments, 0, 0, 'audio.render()');
    // SIN (VO VA FREQ TD THETA PHASE )
    var spice = [];
    spice.push("* audio " + this.attr.name);
    // a8 %vd([2 0]) filesrc
    // .model filesrc filesource (file="chord.m" amploffset=[0 0] amplscale=[0.5 0.5] timeoffset=0 timescale=1 timerelative=false amplstep=false)
    spice.push("a_audio__" + this.attr.name + " %vd([" + this.attr.anode + " " + this.attr.cathode + "]) filesrc_audio_" + this.attr.name);
    spice.push(".model filesrc_audio_" + this.attr.name +
        " filesource (file=\"" + this.attr.filename + "\"" +
        " amploffset=[" + (this.attr.offset || 0) + "]" +
        " amplscale=[" + (this.attr.v || 1) + "]" +
        " timeoffset=" + (this.attr.delay || 0) +
        " timescale=1 timerelative=false amplstep=false" +
        ")"
    );
    return spice.join('\n');
};

globalThis.audio = audio;
Internal.Audio = Audio;
globalThis.exports = {Audio,audio};
Internal.device_constructor.audio = audio;
