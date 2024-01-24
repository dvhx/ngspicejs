// Quit ngspice

bool simple_ngspice_quit(SimpleNgspiceContext *ctx) {
    // Quit ngspice
    int e;
    e = ngSpice_Command((char*)"destroy all");
    if (e != 0) {
        fprintf(stderr, "error: cannot quit ngspice, 'destroy all' error code #%d\n", e);
        exit(1);
    }
    e = ngSpice_Command((char*)"quit");
    return true;
}
