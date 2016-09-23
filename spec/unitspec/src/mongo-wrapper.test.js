"use strict";

const MongoWrapper = require("../../../src/mongo-wrapper");
const MongoConfig = require("../../../src/mongo-config");

describe("Mongo Wrapper", () => {
  const mongoConfig = new MongoConfig({
    databaseName: "test"
  });

  const john = {
    _id: "IDOFJOHN",
    firstName: "John",
    lastName: "Peter"
  };

  const johan = {
    _id: "IDOFJOHAN",
    firstName: "Johan",
    lastName: "Smith"
  };

  const rajan = {
    _id: "IDOFRAJAN",
    firstName: "Rajan",
    lastName: "Panneer Selvam"
  };

  const abraham = {
    _id: "IDOFABRAHAM",
    firstName: "ABRAHAM",
    lastName: "DAVID"
  };

  beforeAll(done => {
    console.log("Executing before All");
    MongoWrapper.useConfig(mongoConfig);

    MongoWrapper.dropCollection("STUDENTS")
      .then(() => {
        console.log("Dropped STUDENTS collection");
        return MongoWrapper.insertMultipleDocuments("STUDENTS", [rajan, johan, abraham, john]);
      })
      .then(() => {
        console.log("Inserted Documents to STUDENTS collection");
        done();
      })
      .catch(err => {
        console.log("Error populating the STUDENTS collection.");
        console.dir(err);
      });
  });

  beforeEach(done => {
    MongoWrapper.dropCollection("ABCDEFR")
      .then(() => {
        return MongoWrapper.insertDocument("ABCDEFR", john);
      })
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

  it("should be able to query a singe document", (done) => {
    MongoWrapper.findOneByQuery("ABCDEFR", { _id: "IDOFJOHN" })
      .then(result => {
        expect(result).toBeDefined();
        expect(result).toEqual(john);
        done();
      })
      .catch(err => {
        console.warn(err);
        console.warn(err.stack);
      });
  });

  // CustomQuery
  it("should be able to query the documents, using custom query", (done) => {
    MongoWrapper.customQuery("ABCDEFR", { query: { _id: "IDOFJOHN" } })
      .then(result => {
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        expect(result).toEqual([john]);
        done();
      })
      .catch(err => {
        console.warn(err);
        console.warn(err.stack);
      });
  });

  it("should be able to query the documents, Single Doc, using custom query - STUDENTS", (done) => {
    MongoWrapper.customQuery("STUDENTS", { query: { _id: "IDOFRAJAN" } })
      .then(result => {
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        expect(result).toEqual([rajan]);
        done();
      })
      .catch(err => {
        console.warn(err);
        console.warn(err.stack);
      });
  });

  it("should be able to query the documents, All Docs, using custom query - STUDENTS", (done) => {
    MongoWrapper.customQuery("STUDENTS", { query: {} })
      .then(result => {
        expect(result).toBeDefined();
        expect(result.length).toBe(4);
        expect(result).toEqual([rajan, johan, abraham, john]);
        done();
      })
      .catch(err => {
        console.warn(err);
        console.warn(err.stack);
      });
  });

  it("should be able to query the documents, All Docs/Limit, using custom query - STUDENTS", (done) => {
    MongoWrapper.customQuery("STUDENTS", { query: {}, limit: 2 })
      .then(result => {
        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result).toEqual([rajan, johan]);
        done();
      })
      .catch(err => {
        console.warn(err);
        console.warn(err.stack);
      });
  });

  it("should be able to query the documents, All Docs/Skip/Limit, using custom query - STUDENTS", (done) => {
    MongoWrapper.customQuery("STUDENTS", { query: {}, limit: 2, skip: 1 })
      .then(result => {
        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result).toEqual([johan, abraham]);
        done();
      })
      .catch(err => {
        console.warn(err);
        console.warn(err.stack);
      });
  });

  it("should be able to query the documents, All Docs/Sort, using custom query - STUDENTS", (done) => {
    MongoWrapper.customQuery("STUDENTS", { query: {}, sort: { firstName: 1 } })
      .then(result => {
        expect(result).toBeDefined();
        expect(result.length).toBe(4);
        expect(result).toEqual([abraham, johan, john, rajan]);
        done();
      })
      .catch(err => {
        console.warn(err);
        console.warn(err.stack);
      });
  });

  it("should be able to query the documents, All Docs/Sort/skip/limit, using custom query - STUDENTS", (done) => {
    MongoWrapper.customQuery("STUDENTS", { query: {}, skip: 1, limit: 2, sort: { firstName: 1 } })
      .then(result => {
        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result).toEqual([johan, john]);
        done();
      })
      .catch(err => {
        console.warn(err);
        console.warn(err.stack);
      });
  });
});