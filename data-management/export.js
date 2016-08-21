"use strict";

const fsPath = require("fs-path");
const path = require("path");

const MongoConfig = require("../mongo-config");
const MongoWrapper = require("../index");
const _ = require("underscore");
const Q = require("q");

const exportConfig = require("./db-configs/icl.json");

const mongoConfig = new MongoConfig(exportConfig.dbConfig);
const mongoWrapper = MongoWrapper.getInstance(mongoConfig);

class Exporter {
  export(collections) {
    const promises = [];

    _.each(collections, collection => {
      promises.push(this.exportCollection(collection));
    });

    return Q.all(promises);
  }

  exportCollection(collection) {
    return Q.nfcall(mongoWrapper.getAllFromCollection.bind(mongoWrapper), collection)
      .then(docs => {
        return this.writeCollection(docs, collection);
      })
  }

  writeCollection(docs, collectionName) {
    const promises = [];
    _.each(docs, doc => {
      promises.push(this.writeDocument(doc, collectionName));
    });

    return Q.all(promises);
  }

  writeDocument(doc, collectionName) {
    return Q.nfcall(fsPath.writeFile, this.getPath(doc, collectionName), JSON.stringify(doc, null, 2));
  }

  getPath(doc, collectionName) {
    const basePath = this.getBasePath(doc, collectionName);
    return path.join(basePath, collectionName, doc._id.toString());
  }

  getBasePath(doc, collectionName) {
    return exportConfig.path || __dirname;
  }
}

const exporter = new Exporter();
exporter.export(exportConfig.collections)
  .then(() => {
    console.log("Export Completed Successfully");
  })
  .fail(err => {
    console.log("Error occured during export");
    console.log(err + "\n" + err.stack);
  })
  .done();

