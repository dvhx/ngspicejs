// Set netlist from single EOL-separated string

bool simple_ngspice_netlist(SimpleNgspiceContext *ctx, char *s) {
    // Set netlist from single EOL-separated string
    ctx->fx = (char*)"simple_ngspice_netlist";

    // convert EOL-separated string to array of string
    Ars *p = ars_from_cstr(s);
    ars_split_char(p, '\n');

    // replace empty strings with "*" because ngspice considers empty string to be end of netlist and would ignore everything afterwards
    for (size_t i = 0; i < ars_count(p); i++) {
        if (ars_nth_len(p, i) == 0) {
            ars_set(p, i, (char*)"*");
        }
    }
    // add empty string to the end
    ars_add(p, (char*)"");

    size_t c;
    char **a = ars_array(p, &c);
    ars_free(p);

    // spice
    if (ctx->has_circuit) {
        ngSpice_Command((char*)"remcirc");
        ctx->has_circuit = false;
    }
    int e = ngSpice_Circ(a);
    ctx->has_circuit = true;
    ars_array_free(a, c);
    if (e != 0) {
        // warning: netlist compilation failed with code #, detailed errors will be printed now:
        // this should be very low confidence error
        char *s = string_format("stderr error: cannot compile netlist, ngSpice_Circ() returned #%d", e);
        ars_add(ctx->log, s);
        free(s);
        return false;
    }
    return true;
}
