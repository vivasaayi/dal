"use strict";

const fs = require("fs");
const path = require("path");
const Q = require("q");
const _ = require("underscore");
const importConfig = require("./db-configs/icl-restore.json");

const MongoConfig = require("../src/mongo-config");
const MongoWrapper = require("../index").MongoWrapper;
const mongoConfig = new MongoConfig(importConfig.dbConfig);
const mongoWrapper = new MongoWrapper(mongoConfig);
const ObjectId = require("mongodb").ObjectID;

class Migrator {
  migrate() {
    return this.getFiles("lyrics")
      .then(files => {
        return this.migrateDocuments(files);
      });
  }

  migrateDocuments(files) {
    const promises = [];

    _.each(files, file => {
      promises.push(this.migrateDocument(file.data));
    });

    return promises;
  }

  migrateDocument(lyric) {
    const newDocs = [];

    const lyricEntry = {
      _id: new ObjectId(lyric._id),
      SONGTITLETAMIL: lyric.title.text,
      SONGTITLEENGLISH: lyric.title.englishText
    };

    lyric.content.forEach((stanza, index) => {
      newDocs.push({
        TAMILTEXT: stanza.text,
        ENGLISHTEXT: stanza.englishText,
        KEY: "",
        ORDER: index,
        _parent: lyric._id
      });
    });

    const promises = [];

    promises.push(Q.nfcall(mongoWrapper.insertDocument.bind(mongoWrapper), "LYRICS", lyricEntry));

    _.each(newDocs, newDoc => {
      promises.push(Q.nfcall(mongoWrapper.insertDocument.bind(mongoWrapper), "LYRICSSTANZAS", newDoc));
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

const migrator = new Migrator();
migrator.migrate()
  .then(() => {
    console.log("Migration Completed");
  })
  .fail(err => {
    console.log(err);
    console.log(err + "\n" + err.stack);
    console.log("Migratin failed")
  });