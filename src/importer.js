"use strict";

const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const Q = require("q");

const MongoConfig = require("./mongo-config");
const MongoWrapper = require("./mongo-wrapper");

class Importer {
  constructor(config) {
    this.config = config;
    const mongoConfig = new MongoConfig(this.config);
    MongoWrapper.useConfig(mongoConfig);
  }

  import(collections) {
    const promises = [];

    _.each(collections, collection => {
      promises.push(this.importCollection(collection));
    });

    return Q.all(promises);
  }

  importCollection(collection) {
    console.log("Importing Collection: " + collection);

    return MongoWrapper.dropCollection(collection)
      .then(() => {
        console.log("Collection Dropped:" + collection);
        return this.getFiles(collection)
      })
      .then(files => {
        console.log("Files Read. (" + files.length + "). Importing." + collection);
        return MongoWrapper.insertMultipleDocuments(collection, files);
      });
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

  readFile(basePath, collectionName) {
    const filePath = this.getPath(basePath, collectionName);
    console.log(filePath);

    return Q.nfcall(fs.readFile, filePath)
      .then(data => {
        return JSON.parse(data)
      });
  }

  getPath(file, collectionName) {
    const basePath = this.getBasePath(collectionName);
    return path.join(basePath, file);
  }

  getBasePath(collectionName) {
    return path.join(this.config.path || __dirname, collectionName);
  }
}

module.exports = Importer;