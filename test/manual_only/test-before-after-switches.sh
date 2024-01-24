#!/bin/bash
ngspicejs \
    --eval-before-init 'if (globalThis.tran) { echo("error: tran should not exist before init"); };' \
    --eval-before-script 'echo("before script");' \
    --eval-after-script 'echo("after script")' \
    hello.ngjs

