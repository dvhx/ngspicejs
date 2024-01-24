#!/bin/bash
# run help indexer used in help(query) function
(
cd ../doc
./api.ngjs
)
(
cd ../help
./help_indexer.ngjs
) | tee $0.log
