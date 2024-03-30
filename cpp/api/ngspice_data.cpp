// Get ngspice data

void js_ngspice_data(const v8::FunctionCallbackInfo < v8::Value > &args) {
    // We will be creating temporary handles so we use a handle scope.
    assert_arguments_length(args, 0, 0, (char*)"ngspice_data()");

    v8::Isolate *iso = args.GetIsolate();
    v8::HandleScope handle_scope(iso);

    if (!simple_ngspice_context) {
        fatal_msg_stack(globalIsolate, EXIT_WRONG_ORDER, "ngspice_data() was called before ngspice_init()");
        exit(EXIT_UNREACHABLE);
    }

    // returning object
    v8::Handle<v8::Object> o = v8::Object::New(iso);

    // collect all plots
    char **allplots = ngSpice_AllPlots();
    int p = 0;
    char *cmd = (char*)malloc(1000 * sizeof(char));
    while (allplots[p] != NULL) {
        //printf("allplots[%d] = %s\n", p, allplots[p]);

        // new object for this plot
        v8::Handle<v8::Object> plotobj = v8::Object::New(iso);
        o->Set(v8::String::NewFromUtf8(iso, allplots[p]), plotobj);

        // setplot is needed before ngSpice_AllVecs() otherwise older plot data will be missing
        // see https://sourceforge.net/p/ngspice/discussion/127605/thread/34af7de8b6/
        //printf("ngspice_data C %s\n", allplots[p]);
        sprintf(cmd, "setplot %s", allplots[p]);
        //printf("ngspice_data D\n");
        //printf("CMD=%s\n", cmd);
        //printf("ngspice_data E\n");
        ngSpice_Command(cmd);
        //printf("ngspice_data F\n");

        // process all vectors
        char **vecarray = ngSpice_AllVecs(allplots[p]); // curplot
        if (vecarray) {
            //printf("ngspice_data G\n");
            //printf("ok1\n");
            //printf("vecarray[0] = %p\n", (void*)vecarray[0]);
            //printf("vecarray[0] = %s\n", vecarray[0]);
            int v = 0;
            while (vecarray[v]) {
                //printf("vecarray[%d] = %s\n", , vecarray[i]);
                //printf("ngGet_Vec_Info(%s):\n", vecarray[v]);

                // get vector info
                //printf("get vec info1\n");
                pvector_info myvec = ngGet_Vec_Info(vecarray[v]);
                //printf("get vec info2\n");

                // print vec info name (in case there is a formula)
                //printf("v_name=%s v_type=%d\n", myvec->v_name, myvec->v_type);

                // print real data
                int veclength = myvec->v_length;
                //printf("A\n");
                //printf("veclength = %d\n", veclength);
                //printf("myvec->v_realdata[0] = %f\n", myvec->v_compdata[0].cx_real);
                //printf("myvec->v_realdata[0] = %f\n", myvec->v_compdata[0].cx_imag);

                // v8 array for values
                v8::Handle<v8::Array> a = v8::Array::New(iso, veclength);

                // add v8 array to returning object
                plotobj->Set(v8::String::NewFromUtf8(iso, vecarray[v]), a);
                //("X vl=%d\n", veclength);
                //printf("X v_realdata=%p\n", myvec->v_realdata);
                //printf("X v_compdata=%p\n", myvec->v_compdata);

                // real data
                bool got_data = false;
                if (myvec->v_realdata) {
                    got_data = true;
                    for (int i = 0; i < veclength; i++) {
                        //printf("%.4g,", myvec->v_realdata[i]);
                        //printf("i=%d\n", i);
                        //printf("  %ld\n", (size_t)myvec->v_realdata[i]);
                        //printf("R %d = %f\n", i, myvec->v_realdata[i]);
                        a->Set(i, v8::Number::New(iso, myvec->v_realdata[i]));
                    }
                }
                // complex data
                if (myvec->v_compdata) {
                    got_data = true;
                    for (int i = 0; i < veclength; i++) {
                        //printf("%.4g,", myvec->v_realdata[i]);
                        //printf("i=%d\n", i);
                        //printf("R %d = %f\n", i, myvec->v_compdata[i].cx_real);
                        //printf("I %d = %f\n", i, myvec->v_compdata[i].cx_imag);

                        // v8 array for [real,imag]
                        v8::Handle<v8::Array> ri = v8::Array::New(iso, 2);
                        ri->Set(0, v8::Number::New(iso, myvec->v_compdata[i].cx_real));
                        ri->Set(1, v8::Number::New(iso, myvec->v_compdata[i].cx_imag));
                        a->Set(i, ri);
                    }
                }

                if (!got_data) {
                    fatal_msg_stack(globalIsolate, EXIT_NGSPICE, "Could not extract real or complex ngspice data");
                    exit(EXIT_UNREACHABLE);
                }

                // next vector
                v++;
            }
        } else {
            printf("*** begin of last netlist ***\n");
            printf("%s\n", last_netlist);
            printf("*** end of last netlist ***\n");
            fatal_msg_stack(globalIsolate, EXIT_NGSPICE, "Simulation did not produce any vector data");
            exit(EXIT_UNREACHABLE);
        }

        // next plot
        p++;
    }

    free(cmd);

    // return
    args.GetReturnValue().Set(o);
}
