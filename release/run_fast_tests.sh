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
    find ../test \
        | grep -e 'ngjs$' -e 'sh$' \
        | grep -v manual_only \
        | grep -v 0_run_tests.sh \
        | grep -v resistor_with_pwl.ngjs \

    find ../howto \
        | grep -e 'ngjs$' -e 'sh$' \
        | grep -v 0_run_tests.sh \
        | grep -v help_indexer.ngjs \

    find ../example | grep -v help_indexer.ngjs \
        | grep -v 0_run_tests.sh \
        | grep -v find_model_zener_9V1.ngjs \
        | grep -v find_model_zener_2V4.ngjs \
        | grep -v 4_caught_new_exception.ngjs \
        | grep -v tran_step_and_audio_quality.ngjs \
        | grep -v optimize_bjt_switch.ngjs \
        | grep -v pedal_metal_simplex.ngjs \
        | grep -v condenser_mic_optimizing_volume_pot.ngjs \
        | grep -v treasure_witcher.ngjs \
        | grep -v maximize_gain.ngjs \
        | grep -v maximize_gain_3V3.ngjs \
        | grep -v maximize_gain_singlecoil.ngjs \
        | grep -v pedal_opamp_fuzz.ngjs \
        | grep -v npn_measure_vaf.ngjs \
        | grep -v npn_measure_vce_ic_using_current_source.ngjs \
        | grep -v npn_measure_vce_ic_using_current_source_chart.ngjs \
        | grep -v thd_by_amplitude_and_load.ngjs \
        | grep -v thd_by_amplitude_and_load_constant_current_emitter_follower.ngjs \
        | grep -v r1_r2.ngjs \
        | grep -v score.ngjs \
        | grep -v pedal_peppermill.ngjs \
        | grep -v measure_C0_and_L0.ngjs \
        | grep -v emitter_follower.ngjs \
        | grep -v 'singlecoil_pickup_ac/measure_C0_and_L0.ngjs' \
        | grep -v 'emitter_follower/input_offset_and_gain.ngjs' \
        | grep -v 'npn_characteristics/npn_measure_hfe_using_opamp.ngjs' \
        | grep -v 'pnp_characteristics/pnp_measure_hfe.ngjs' \
        | grep -v 'emitter_follower/r1_r2_r3.ngjs' \
        | grep -v follower_distortion_amplitude_vs_load.ngjs \
        | grep -e 'ngjs$' -e 'sh$'
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
    # group them them to simplify merges
    [ "$DUR" = "0" ] && DUR=1
    [ "$DUR" = "2" ] && DUR=3
    echo " ($DUR seconds)"
    echo "TEST $ABS ($DUR seconds)" >> $LOG
}

# run just quick test first
echo $PWD
R2="../test/a_quick_test.ref"
run_one_test ../test/a_quick_test.ngjs
N=$R2".new"
SR=`cat $R2`
SN=`cat $N`
if [ "$SR" != "$SN" ]; then
    echo "ERROR: output changed for $R2"
    beep
    meld "$R2" "$N"
    exit 1
fi


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
echo "All tests done in $DUR seconds, expected time 246s"
beep
