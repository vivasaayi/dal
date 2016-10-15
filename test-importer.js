"use strict";

const Importer = require("./src/importer");

const importer = new Importer({
  databaseName: "test",
  path: __dirname + "/data-1"
});

importer.import(["SONGS", "LYRICS", "PREDEFINEDLIST", "PREDEFINEDLISTITEMS", "VIDEOS"])
  .then(() => {
    console.log("Completed");
    process.exit(0);
  })
  .fail(err => {
    console.log("Import Failed.");
    console.dir(err);
    process.exit(0);
  });