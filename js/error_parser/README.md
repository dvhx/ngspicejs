The idea behind error parsers is that because ngspice prints errors willy nilly in stdout and 
stderr and very often on multiple lines, in order to give *meaningfull* error message, the 
parser for one specific error must parse entire log at once.

This directory contains error parsers. A functions that parse entire output log and if they
find something, they return error message, hints and confidence value (1=important error, 
0=less important error, undefined=no error)
