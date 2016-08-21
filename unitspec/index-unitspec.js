var proxyquire = require("proxyquire");

var mongoMock = require("./mocks/mongo-mock.js");
var dal = proxyquire("../index.js", { "mongodb": mongoMock });

describe("Data Access Layer", function () {
  it("should should start mongo without error", function (done) {
    var config = {
      host: "H1",
      port: "P1",
      databaseName: "D1"
    };
    
    dal.startMongo(config, function (err, db) {
      expect(err).toBe(null);
      expect(db).toEqual({ db: "DB" })
      expect(mongoMock.MongoClient.getLastConnectionString()).toBe("mongodb://H1:P1/D1");
      done();
    });
  });
  it("should fail if the database connection failed", function (done) {
    var config = {
      host: "H2",
      port: "P2",
      databaseName: "D2"
    };
    
    mongoMock.MongoClient.setThrowError(true);
    dal.startMongo(config, function (err, db) {
      expect(err).toBe("Database Error");
      expect(db).toEqual(null)
      expect(mongoMock.MongoClient.getLastConnectionString()).toBe("mongodb://H2:P2/D2");
      done();
    });
  });
  
  describe("starting mongo", function () {
    it("should fail if config is null", function () {
      var config = null;
      var spy = jasmine.createSpy();
      mongoMock.MongoClient.getLastConnectionString = spy;
      
      dal.startMongo(config, function (err, db) {
        expect(err).toBe("Please specify the database configuration.");
        expect(db).toEqual(null);
        expect(spy).not.toHaveBeenCalled();
      });
    });
    
    it("should fail if config is empty object", function () {
      var config = {};
      var spy = jasmine.createSpy();
      mongoMock.MongoClient.getLastConnectionString = spy;
      
      dal.startMongo(config, function (err, db) {
        expect(err).toBe("Please specify the database configuration.");
        expect(db).toEqual(null)
        expect(spy).not.toHaveBeenCalled();
      });
    });
    
    it("should fail if host is null", function () {
      var config = {
        port: "9000"
      };
      var spy = jasmine.createSpy();
      mongoMock.MongoClient.getLastConnectionString = spy;
      
      dal.startMongo(config, function (err, db) {
        expect(err).toBe("Host not specified.");
        expect(db).toEqual(null);
        expect(spy).not.toHaveBeenCalled();
      });
    });
    
    it("should fail if host is empty object", function () {
      var config = {
        host: "",
        port: "9000"
      };
      var spy = jasmine.createSpy();
      mongoMock.MongoClient.getLastConnectionString = spy;
      
      dal.startMongo(config, function (err, db) {
        expect(err).toBe("Host not specified.");
        expect(db).toEqual(null)
        expect(spy).not.toHaveBeenCalled();
      });
    });
    
    it("should fail if port is empty/null", function () {
      var config = {
        host: "H1"
      };
      var spy = jasmine.createSpy();
      mongoMock.MongoClient.getLastConnectionString = spy;
      
      dal.startMongo(config, function (err, db) {
        expect(err).toBe("Port not specified.");
        expect(db).toEqual(null)
        expect(spy).not.toHaveBeenCalled();
      });
    });
    
    it("should fail if database name is empty/null", function () {
      var config = {
        host: "H1",
        port: "9000"
      };
      var spy = jasmine.createSpy();
      mongoMock.MongoClient.getLastConnectionString = spy;
      
      dal.startMongo(config, function (err, db) {
        expect(err).toBe("Database name not specified.");
        expect(db).toEqual(null)
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

});
