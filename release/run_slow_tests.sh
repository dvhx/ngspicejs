#!/bin/bash
# run all tests except the very slow tests

clear
T1=`date +%s`
LOG=$0.log
>$LOG

CONTINUE_FROM=$1
[ "$CONTINUE_FROM" = "" ] && CONTINUE_FROM=0

function all_tests() {
    echo ../test/a_quick_test.ngjs
    echo ../example/emitter_follower/simple_test.ngjs

    echo ../example/zener_diode_model_maker/find_model_zener_9V1.ngjs
    echo ../example/zener_diode_model_maker/find_model_zener_2V4.ngjs
    echo ../example/audio/tran_step_and_audio_quality.ngjs
    echo ../example/optimize_bjt_switch/optimize_bjt_switch.ngjs
    echo ../example/pedal_peppermill/pedal_peppermill.ngjs
    echo ../example/pedal_metal_simplex/pedal_metal_simplex.ngjs
    echo ../example/condenser_mic_optimizing_volume_pot/condenser_mic_optimizing_volume_pot.ngjs
    echo ../example/maximize_gain/maximize_gain.ngjs
    echo ../example/maximize_gain/maximize_gain_3V3.ngjs
    echo ../example/maximize_gain/maximize_gain_singlecoil.ngjs
    echo ../example/pedal_opamp_fuzz/pedal_opamp_fuzz.ngjs
    echo ../example/npn_characteristics/npn_measure_vaf.ngjs
    echo ../example/npn_characteristics/npn_measure_vce_ic_using_current_source.ngjs
    echo ../example/npn_characteristics/npn_measure_vce_ic_using_current_source_chart.ngjs
    echo ../example/emitter_follower/thd_by_amplitude_and_load.ngjs
    echo ../example/emitter_follower/thd_by_amplitude_and_load_constant_current_emitter_follower.ngjs
    echo ../example/emitter_follower/r1_r2.ngjs
    echo ../example/singlecoil_pickup_ac/measure_C0_and_L0.ngjs
    echo ../example/singlecoil_pickup_ac/measure_C0_and_L0.ngjs
    echo ../example/emitter_follower/input_offset_and_gain.ngjs
    echo ../example/npn_characteristics/npn_measure_hfe_using_opamp.ngjs
    echo ../example/pnp_characteristics/pnp_measure_hfe.ngjs
    echo ../example/emitter_follower/r1_r2_r3.ngjs
    echo ../example/blend_circuit/follower_distortion_amplitude_vs_load.ngjs
}

function run_one_test() {
    TT1=`date +%s`
    ABS="$1"
    D=`dirname "$ABS"`
    S=`basename "$ABS"`
    R=`echo "$S" | sed 's/ngjs$/ref/;s/sh$/ref/'`
    N=$R".new"
    echo -n "TEST $ABS"
    (
        cd $D
        if [ "`echo $S | grep ngjs$`" != "" ]; then
            ngspicejs --zero-stack ./$S --no-gif >$N 2>&1
        else
            ./$S >$N 2>&1
        fi
    )
    TT2=`date +%s`
    DUR=$(($TT2 - $TT1));
    echo " ($DUR seconds)"
    echo "TEST $ABS ($DUR seconds)" >> $LOG
}

# check for missing .ref files, create one if missing
N=0
for i in `all_tests`; do
    REF=`echo "$i" | sed 's/ngjs$/ref/;s/sh$/ref/'`
    if [ ! -f "$REF" ]; then
        echo "ERROR: reference file $REF not found for $i"
        beep
        exit 1
    fi
    N=$(($N + 1))
done

echo "$N test references found..."

CUR=0
TOT=$N

for i in `all_tests`; do
    CUR=$(($CUR + 1))
    echo -n "$CUR/$TOT: "

    if [ $CONTINUE_FROM -gt 0 ]; then
        if [ $CUR -lt $CONTINUE_FROM ]; then
            echo
            continue
        fi
    fi

    run_one_test $i
    R=`echo "$i" | sed 's/ngjs$/ref/;s/sh$/ref/'`
    N=$R".new"
    #echo "R=$R N=$N"
    SR=`cat $R`
    SN=`cat $N`
    if [ "$SR" != "$SN" ]; then
        echo "ERROR: output changed for $i"
        beep
        meld "$R" "$N"
        SR=`cat $R`
        SN=`cat $N`
        if [ "$SR" != "$SN" ]; then
            echo "ref and new not same after merge, aborting tests"
            te $i
            echo -n "Press ENTER to continue tests, Ctrl+C to abort: "
            read
        fi
    fi
    rm $N 2>/dev/null
done

T2=`date +%s`
DUR=$(($T2 - $T1))
echo "All tests done in $DUR seconds, expected time 549s"
beep
