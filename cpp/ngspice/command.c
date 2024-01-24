// Execute ngspice command

bool simple_ngspice_command(SimpleNgspiceContext *ctx, char *cmd) {
    // Execute ngspice command
    ctx->fx = (char*)"simple_ngspice_command";
    // spice
    int e = ngSpice_Command(cmd);
    if (e != 0) {
        // this should be very low confidence error
        char *s = string_format("stderr error: ngSpice_Command(%s) returned #%d", cmd, e);
        ars_add(ctx->log, s); // delaying pre-error
        free(s);
        return false;
    }
    return true;
}

