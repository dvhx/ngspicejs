// Module with 3 animals and 1 common but private (non-exported) method
// linter: ngspicejs-lint
"use strict";

var some_private_variable = 123;
var some_exported_variable = 456;

function generic_animal(aSound) {
    // Some helper method
    echo(aSound);
}

function my_rabbit() {
    // Rabbit will throw exception
    throw new Exception('Rabbit is not implemented yet and should throw exception');
}

function my_dog() {
    // Dog function, will not be visible as "my_dog()" but will be exported as "dog()"
    generic_animal("Wuf wuf");
}

function my_cat() {
    // Cat
    generic_animal("Miau");
}

// Only this will be visible
globalThis.exports = {
    dog: my_dog,
    cat: my_cat,
    rabbit: my_rabbit,
    some_exported_variable: some_exported_variable
};

ignore(some_private_variable);

