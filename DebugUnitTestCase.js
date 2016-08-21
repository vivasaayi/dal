var path = require('path');
//var MongoClient = require('mongodb').MongoClient;

console.log("Hello");


var jasmineCli = require(path.join(__dirname, './node_modules/jasmine-node/lib/jasmine-node'));

var options = {
    specFolders: [],
    projectRoot: '', 
    forceExit: true,
    match: '.',
    matchall: false,
    extensions: 'js',
    specNameMatcher: 'unitspec',
    jUnit: {
        report: true,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
    }
};

jasmineCli.executeSpecsInFolder(options);

console.log("Hello");


console.log("Hello");
console.log("Hello");