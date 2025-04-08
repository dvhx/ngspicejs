#!/bin/bash
# List all js source files where exceptions are thrown any other way than: throw new Exception(...)

function files() {
    find  ../js -type f  \
        | grep '\.js$' \
        | grep -v jslint-2018-03-14.js \
        | grep -v js-beautify-1.14.8.js \
        | grep -v jsep.js \
        | grep -v js-beautify.js \
        | grep -v jshint-2.13.6.js \
        | sort

}

for i in `files`; do
    t=`cat $i | grep throw | grep -v 'throw new Exception('`
    if [ "$t" != "" ]; then
        #t=`echo "${t:0:40}" | sed 's/^[ ]*//;s/^/  /'`
        echo $i
        echo "$t" | sed 's/^[ ]*//;s/^/  /'
    fi
done

