Changes in v0.4 (2025-04-08)
- Updated code for Ubuntu 24.04, ngspice 42, libv8 10.2.154.26-node.28

Changes in v0.3 (2024-07-08)
- Added ngspicejs_version() that returns version (currently 3)
- Added topology_edges() function
- Added topology_path_exists() function
- Added tran.index_at() function
- Don't print repeated lines in error log
- Don't throw exception in is_compiled_equation() instead return false

Changes in v0.2 (2024-03-31)
- Added ctrl+c handler
- Added indicator if any circuit is loaded
- Added option that allows to ignore errors in ngspice_process_log
- Added tran_ok() analysis to check if transient analysis will pass
- Added function ngspice_clear_log() to manually clear log
- Added error parser for "Timestep too small" error
- Added 2 array functions (.addScalar and .sortNumerically)
- Added dot size to series of chart_xy
- Added number of levels to scatter chart
- Added read_char() to read single character from user without waiting for ENTER key
- Added function to manually dispose of tran data
- Added automatic circuit unloading via remcirc to prevent OOM and slowdown
- Removed beep from makefile
- Removed setting exit code 13 automatically if error() is called
- Improved jfet model constraints
- Improved unit test scripts
- Improved linter
- Keep most recent netlist for better error reporting
- Fixed reporting errors in single line json files
- Allowed tran to end without any data
- Allowed negative current in current source
- Allowed negative voltage in battery
- Don't keep more than 10 most recent analyses
- Improved hiding of echo_progress() indicator

Changes in v0.1 (2024-01-24)
- Initial release