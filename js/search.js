// Ranked document retrieval using inverted index, used in help function
// linter: ngspicejs-lint --internal
"use strict";

/*
var documents = [
    {q: "What is your name?", a: "My name is John"},
    {q: "What is your favorite food?", a: "I like apples"},
    {q: "What is your favorite color?", a: "I like blue color"},
    {q: "What time is it?", a: "I don't know"}
];

var s = search(documents, 'so what color do you like?');
echo(s.candidates[0].doc.a);

// second search will be faster by reusing index from first search
s = search(documents, 'and what food you like?', s.index);
echo(s.candidates[0].doc.a);
*/

function tokenize(aSentence) {
    // Split sentence to array of words
    return (aSentence.match(/\b(\w+)\b/g) || []).map((w) => w.toLowerCase());
}

function inverted_index(aDocuments) {
    // Create inverted index for documents
    // Documents are in this format: [{q: "first question", a: "first answer"}, {q: "second question", a: "second answer"}, ...]
    var idx = {};
    aDocuments.forEach((d, i) => {
        tokenize(d.q).forEach((w) => {
            idx[w] = idx[w] || [];
            idx[w].push(i);
        });
    });
    return idx;
}

function search(aDocuments, aQuestion, oInvertedIndex) {
    // Search documents using inverted index
    assert_arguments_length(arguments, 1, 3, 'search(documents,question,<inverted_index>)');
    var candidate = {};
    oInvertedIndex = oInvertedIndex || inverted_index(aDocuments);
    tokenize(aQuestion).forEach((w) => {
        var doc = oInvertedIndex[w];
        if (!doc) {
            return;
        }
        doc.forEach((d) => {
            candidate[d] = candidate[d] || 0;
            candidate[d] += 1 / doc.length;
        });
    });
    // return candidates sorted descending by score
    var arr = [];
    for (const [i,score] of Object.entries(candidate)) {
        arr.push({score, doc: aDocuments[i]});
    }
    return {
        index: oInvertedIndex,
        candidates: arr.sort((a,b) => b.score - a.score)
    };
}

globalThis.exports = {search};
globalThis.search = search;
