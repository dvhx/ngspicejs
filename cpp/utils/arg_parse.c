// Parse command line arguments

void arg_parse(int argc, char* argv[]) {
    // Parse command line arguments
    arg_count = argc;
    arg_items = argv;

    // find executable directory
    pid_t pid = getpid();
    char *s1 = (char*)malloc(sizeof(char) * MAXPATHLEN);
    sprintf(s1, "/proc/%d/exe", pid);
    exe_path = (char*)malloc(sizeof(char) * MAXPATHLEN);
    if (!readlink(s1, exe_path, MAXPATHLEN - 1)) {
        fatal_msg(EXIT_SYSTEM, "cannot find full path to ngspicejs executable (needed to find js source directory)");
        exit(EXIT_UNREACHABLE);
    }
    free(s1);
    //printf("exe_path=%s\n", exe_path);

    // find js source directory
    Ars *a = ars();
    ars_add(a, exe_path);
    ars_split_char(a, '/');
    ars_delete(a, ars_count(a) - 1);
    ars_add(a, (char*)"js");
    ars_join(a, (char*)"/");
    js_src_dir_full = ars_nth_dup(a, 0);
    ars_free(a);
    //printf("js_src_dir_full=%s\n", js_src_dir_full);
    if (!system_file_exists(js_src_dir_full)) {
        fatal_msg(EXIT_SYSTEM, "cannot find JS source directory in %s, edit js_src_dir in globals.h", js_src_dir_full);
        exit(EXIT_UNREACHABLE);
    }

    for (int i = 0; i < argc; i++) {
        //printf("arg[%d] = %s\n", i, argv[i]);
        if (strcmp(argv[i], "--eval-before-init") == 0) {
            arg_eval_before_init = argv[i + 1];
            i++;
            continue;
        }
        if (strcmp(argv[i], "--eval-before-script") == 0) {
            arg_eval_before_script = argv[i + 1];
            i++;
            continue;
        }
        if (strcmp(argv[i], "--eval-after-script") == 0) {
            arg_eval_after_script = argv[i + 1];
            i++;
            continue;
        }
        if (strcmp(argv[i], "--no-linting") == 0) {
            exit(0);
            continue;
        }
        if (strcmp(argv[i], "--zero-stack") == 0) {
            arg_zero_stack = true;
            continue;
        }
        if (strcmp(argv[i], "--internal") == 0) {
            arg_internal = true;
            continue;
        }
        if (strcmp(argv[i], "--quiet") == 0) {
            arg_quiet = true;
            continue;
        }
        if (!arg_first) {
            arg_first = argv[i];
            continue;
        }
        if (!arg_second) {
            arg_second = argv[i];
            arg_second_index = i;
            continue;
        }
    }
    /*
    printf("arg_eval_before_init = %s\n", arg_eval_before_init);
    printf("arg_eval_before_script = %s\n", arg_eval_before_script);
    printf("arg_eval_after_script = %s\n", arg_eval_after_script);
    printf("arg_first = %s\n", arg_first);
    printf("arg_second = %s\n", arg_second);
    */
}

