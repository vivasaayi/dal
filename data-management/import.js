"use strict";

const fs = require("fs");
const path = require("path");

const MongoConfig = require("../mongo-config");
const MongoWrapper = require("../index");
const _ = require("underscore");
const Q = require("q");

const importConfig = require("./db-configs/icl-restore.json");

const mongoConfig = new MongoConfig(importConfig.dbConfig);
const mongoWrapper = MongoWrapper.getInstance(mongoConfig);

class Importer {
  import() {
    const promises = [];

    _.each(importConfig.collections, collection => {
      promises.push(this.importCollection(collection));
    });

    return Q.all(promises);
  }

  importCollection(collection) {
    return this.getFiles(collection)
      .then(files => {
        return this.insertDocuments(files, collection);
      });
  }

  insertDocuments(files, collection) {
    const promises = [];

    _.each(files, file => {
      promises.push(Q.nfcall(mongoWrapper.insertDocument.bind(mongoWrapper), collection, file.data));
    });

    return Q.all(promises);
  }

  getFiles(collectionName) {
    return Q.nfcall(fs.readdir, this.getBasePath(collectionName))
      .then(files => {
        const promises = [];

        _.each(files, file => {
          promises.push(this.readFile(file, collectionName));
        });

        return Q.all(promises);
      });
  }

  readFile(file, collectionName) {
    return Q.nfcall(fs.readFile, this.getPath(file, collectionName))
      .then(data => {
        return {
          fileName: file,
          data: JSON.parse(data)
        }
      });
  }

  getPath(file, collectionName) {
    const basePath = this.getBasePath(collectionName);
    return path.join(basePath, file);
  }

  getBasePath(collectionName) {
    return path.join(importConfig.path || __dirname, collectionName);
  }
}

const importer = new Importer();
importer.import()
  .then(() => {
    console.log("Import Completed Successfully");
  })
  .fail(err => {
    console.log("Error occured during export");
    console.log(err + "\n" + err.stack);
  })
  .done();

