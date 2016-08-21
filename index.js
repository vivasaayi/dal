"use strict";

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var _ = require("underscore");

var connectionString = "";
var database = undefined;

class MongoWrapper {
  constructor(mongoConfig) {
    this.mongoConfig = mongoConfig;
  }

  insertDocument(collectionName, document, callback) {
    this.getConnection(function (err, database) {
      database.collection(collectionName).insert(document, function (err, docs) {
        callback(err, docs);
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

let mongoWrapper = null;

module.exports.getInstance = function (mongoConfig) {
  if (!mongoWrapper) {
    mongoWrapper = new MongoWrapper(mongoConfig);
  }

  return mongoWrapper;
};

module.exports.startMongo = function (mongoConfig) {
  //if (_.isEmpty(dbConfig)) {
  //  callback("Please specify the database configuration.", null);
  //  return;
  //}

  //if (_.isEmpty(dbConfig.host)) {
  //  callback("Host not specified.", null);
  //  return;
  //}

  //if (_.isEmpty(dbConfig.port)) {
  // callback("Port not specified.", null);
  //  return;
  //}

  //if (_.isEmpty(dbConfig.databaseName)) {
  //  callback("Database name not specified.", null);
  //  return;
  //}


};