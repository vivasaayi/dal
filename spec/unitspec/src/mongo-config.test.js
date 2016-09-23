"use strict";

const MongoConfig = require("../../../src/mongo-config");

describe("Mongo Config", () => {
  it("can be initialized", () => {
    const mongoConfig = new MongoConfig();
    expect(mongoConfig).toBeDefined();
  });

  it("should throw an error if the config is not specified", () => {
    const mongoConfig = new MongoConfig();
    const getConnectionFn = mongoConfig.getConnectionString.bind(mongoConfig);
    expect(getConnectionFn).toThrowError("Database Name is not specified");
  });

  it("should use default host and port", () => {
    const mongoConfig = new MongoConfig({
      databaseName: "Sample"
    });
    mongoConfig.getConnectionString();
    expect(mongoConfig.dbConfig.databaseName).toBe("Sample");
    expect(mongoConfig.dbConfig.host).toBe("localhost");
    expect(mongoConfig.dbConfig.port).toBe(27017);
  });

  it("should initialize port and host", () => {
    const mongoConfig = new MongoConfig({
      databaseName: "Sample",
      host: "MyHost",
      port: 1000
    });
    mongoConfig.getConnectionString();
    expect(mongoConfig.dbConfig.databaseName).toBe("Sample");
    expect(mongoConfig.dbConfig.host).toBe("MyHost");
    expect(mongoConfig.dbConfig.port).toBe(1000);
  });
});