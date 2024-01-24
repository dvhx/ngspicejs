// Process all data after simulation

void simple_ngspice_data(SimpleNgspiceContext *ctx) {
    // Process all data after simulation

    // read current plot while simulation continues (tran1, ac1, tran2)
    char *curplot = ngSpice_CurPlot();
    printf("\nCurrent plot is %s\n\n", curplot);

    // process all vectors
    char **vecarray = ngSpice_AllVecs(curplot);
    if (vecarray) {
        int v = 0;
        while (vecarray[v]) {
            //printf("vecarray[%d] = %s\n", i, vecarray[i]);
            printf("DATA %s,", vecarray[v]);
            // get vector info
            pvector_info myvec = ngGet_Vec_Info(vecarray[v]);
            // print vec info name (in case there is a formula)
            //printf("%s,", myvec->v_name);
            // print real data
            int veclength = myvec->v_length;
            for (int i = 0; i < veclength; i++) {
                printf("%.4g,", myvec->v_realdata[i]);
            }
            printf("\n");
            v++;
        }
    }
};
