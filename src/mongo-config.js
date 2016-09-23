"use strict";

class MongoConfig {
  constructor(dbConfig) {
    this.dbConfig = dbConfig || {};
  }

  validate() {
    if(!this.dbConfig.databaseName){
      throw new Error("Database Name is not specified");
    }

    if(!this.dbConfig.host){
      this.dbConfig.host = "localhost";
      console.warn("Host is not specified. Using default (localhost).");
    }

    if(!this.dbConfig.port){
      this.dbConfig.port = 27017;
      console.warn("Host is not specified. Using default (27017).");
    }
  }

  getConnectionString() {
    this.validate();


    const connectionString = "mongodb://" + (this.dbConfig.host)
      + ":" + (this.dbConfig.port)
      + "/" + (this.dbConfig.databaseName);
      
    return connectionString;
  }
}

module.exports = MongoConfig;