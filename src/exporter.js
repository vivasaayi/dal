"use strict";

const fsPath = require("fs-path");
const path = require("path");
const _ = require("underscore");
const Q = require("q");

const MongoConfig = require("./mongo-config");
const MongoWrapper = require("./mongo-wrapper");

class Exporter {
  constructor(config) {
    this.config = config;
    const mongoConfig = new MongoConfig(this.config);
    MongoWrapper.useConfig(mongoConfig);
  }

  export(collections) {
    const promises = [];

    _.each(collections, collection => {
      promises.push(this.exportCollection(collection));
    });

    return Q.all(promises);
  }

  exportCollection(collection) {
    return MongoWrapper.customQuery(collection, { query: {} })
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
    const fileName = this.getPath(doc, collectionName);
    console.log(fileName);
    return Q.nfcall(fsPath.writeFile, fileName, JSON.stringify(doc, null, 2));
  }

  getPath(doc, collectionName) {
    const basePath = this.getBasePath(doc, collectionName);
    return path.join(basePath, collectionName, doc._id.toString()) + ".json";
  }

  getBasePath(doc, collectionName) {
    return this.config.path || __dirname;
  }
}

module.exports = Exporter;
