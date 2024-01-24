// Get ngspice vector names (like ngspice_data but return only vector names)

void js_ngspice_vectors(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // Get ngspice vector names (like ngspice_data but return only vector names)
    assert_arguments_length(args, 0, 0, (char*)"ngspice_vectors()");
    if (!simple_ngspice_context) {
        fatal_msg_stack(globalIsolate, EXIT_WRONG_ORDER, "ngspice_vectors() was called before ngspice_init()");
        exit(EXIT_UNREACHABLE);
    }

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    // collect all plots
    char **allplots = ngSpice_AllPlots();

    // we only need tran1 or ac1 to get all vectors (no const or sp1 or whatever other plots)
    char *cmd = (char*)malloc(1000 * sizeof(char));
    int p = 0;
    while (allplots[p] != NULL) {
        // setplot is needed before ngSpice_AllVecs() otherwise older plot data will be missing
        // see https://sourceforge.net/p/ngspice/discussion/127605/thread/34af7de8b6/
        if (strcmp(allplots[p], "tran1") == 0 || strcmp(allplots[p], "ac1") == 0) {
            sprintf(cmd, "setplot %s", allplots[p]);
            ngSpice_Command(cmd);
            break;
        }
        p++;
    }

    // get all vectors
    char **vecarray = ngSpice_AllVecs(allplots[p]);
    if (!vecarray) {
        fatal_msg_stack(globalIsolate, EXIT_NGSPICE, "ngspice_vectors() vectors not found");
        exit(EXIT_UNREACHABLE);
    }

    // count vectors
    int count = 0;
    while (vecarray[count]) {
        count++;
    }

    // add vector names to returning array
    v8::Handle<v8::Array> ret = v8::Array::New(iso, 2);
    int v = 0;
    while (vecarray[v]) {
        // get vector info
        pvector_info myvec = ngGet_Vec_Info(vecarray[v]);
        // print vec info name (in case there is a formula)
        //printf("v_name=%s v_type=%d\n", myvec->v_name, myvec->v_type);
        ret->Set(v, v8::String::NewFromUtf8(iso, myvec->v_name));
        v++;
    }

    // free
    free(cmd);

    // return
    args.GetReturnValue().Set(ret);
}
