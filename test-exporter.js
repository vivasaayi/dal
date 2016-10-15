"use strict";

const Exporter = require("./src/exporter");

const exporter = new Exporter({
  databaseName: "test",
  path: __dirname + "/data"
});

exporter.export(["SONGS", "LYRICS", "PREDEFINEDLIST", "PREDEFINEDLISTITEMS", "VIDEOS"])
  .then(() => {
    console.log("Completed");
    process.exit(0);
  })
  .fail(err => {
    console.log("Export Failed.");
    console.dir(err);
    process.exit(0);
  });