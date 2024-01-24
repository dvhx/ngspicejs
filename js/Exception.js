// This fixes missing stack traces in js-thrown string exceptions
// linter: ngspicejs-lint --internal
"use strict";

/*
If you use:

    throw "Some error";

the stack trace will be empty or shallow (just 1 frame). However if you wrap the
string in Exception() like this:

    throw new Exception("Some message");

the stack trace will be deeper and have correct file names, function names and
line numbers. You could use:

     throw new Error('Some message');

But then the stack would point to the throw line, not where the error occured
and it does not support all-in-one core.js file properly and few other edge cases.

- If you use Exception() you can use --zero-stack during unit tests and all
line/column numbers will be zero making unit tests less fragile.

- Exception() will show function name in each frame, Error() will not.

- You can use Exception.fast = true; to temporarily disable saving stack trace
  which can make parts of the code run faster.

- Error() is standard part of JS, Exception() is ngspicejs specific thing.
*/

function Exception(aMessage) {
    // Use throw new Exception(message) for deeper and better stack trace
    Exception.counter = Exception.counter || 0;
    Exception.counter++;
    if (!this) {
        error("When you are throwing Exception use 'new' keyword: throw new Exception('Some error');");
        if (!Exception.fast) {
            Internal.buffered_stack_trace(aMessage || "Error");
        }
        exit(15); // EXIT_MISSING_NEW
        return;
    }
    this.message = aMessage;
    if (!Exception.fast) {
        Internal.buffered_stack_trace(aMessage || "Error");
    }
}

Exception.fast = false; // true will not produce deep stack traces

Exception.prototype.toString = function () {
    // Convert exception to string
    return this.message;
};

globalThis.exports = {Exception};
globalThis.Exception = Exception;
