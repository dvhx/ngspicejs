#!/bin/bash
# run all tests in current directory and compare them with reference
T1=`date +%s`
for i in *.ngjs; do
    R=`echo "$i" | sed 's/ngjs$/ref/'`
    N=`echo "$i" | sed 's/ngjs$/ref\.new/'`
    echo $i
    echo $R
    ./$i --zero-stack --no-gif >$N 2>&1

    SR=`cat $R`
    SN=`cat $N`
    if [ "$SR" != "$SN" ]; then
        echo "ERROR: output changed for $i"
        meld "$R" "$N"
        # check again after meld
        SR=`cat $R`
        SN=`cat $N`
        if [ "$SR" != "$SN" ]; then
            echo -n ".ref and .ref.new differs after merge, press ENTER to continue, Ctrl+C to abort: "
            read
        fi
    fi
    rm $N 2>/dev/null
done
T2=`date +%s`
echo "Done in "$(($T2 - $T1))" seconds"
beep