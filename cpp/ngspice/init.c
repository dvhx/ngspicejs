// Simpler initialization of ngspice, single threaded, bunch of global variables

typedef struct SimpleNgspiceContext {
    bool running;
    //bool error;
    //char *error_message;
    char *fx; // Function (where error happened)
    Ars *log;
    bool verbose_init;
    bool verbose_getchar;
    bool verbose_getstat;
    bool verbose_thread_runs;
    bool verbose_data;
    //std::vector<std::string> log;
} SimpleNgspiceContext;

int simple_ngspice_init_getchar(char *s, int ident, void *userdata) {
    // ngspice callback - get data printed by ngspice
    SimpleNgspiceContext *ctx = (SimpleNgspiceContext*)userdata;
    if (ctx->verbose_getchar) {
        fprintf(stderr, "simple_ngspice_init_getchar: %s\n", s);
    }
    ars_add(ctx->log, s);
    return 0;
}

int simple_ngspice_init_getstat(char *s, int ident, void *userdata) {
    // ngspice callback - get simulation status
    SimpleNgspiceContext *ctx = (SimpleNgspiceContext*)userdata;
    if (ctx->verbose_getstat) {
        fprintf(stderr, "simple_ngspice_init_getstat: %s\n", s);
    }
    return 0;
}

int simple_ngspice_init_exit(int exitstatus, bool immediate, bool quitexit, int ident, void *userdata) {
    // ngspice callback - detect ngspice exit
    if (exitstatus != 0) {
        fprintf(stderr, "%sngspice failed with exit code %d, ngjs is unable to give meaningful error message!\n", color_prefix_error_stderr, exitstatus);
        return exitstatus;
    }
    if (quitexit) {
        //printf("DNote: Returned from quit with exit status %d\n", exitstatus);
    }
    if (immediate) {
        ngSpice_Command((char*)"quit");
        // ((int * (*)(char*)) ngSpice_Command_handle)("quit");
        // dlclose(ngdllhandle);
    }
    return exitstatus;
}

int simple_ngspice_init_data(pvecinfoall intdata, int ident, void *userdata) {
    // ngspice callback - when data is initialized
    SimpleNgspiceContext *ctx = (SimpleNgspiceContext*)userdata;
    if (ctx->verbose_data) {
        printf("simple_ngspice_init_data: ...\n");
    }
    return 0;
}

int simple_ngspice_init_thread_runs(bool noruns, int ident, void *userdata) {
    // ngspice callback - when starting (returns true) or leaving (returns false) the bg thread
    SimpleNgspiceContext *ctx = (SimpleNgspiceContext*)userdata;
    if (ctx->verbose_thread_runs) {
        printf("simple_ngspice_init_thread_runs: %d\n", noruns);
    }
    if (userdata) {
        SimpleNgspiceContext *ctx = (SimpleNgspiceContext*)userdata;
        ctx->running = !noruns;
    }
    return 0;
}

SimpleNgspiceContext* simple_ngspice_init() {
    // Initialize ngspice
    SimpleNgspiceContext *ctx = (SimpleNgspiceContext*)malloc(sizeof(SimpleNgspiceContext));
    ctx->running = false;
    //ctx->error = false;
    ctx->fx = (char*)"simple_ngspice_init";
    ctx->log = ars();
    ctx->verbose_init = false;
    ctx->verbose_getchar = false;
    ctx->verbose_getstat = false;
    ctx->verbose_thread_runs = false;
    ctx->verbose_data = false;
    int i = ngSpice_Init(
        simple_ngspice_init_getchar,
        simple_ngspice_init_getstat,
        simple_ngspice_init_exit,
        NULL,
        simple_ngspice_init_data,
        simple_ngspice_init_thread_runs,
        ctx
    );
    if (ctx->verbose_init) {
        fprintf(stderr, "simple_ngspice_init() i=%d\n", i);
    }
    return ctx;
}
