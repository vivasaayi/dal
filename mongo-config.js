"use strict";

class MongoConfig {
  constructor(dbConfig, host, port, databaseName) {
    this.dbConfig = dbConfig || {};
    this.host = host;
    this.port = port;
    this.databaseName = databaseName;
  }

  getConnectionString() {
    const connectionString = "mongodb://" + (this.dbConfig.host || this.host)
      + ":" + (this.dbConfig.port || this.port)
      + "/" + (this.dbConfig.databaseName || this.databaseName);
    return connectionString;
  }
}

module.exports = MongoConfig;