var connectionString = "";
var throwError = false;

var mongoMock = {
  MongoClient: {
    connect: function (connectionStr, callback) {
      connectionString = connectionStr;
      
      if (throwError) {
        callback("Database Error", null);
      } else {
        callback(null, { db: "DB" });
      }
    },
    getLastConnectionString: function () {
      return connectionString;
    },
    setThrowError: function (flag) {
      if (flag) {
        throwError = true;
      } else {
        throwError = false;
      }
    }
  }
};

module.exports = mongoMock;