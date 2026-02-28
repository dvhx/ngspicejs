### API of ngspicejs

#### Devices

- **am** (aName,aAnode,aCathode,aOffset,aV,aF,aDelay,aFc,aPhaseDeg,aDcValue,aAcMag,aAcPhase) - Add amplitude modulation voltage source to netlist
- **ammeter** (aName,aAnode,aCathode) - Add ammeter to netlist
- **audio** (aName,aAnode,aCathode,aFilename,aOffset,aV,aDelay) - Add audio voltage source to netlist
- **battery** (aName,aAnode,aCathode,aV,aRs) - Add battery to netlist
- **beeps** (aName,aAnode,aCathode,aOffset,aV,aF,aDelay,aPulseWidth,aPeriod,aDcValue,aAcMag,aAcPhase) - Add sinewave voltage source that is on/off for given time
- **capacitor** (aName,aAnode,aCathode,aC,aRs,aRp,aLs) - Add capacitor to netlist
- **capacitor** (aName,aAnode,aCathode,aC,aRs,aRp,aLs) - Add capacitor to netlist
- **cccs** (aName,aAnode,aCathode,aVname,aGain) - Add cccs to netlist
- **ccvs** (aName,aAnode,aCathode,aVname,aGain) - Add ccvs to netlist
- **current_source** (aName,aAnode,aCathode,aI,aRs) - Add current source to netlist
- **diode** (aName,aAnode,aCathode,aModel) - Add diode to netlist
- **dynamic_mic** (aName,aAnode,aCathode,aV,aF,aDamping) - Add dynamic_mic to netlist
- **electret_mic** (aName,aAnode,aCathode,aV,aF,aDamping,aPhase) - Add electret mic to netlist
- **inductor** (aName,aAnode,aCathode,aL,aRs,aCp) - Add inductor to netlist
- **inductor_coupling** (aName,aL1,aL2,aRatio) - Add inductor_coupling to netlist
- **inductor_tapped** (aName,aStart,aWiper,aEnd,aL,aRt1,aRt2,aNTurns,aPercent) - Add tapped inductor to netlist
- **jfet_n** (aName,aD,aG,aS,aModel) - Add jfet_n to netlist
- **jfet_p** (aName,aD,aG,aS,aModel) - Add jfet_p to netlist
- **mosfet_n** (aName,aD,aG,aS,aModel) - Add mosfet_n to netlist
- **mosfet_p** (aName,aD,aG,aS,aModel) - Add mosfet_p to netlist
- **npn** (aName,aC,aB,aE,aModel) - Add npn to netlist
- **opamp** (aName,aInPlus,aInMinus,aVPlus,aVMinus,aOut,aModel) - Add opamp to netlist
- **pickup** (aName,aAnode,aCathode,aL,aC,aRs,aCp,aRp,aV,aF,aDamping,aPhase,aOvertones,aDcValue,aAcMag,aAcPhase) - Add generic inductive or capacitive pickup to netlist
- **pickup_humbucker** (aName,aAnode,aCathode) - Add humbucker pickup to netlist
- **pickup_piezo** (aName,aAnode,aCathode) - Add 27mm piezo pickup to netlist
- **pickup_singlecoil** (aName,aAnode,aCathode) - Add singlecoil pickup to netlist
- **pnp** (aName,aC,aB,aE,aModel) - Add PNP transistor to netlist
- **pot** (aName,aStart,aWiper,aEnd,aR,aPercent) - Add pot to netlist
- **pulse** (aName,aAnode,aCathode,aOffset,aV,aPulseWidth,aDelay,aRaise,aFall,aDcValue,aAcMag,aAcPhase) - Add pulse voltage source to netlist
- **pwl** (aName,aAnode,aCathode,aShape,aRepeatFrom,aDelay) - Add piece-wise linear source to netlist
- **resistor** (aName,aAnode,aCathode,aR,aLs,aCp) - Add resistor to netlist
- **resistor** (aName,aAnode,aCathode,aR,aLs,aCp) - Add resistor to netlist
- **sawtooth** (aName,aAnode,aCathode,aOffset,aV,aF,aDelay,aInverse) - Add sawtooth voltage source to netlist
- **sinewave** (aName,aAnode,aCathode,aOffset,aV,aF,aDelay,aDamping,aPhaseDeg,aDcValue,aAcMag,aAcPhase) - Add sinewave voltage source to netlist
- **spice** (aCode) - Add spice code to netlist
- **square** (aName,aAnode,aCathode,aOffset,aV,aF,aDelay,aDuty,aRaise,aFall,aDcValue,aAcMag,aAcPhase) - Add square wave periodic signal to netlist
- **sub** (aName,aModel,aNets,aParams) - Add sub to netlist, uses model previously declared with sub_model or any other kind of model
- **switch_1p2t** (aName,aInput,aOutput1,aOutput2,aState,aRon,aRoff,aTimeline) - Add switch_1p2t to netlist
- **vccs** (aName,aOutAnode,aOutCathode,aInAnode,aInCathode,aGain) - Add vccs to netlist
- **vcvs** (aName,aOutAnode,aOutCathode,aInAnode,aInCathode,aGain) - Add vcvs to netlist
- **voltmeter** (aName,aAnode,aCathode,aR) - Add voltmeter to netlist
- **vref** (aName,aRef,aAnode,aCathode,aModel) - Add voltage reference to netlist

#### Models

- **bjt_model** (aNameOrObj) - BJT model device (for NPN and PNP tranzistors)
- **diode_model** (aNameOrObj) - Add diode model to netlist
- **jfet_model** (aNameOrObj) - Add JFET model to netlist
- **mos_model** (aNameOrObj) - Add NMOS or PMOS model to netlist
- **resistor_model** (aNameOrObj) - Add resistor model to netlist
- **spice_model** (aName,aKind,aSpice) - Add spice subcircuit to netlist and register it as a model with name and kind
- **sub_model** (aName,aNets,aParams) - Add sub_model to netlist, actual device can then be added using sub()
- **vdmos_model** (aNameOrObj) - Add VDMOS model to netlist

#### Analyses

- **ac** (aFstart,aFstop,aPoints,aVariation) - AC analysis
- **ac_fast** (aFStart,aFStop,aNetName,aFrequencies,aSkipChecks) - Faster version of AC run only for few frequencies (1ms vs 30ms for standard AC)
- **battery_sensitivity** (aBatteryName,aInput,aOutput,aVMin,aVMax) - Battery sensitivity analysis (gain as a function of supply voltage)
- **fft** (aInterval,aStart,aFstop,aWindow) - Fast Fourier Transformation
- **tran** (aStep,aInterval,aStart) - Transient analysis

#### Array functions

- **array_abs** (aRealArray) - Return absolute values of array of numbers
- **array_add** (a,b) - Return sum of 2 arrays as a new array
- **array_add_scalar** (a,s) - Add scalar to each item of the array, returns new array
- **array_amplitude** (a) - Return half of the range
- **array_argument** (aComplexArray) - Convert array of complex values to array of arguments (angle part of polar coords)
- **array_avg** (a) - Return average value of array of numbers
- **array_clamp** (aArray,aMin,aMax) - Clamp values of array to interval <min,max>
- **array_column** (aArray2D,aColumnIndex,aStartingRow) - Return one column of a 2D array
- **array_complement** (a,b) - Return items of a not present in b
- **array_db** (aArray) - Convert array of real or complex values to decibels
- **array_distribution** (aArray,aCount,aMin,aMax) - Split data into equal brackets and return counts in those brackets
- **array_div** (a,b) - Divide 2 arrays by items, only works for numbers and complex numbers
- **array_extrema** (a) - Find local extrema in array, return array of {index, value, min, max}
- **array_extrema_max** (a) - Returns item with largest value from array_extrema()
- **array_extrema_min** (a) - Returns item with lowest value from array_extrema()
- **array_from_eng** (aStringArray) - Convert array of engineering strings ["22k","4u7"] to numbers [22000,4.7e-6]
- **array_imag** (aComplexArray) - Return only imaginary part of array of complex values
- **array_indices** (aArray) - Convert array ['foo',true,3.14] to [0,1,2], useful in chart_xy for data without x-axis
- **array_is_monotonic** (aArray) - Return true if array is monotonic
- **array_max** (a) - Return maximal value in array
- **array_min** (a) - Return minimal value in array
- **array_modulus** (aComplexArray) - Convert array of complex values to array of absolute values (length of a vector)
- **array_nearest** (aArray,aConstant) - Find nearest value in array of numbers
- **array_normalize** (aArray,aMin,aMax) - Normalize array for lowest value to be aMin a largest to be aMax
- **array_quantize** (aData,aCount) - Quantize array values range into discreet values from 0 to aCount-1
- **array_random_item** (aArray) - Return random item of array
- **array_range** (a) - Return difference between largest and smallest value in array
- **array_real** (aComplexArray) - Return only real part of array of complex values
- **array_rms** (a) - Return root mean square value of array of numbers
- **array_running_avg** (arr,size) - Return running average of an array
- **array_scale** (aArray,aConstant) - Return new array multiplied by a constant
- **array_shuffle** (aArray) - Return randomized shallow copy of array
- **array_sort_numerically** (aRealArray) - Return array of numbers sorted by numbers ascending
- **array_stats** (aArray) - Return all available array stats (min, max, avg, range, std)
- **array_std** (array) - Return standard deviation of an array
- **array_sub** (a,b) - Subtract 2 arrays, only works for numbers and complex numbers
- **array_sum** (a) - Return sum of all items in array
- **array_union** (a,b) - Return union of 2 arrays, for [1,2,3,4] and [3,4,5,6] it returns [3,4]
- **array_unique** (a) - Return unique values of an array

#### Echo functions

- **clear_screen** () - Clear screen of the terminal
- **echo** (...) - Print something to the default output stream, multiple arguments are separated by space
- **echo_flush** () - Flush current output stream, usable after echo_raw, you can change stream with echo_stream(number)
- **echo_hints** () - Print any pending hints stored in the hint buffer and clear hint buffer
- **echo_json** (aObject) - Print anything, even circular structure
- **echo_netlist** (aWithComments) - Print netlist
- **echo_progress** () - Show that something is being done using a rotating progress indicator
- **echo_raw** (aString) - Print single string argument to the current output stream, no new line, no flush
- **echo_stream** (aStreamNumber) - Switch output stream between 1 (stdout) and 2 (stderr)
- **echo_trap** (aString) - Define a string which when printed via echo will halt program, used to find forgotten echo
- **error** (aMessage) - Print error and any pending hints
- **help** (aQuery,oCount,oContinueExecution) - Show help to ngspicejs related question in plain sentence, e.g. help("How to change diode model")
- **read** (oPrompt) - Read string from keyboard input using readline library, displays optional prompt
- **terminal_colors** () - Return true if terminal support colors, false if not or if script output is redirected to file
- **terminal_size** () - Return object with dimensions of the terminal, e.g. {columns: 80, rows: 25, pixel_width: 640, pixel_height: 480}
- **warn** (aMessage) - Print warning

#### File functions

- **dir** (aPath) - Return array of file names and dir names in given path, dirs ends with slash
- **dir_create** (aPath) - Create directory and it's parents if needed, returns true if directory was created, 0 if it already existed
- **dir_current** () - Return path to current working directory including trailing slash
- **dir_recursive** (aPath) - Return array of filenames and dirs in given path recursively
- **file_exists** (aPath) - Return true if file exists
- **file_ext** (filename) - Return file extension (e.g. .html)
- **file_ext_replace** (filename,extension) - Replace file extension with new one
- **file_is_dir** (aFileName) - Return true if file is directory
- **file_mode** (aFileName,aMode) - Change file mode, return true on success, use e.g. parseInt('0777', 8) for mode
- **file_name** (aPath) - Return only filename without preceeding path
- **file_path** (aPath) - Return only file path, without filename
- **file_read** (aFileName) - Read file and return it's content as a string
- **file_read_binary** (aFilename) - Load file content from disk and return it as array of bytes
- **file_read_csv** (filename,as_assoc) - Read csv file and return it as 2D array (optionally as array of objects)
- **file_read_ini** (filename) - Read ini file and return it as array of section data
- **file_read_json** (aFilename) - Read json file
- **file_read_tsv** (filename) - Read tsv file and return it as 2D array
- **file_read_wav** (aFileName) - Read wav file, return sample rate, times and samples
- **file_sha1** (aFileName) - Calculate SHA1 hash of a file
- **file_size** (aPath) - Return size of a file in bytes
- **file_stat** (aFilename) - Return type of a file (file/dir/pipe/symlink)
- **file_touch** (aFilename,oAccessTime,oModificationTime) - Update access and modification time of a file
- **file_write** (aFileName,aString) - Write string to a file
- **file_write_binary** (aFilename,aArrayOfBytes) - Write binary file from array of bytes
- **file_write_csv** (filename,arr2d) - Write 2D array into csv file
- **file_write_json** (filename,data,aIndent) - Write data to a json file
- **file_write_m** (aFileName,aTimes,aValues,oComment,oDigits) - Write .m file with samples usable in audio sources
- **file_write_netlist** (aFileName) - Write current netlist as ngspice netlist to file
- **file_write_ngspicejs** (aFileName) - Write netlist to ngspicejs script
- **file_write_tsv** (filename,arr) - Write 2D array into tsv file (tab separated values)
- **file_write_wav** (aFileName,aTimes,aSamples,aScale) - Write transient analysis vector to wav file (scale should be 1 or other multiplier, if undefined wav volume will be normalized)
- **gif** (aFileName,aCanvases,aDelay) - Generate animated gif from array of sixel canvases

#### CSV functions

- **csv_decode** (text,as_assoc) - Decode CSV-encoded string and return 2D array (optionally as array of objects)
- **csv_encode** (arr,separator) - Encode 2D array into csv file format
- **csv_insert** (aCsv,aCol,aRow,aData) - Insert data to csv data (from given col/row down)
- **csv_to_array_of_objects** (aCsvTable) - Convert CSV table to array of objects using header as property name

#### Other functions

- **all_models** (oKind) - Return array af all available model names of given kind, or all models if kind is not specified
- **api** (aSomething,aName,aQuiet) - Print list of available functions or descibe object's API
- **ascii_canvas** (aWidth,aHeight) - Create ascii canvas of given size
- **available_vectors** (aUgly) - Return array of available vectors for tran/ac/fft
- **beep** (oFrequency,oDuration) - Beep with given frequency (default 440Hz) for given duration in milliseconds (default 300ms)
- **chart_scatter** (aDataX,aDataY,aValues,aWidth,aHeight,aMinX,aMaxX,aMinY,aMaxY,aTitle,aLabelX,aLabelY,aLogX,aLogY,aSize,aLevels) - Create scatter chart
- **chart_xy** (aWidth,aHeight,aMinX,aMaxX,aMinY,aMaxY,aTitle,aLabelX,aLabelY,aLogX,aLogY,aSeries,aBorder) - Create XY chart
- **complex** (aReal,aImaginary) - Return new complex number
- **config_path** () - Return full path including trailing slash to the user's config directory ~/.config/ngspicejs/
- **ctrl_c_pressed** () - Sets up Ctrl+C handler and if Ctrl+C was pressed, returns true
- **ctrl_c_reset** () - Reset the indicator that ctrl+c was pressed, this allows you to use ctrl+c multiple times or exit on second ctrl+c
- **delay_ms** (aMilliseconds) - Wait given amount of milliseconds
- **eng** (aNumberOrString,aArgumentIndex,aFunctionName,aCustomMessage,aAttrDef) - Convert "4k7" to 4700 or throw new Exception(...)
- **env** (aVariableName) - Return content of environment variable, e.g. HOME
- **exit** (aCode) - Stop script execution with given exit code
- **hash** (str) - DJB2 string hash function, reduces string to uint32 number
- **hint** (aMessage) - Add message to the hint buffer, will be printed right after the next error
- **ignore** (...) - Do nothing with the arguments, used to suppress linter warning
- **include** (aFileName) - Include external JS file and return only exports
- **least_squares** (x,y) - Use least squares to find slope and y-offset of x-y data
- **lerp** (aValues,aValues2) - Return lerp from values
- **levenshtein** (aWord1,aWord2) - Return Damerau-Levenshtein distance between strings
- **linearize** (aTimes,aValues,aSampleRate,aCustomWarning) - Linearize vector (times,values) at given sample rate, e.g. 44100
- **mersenne_twister** (aSeed) - Return mersenne twister PRNG with given seed
- **netlist_clear** () - Clear netlist
- **netlist_export** () - Convert current netlist to exportable object
- **netlist_export_schematic** (aOmmitNames) - Convert current netlist to object importable by stripboard2schematic
- **netlist_export_schematic_url** (aOmmitNames) - Format netlist as url that can be opened in stripboard2schematic
- **netlist_nets** (aNetlistDevices) - Return all nets (preserves numbered nets as numbers)
- **netlist_to_script** (aComment) - convert current netlist to ngspicejs script
- **ngspice_clear_log** () - Clear ngspice stdout and stderr log to prevent slowdown (done automatically in ngspice_log())
- **ngspice_command_verbose** (aVerbose) - If argument is true, every ngspice command will be printed on screen
- **ngspice_version** () - Return version number of ngspice library
- **ngspicejs_version** (oMin,oMax) - Return ngspicejs version, throw exception if current version is outside allowed range of versions
- **random_float** (aMin,aMax) - Generate random integer from min to max (included), e.g. from 3 to 5 will return 3,4 or 5
- **random_int** (aMin,aMax) - Generate random integer from min to max (included), e.g. from 3 to 5 will return 3,4 or 5
- **read_char** (oPrompt) - Read single char from keyboard input without waiting for ENTER key, displays optional prompt
- **round_down** (aValue,aDigits) - Round down to specified number of digits
- **round_to** (aValue,aDigits) - Round to specified number of digits
- **round_up** (aValue,aDigits) - Round up to specified number of digits
- **script_args** () - Return array of strings containing arguments of the script, first argument is path to ngspicejs shell, second argument is ngspicejs script filename, the rest are any extra arguments
- **script_ms** () - Return milliseconds since script started
- **script_self** () - Return path to this script, e.g. script_args()[1]
- **script_shell** () - Return path to the shell that ran this script, e.g. script_args()[0]
- **script_shell_full** () - Return full path to shell that executed the script (usually /home/$USER/ngspicejs/ngspicejs) or undefined
- **search** (aDocuments,aQuestion,oInvertedIndex) - Search documents using inverted index
- **series_e12** (aMin,aMax,oEng) - Return E12 series of preferred values from aMin to aMax
- **series_e24** (aMin,aMax,oEng) - Return E24 series of preferred values from aMin to aMax
- **series_e3** (aMin,aMax,oEng) - Return E3 series of preferred values from aMin to aMax
- **series_e48** (aMin,aMax,oEng) - Return E48 series of preferred values from aMin to aMax
- **series_e6** (aMin,aMax,oEng) - Return E6 series of preferred values from aMin to aMax
- **series_e96** (aMin,aMax,oEng) - Return E96 series of preferred values from aMin to aMax
- **similar_strings** (aText,aArray,aMaxDistance,aReturnStringsOnly) - Find similar strings from array of candidates
- **singular_matrix** () - Return true if netlist forms singular matrix (e.g. caps has no path to ground)
- **sixel_canvas** (aWidth,aHeight) - Create sixel canvas of given size
- **tally** (oName) - Create tally
- **temperature** (aDegreesC) - Set simulation temperature, return current temperature
- **topology_edges** (aElements) - Return all pairs of connected nets as {net1:{net2:true,net3:true},net2:...}
- **topology_path_exists** (aEdges,aFromNet,aToNet,oStopNets) - Return true if direct path exists from one net to another
- **tran_ok** (aStep,aInterval,aStart) - Performant way to check if tran will fail on "timestep too small" error, returns true if it will pass
- **ugly_vector_name** (aVector,aHideWarning) - Convert "I(MIC1.LS)" to "l.x_dynamic_mic__mic1.l_ls#branch"
- **v8_version** () - Return version string of V8 library

#### Constructors

- **ChartXy** (aWidth,aHeight,aMinX,aMaxX,aMinY,aMaxY,aTitle,aLabelX,aLabelY,aLogX,aLogY,aSeries,aBorder) - Constructor
- **Exception** (aMessage) - Use throw new Exception(message) for deeper and better stack trace

#### Objects

- **Internal** - Object with all internal functions, not to be used by end user
- **distinct_colors** - Palette of dinstinct colors used by sixel canvas
- **font_neo_sans** - Font used by sixel canvas
- **netlist_devices** - Array of devices in netlist
