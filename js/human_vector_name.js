// Convert ugly vector "x_x1.v_v1#branch" to nice vector "I(X1.V1)"
// linter: ngspicejs-lint --internal
"use strict";

function human_vector_name(aUglyName) {
    // Convert ugly vector "x_x1.v_v1#branch" to nice vector "I(X1.V1)"
    // v4 - more mindful look-ahead version with *_... prefixes for ngjs devices
    assert_arguments_length(arguments, 1, 1, 'human_vector_name(ugly_vector_name)');

    function auto(aToken) {
        // e1 --> E1, e_e1 --> E1, x_dynamic_mic__mic1 --> MIC1
        if (aToken.match('__')) {
            return aToken.split('__')[1].toUpperCase();
        }
        if (aToken.charAt(1) === '_') {
            return aToken.substr(2).toUpperCase();
        }
        return aToken.toUpperCase();
    }

    // single keyword
    if (['time', 'frequency'].includes(aUglyName)) {
        return aUglyName;
    }
    // V(net)
    if (aUglyName.match(/^V\([a-z0-9_]+\)$/)) {
        return aUglyName;
    }
    // v(net)
    if (aUglyName.match(/^v\([a-z0-9_]+\)$/)) {
        return 'V' + aUglyName.substr(1);
    }
    // net
    if (aUglyName.match(/^[a-z0-9_]+$/)) {
        return 'V(' + aUglyName + ')';
    }
    // is it current? (#branch #branch_1_0 #collCX #body diode)
    var orig = aUglyName;
    var current = aUglyName.match('#');
    var current_tag;
    if (current) {
        [aUglyName, current_tag] = aUglyName.split('#');
        switch (current_tag) {
            case "branch": current_tag = ''; break;
            case "collCX": current_tag = 'IC'; break;
            case "collcx": current_tag = 'IC'; break;
            case "body diode": current_tag = 'BODY_DIODE'; break;
            case "gate": current_tag = 'GATE'; break;
            case "branch_1_0": current_tag = ''; break; // I don't know how to achieve anything other than 1_0 so it makes no sense for now to use anything other than empty string
            case "branch_0_0": current_tag = ''; break; // audio
        }
        if (current_tag !== '') {
            current_tag = '.' + current_tag;
        }
    }

    // split vector by dots
    var arr = aUglyName.split('.');
    var len = arr.length, a0 = arr[0], a1 = arr[1], a2 = arr[2], a3 = arr[3], a4 = arr[4];

    //echo_json(arr);
    //echo('len', len, 'a0', a0, 'a1', a1);

    // 0   c
    // m_q1#body diode
    if ((len === 1) && (a0.startsWith('m')) && orig.endsWith('#body diode')) {
        return 'I(' + auto(a0) + current_tag + ')';
    }
    // 0   c
    // m_q1#gate
    if ((len === 1) && (a0.startsWith('m')) && orig.endsWith('#gate')) {
        return 'I(' + auto(a0) + current_tag + ')';
    }

    // e1#branch
    // e_e1#branch
    if ((len === 1) && (a0.match(/^(a|b|q|e|v|g|h|f|l)[a-z0-9_]+$/))) {
        return current ? ('I(' + auto(a0) + current_tag + ')') : ('V(' + auto(a0) + ')');
    }

    // 0      !   c
    // a$poly$e_e2#branch_1_0
    if ((len === 1) && (a0.startsWith('a$poly$e_'))) {
        return current ? ('I(' + auto(a0.substr(7)) + current_tag + ')') : ('V(' + auto(a0.substr(7)) + ')');
    }

    // 0     !    c
    // a$poly$h_h3#branch_1_0
    if ((len === 1) && (a0.startsWith('a$poly$h_'))) {
        return current ? ('I(' + auto(a0.substr(7)) + current_tag + ')') : ('V(' + auto(a0.substr(7)) + ')');
    }

    // x_d3.3
    if ((len === 2) && (a0.startsWith('x_'))) {
        return current ? ('I(' + auto(a0) + '.' + auto(a1) + current_tag + ')') : ('V(' + auto(a0) + '.' + auto(a1) + ')');
    }

    // 0 1   2  c
    // l.xq2.lld#branch
    if ((len === 3) && (a0.match(/^[qevghfl]{1}$/)) && a1.startsWith('x')) {
        return current ? ('I(' + auto(a1) + '.' + auto(a2) + current_tag + ')') : ('V(' + auto(a1) + '.' + auto(a2) + ')');
    }

    // 0 1    2   c
    // b.x_v2.b_b1#branch
    if ((len === 3) && (a0.length === 1) && (a1.startsWith('x'))) {
        return current ? ('I(' + auto(a1) + '.' + auto(a2) + current_tag + ')') : ('V(' + auto(a1) + '.' + auto(a2) + ')');
    }

    // 0    1                   2
    // x_x1.x_dynamic_mic__mic1.1
    if ((len === 3) && (a0.startsWith('x')) && (a1.startsWith('x'))) {
        return current ? ('I(' + auto(a0) + '.' + auto(a1) + '.' + auto(a2) + current_tag + ')') : ('V(' + auto(a0) + '.' + auto(a1) + '.' + auto(a2) + ')');
    }

    // 0 1    2                   3   c
    // l.x_x1.x_dynamic_mic__mic1.l_lp#branch
    if ((len === 4) && (a0.length === 1) && (a1.startsWith('x'))) {
        return current ? ('I(' + auto(a1) + '.' + auto(a2) + '.' + auto(a3) + current_tag + ')') : ('V(' + auto(a1) + '.' + auto(a2) + '.' + auto(a3) + ')');
    }

    // 0        1   2   c
    // a$poly$e.xq2.efb1#branch_1_0
    if ((len === 3) && (a0.startsWith('a$poly$e')) && orig.endsWith('#branch_1_0')) {
        return 'I(' + auto(a1) + '.' + auto(a2) + current_tag + ')';
    }

    // 0        1    2           3    c
    // a$poly$e.x_x1.x_opamp__q1.e_eos#branch_1_0
    if ((len === 4) && (a0 === 'a$poly$e') && (a1.startsWith('x'))) {
        return current ? ('I(' + auto(a1) + '.' + auto(a2) + '.' + auto(a3) + current_tag + ')') : ('V(' + auto(a1) + '.' + auto(a2) + '.' + auto(a3) + ')');
    }

    // 0 1    2 3    4   c
    // l.x_x1.l.x_l1.l_l0#branch
    if ((len === 5) && (a0.length === 1) && (a1.startsWith('x') && (a2 === a0))) {
        return current ? ('I(' + auto(a1) + '.' + auto(a3) + '.' + auto(a4) + current_tag + ')') : ('V(' + auto(a1) + '.' + auto(a3) + '.' + auto(a4) + ')');
    }

    //echo_json(arr);
    warn(orig + ' - this vector could not be converted to human vector name');
    return orig;
}

function human_vector_names(aData) {
    // Convert ugly vectors to human vectors in tran or ac data
    assert_arguments_length(arguments, 1, 1, 'human_vector_names(data)');
    assert_object(aData, 'data', 'human_vector_names(data)');
    for (const [key] of Object.entries(aData)) {
        var h = human_vector_name(key);
        if (h !== key) {
            aData[h] = aData[key];
            delete aData[key];
        }
    }
}

globalThis.human_vector_names = human_vector_names;
globalThis.exports = {human_vector_name, human_vector_names};
