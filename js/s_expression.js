// Convert s-expression to json
// linter: ngspicejs-lint --internal
"use strict";

function s_expression(aText) {
  // Convert s-expression to json
  // tokenize
  const tokens = aText
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    .trim()
    .split(/\s+/);
  let pos = 0;
  // recursive descent parser
  function parse() {
    let token = tokens[pos++];
    if (token === "(") {
      const list = [];
      while (tokens[pos] !== ")") {
        list.push(parse());
      }
      pos++; // Consume the closing ')'
      return list;
    } else {
      if (token.startsWith('"') && token.endsWith('"')) {
        token = token.substr(1, token.length - 2);
      }
      return token;
    }
  }
  return parse();
}

globalThis.exports = {s_expression};
globalThis.s_expression = s_expression;
