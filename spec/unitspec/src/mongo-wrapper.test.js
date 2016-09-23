"use strict";

const MongoWrapper = require("../../../src/mongo-wrapper");
const MongoConfig = require("../../../src/mongo-config");

describe("Mongo Wrapper", () => {
  const mongoConfig = new MongoConfig({
    databaseName: "test"
  });

  beforeEach(done => {
    MongoWrapper.useConfig(mongoConfig);

    MongoWrapper.dropCollection("ABCDEFR")
    .then(() => {
      done();
    });
  });

  it("should insert a sample document", (done) => {
    const doc = {
      firstName: "XXXX",
      lastName: "YYYY"
    };

    MongoWrapper.insertDocument("ABCDEFR", doc)
    .then(updatedDoc => {
      console.dir(updatedDoc);
      expect(updatedDoc).toBeDefined();
      expect(updatedDoc._id).toBeDefined();
      expect(updatedDoc.firstName).toBe("XXXX");
      expect(updatedDoc.lastName).toBe("YYYY");
      done();
    })
    .catch(err => {
      console.warn(err);
      console.warn(err.stack);
    });
  });

  it("should insert a sample document, with the specified id", (done) => {
    const doc = {
      _id: "MyFavouriteId",
      firstName: "XXXX",
      lastName: "YYYY"
    };
    
    MongoWrapper.useConfig(mongoConfig);

    MongoWrapper.insertDocument("ABCDEFR", doc)
    .then(updatedDoc => {
      console.dir(updatedDoc);
      expect(updatedDoc).toBeDefined();
      expect(updatedDoc._id).toBe("MyFavouriteId");
      expect(updatedDoc.firstName).toBe("XXXX");
      expect(updatedDoc.lastName).toBe("YYYY");
      done();
    })
    .catch(err => {
      console.warn(err);
      console.warn(err.stack);
    });
  });
});