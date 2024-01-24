// Simple ngspice api

typedef struct SimpleNgspiceContext SimpleNgspiceContext;

bool simple_ngspice_command(SimpleNgspiceContext *ctx, char *cmd);
void simple_ngspice_data(SimpleNgspiceContext *ctx);
int simple_ngspice_init_getchar(char *s, int ident, void *userdata);
int simple_ngspice_init_getstat(char *s, int ident, void *userdata);
int simple_ngspice_init_exit(int exitstatus, bool immediate, bool quitexit, int ident, void *userdata);
int simple_ngspice_init_data(pvecinfoall intdata, int ident, void *userdata);
int simple_ngspice_init_thread_runs(bool noruns, int ident, void *userdata);
SimpleNgspiceContext* simple_ngspice_init();
bool simple_ngspice_netlist(SimpleNgspiceContext *ctx, char *s);
bool simple_ngspice_quit(SimpleNgspiceContext *ctx);
