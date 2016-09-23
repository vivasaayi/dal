"use strict";

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const Promise = require("bluebird");

let _db, _mongoConfig;

class MongoWrapper {
  static useConfig(mongoConfig) {
    _mongoConfig = mongoConfig;
  }

  static getConfig() {
    return _mongoConfig;
  }

  static initConnection() {
    if (_db) {
      return Promise.resolve();
    }

    const mongoConnectPromise = Promise.promisify(MongoClient.connect);

    return mongoConnectPromise(_mongoConfig.getConnectionString())
      .then(dbConnection => {
        console.info("Connection Initialized Successfully");
        _db = dbConnection;
      });
  }

  static closeConnection() {
    if (_db) {
      // TODO: Fix
      _db.close();
    }
  }

  static dropCollection(collectionName){
    return MongoWrapper.initConnection()
      .then(() => {
        return new Promise((resolve, reject) => {
          _db.collection(collectionName).drop(function (err) {
            if(err){
              return reject(err);
            } else {
              return resolve();
            }
          });
        });
      });
  }

  static insertDocument(collectionName, document) {
    return MongoWrapper.initConnection()
      .then(() => {
        return new Promise((resolve, reject) => {
          _db.collection(collectionName).insertOne(document, function (err, doc) {
            if(err){
              return reject(err);
            } else {
              document._id = doc.insertedId;
              return resolve(document);
            }
          });
        });
      });
  }

  updateDocument(collectionName, document, callback) {
    document._id = new ObjectID(document._id.toString());

    this.getConnection(function (err, database) {
      database.collection(collectionName).update({ "_id": document._id }, document, { upsert: false }, function (err, docs) {
        callback(err, docs);
      });
    });

  }

  upsertDocument(collectionName, document, callback) {
    document._id = new ObjectID(document._id.toString());

    this.getConnection(function (err, database) {
      database.collection(collectionName).update({ "_id": document._id }, document, { upsert: true }, function (err, docs) {
        callback(err, docs);
      });
    });
  }

  deleteDocumentById(collectionName, documentId, callback) {
    this.getConnection(function (err, database) {
      database.collection(collectionName).remove({ "_id": new ObjectID(documentId) }, document, { upsert: false }, function (err, docs) {
        callback(err, docs);
      });
    });
  }

  deleteDocument(collectionName, document, callback) {
    document._id = new ObjectID(document._id);
    this.getConnection(function (err, database) {
      database.collection(collectionName).remove({ "_id": document._id }, document, function (err, docs) {
        callback(err, docs);
      });
    });
  }

  getAllFromCollection(collectionName, callback) {
    console.dir("Collection Name:" + collectionName);
    this.getConnection(function (err, database) {
      database.collection(collectionName).find().toArray(function (err, docs) {
        callback(err, docs);
      });
    });
  }

  getTopXFromCollection(collectionName, limit, callback) {
    console.dir("Collection Name:" + collectionName);
    this.getConnection(function (err, database) {
      database.collection(collectionName).find().limit(limit).toArray(function (err, docs) {
        console.dir("docs fetched");
        callback(err, docs);
      });
    });
  }

  loadSelectedFields(collectionName, query, option, callback) {
    console.dir("Collection Name:" + collectionName);
    this.getConnection(function (err, database) {
      database.collection(collectionName).find({}, option).toArray(function (err, docs) {
        console.dir("docs fetched");
        //console.dir(docs);
        callback(err, docs);
      });
    });
  }

  findOne(collectionName, query, callback) {
    console.dir("Collection Name:" + collectionName);
    this.getConnection(function (err, database) {
      database.collection(collectionName).findOne(query, function (err, docs) {
        console.dir("docs fetched");
        //console.dir(docs);
        callback(err, docs);
      });
    });
  }

  findAll(collectionName, query, callback) {
    customQuery(collectionName, { query: query }, callback);
  }

  customQuery(collectionName, options, callback) {
    console.dir("Collection Name:" + collectionName);
    this.getConnection(function (err, database) {
      if (options.hint === "queryWithSortAndLimit") {
        database.collection(collectionName).find(options.query, { "sort": options.sort }).limit(options.limit).toArray(function (err, docs) {
          console.dir("docs fetched");
          callback(err, docs);
        });
      }
      else {
        database.collection(collectionName).find(options.query).toArray(function (err, docs) {
          console.dir("docs fetched");
          //console.dir(docs);
          callback(err, docs);
        });
      }
    });
  }

  getConnection(callback) {
    if (this.dbConnection) {
      return callback(null, this.dbConnection)
    }

    MongoClient.connect(this.mongoConfig.getConnectionString(), (err, dbConnection) => {
      this.dbConnection = dbConnection;
      if (err) {
        console.log("Error Connecting to Mongo");
        return callback(err, null);
      }
      return callback(null, dbConnection);
    });
  }
}

module.exports = MongoWrapper;