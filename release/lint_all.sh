#!/bin/bash

T1=`date +%s`

function all_files() {
    find ../js \
        | grep -v '/depend/' \
        | grep -v 'special/header.js' \
        | grep -v 'special/footer.js' \
        | grep -v 'mersenne_twister.js' \
        | grep -e '\.js$'
    find ../test | grep -e '\.ngjs$'
    find ../howto | grep -e '\.ngjs$'
    find ../example | grep -e '\.ngjs$'
}

LOG=$0.log
>$LOG

function lint_one_file() {
    D=`dirname "$ABS"`
    S=`basename "$ABS"`
    ABS="$1"
    L=`ngspicejs-lint "$ABS"`
    if [ "$L" != "" ]; then
        echo "$L" >> $LOG
        echo "$L"
    fi
}

N=0
TOT=`all_files | wc -l`
for i in `all_files`; do
    N=$(($N + 1))
    echo "$N/$TOT $i"
    lint_one_file $i
done

T2=`date +%s`

echo "Linted $N files in "$(($T2 - $T1))
beep
