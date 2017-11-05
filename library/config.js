var TAG = 'config.js';
var mongoClient =  require('mongodb').MongoClient;
var async = require('async');

var env = process.argv[2];
if (!( env === 'prd' || env === 'loc')) {
    throw new Error("The environment should be one of 'prd'(Production) or 'loc'(Local)..");
}

console.log(TAG + " " +"Deployment Environment is: " + env);

var dbConfig = {
    "prd":
    {
        "type": "singleInstance",
        "user": "",
        "pwd": "",
        "mongod": ["127.0.0.1:27017"],
        "database": "FindHotel"
    },
    "loc":
    {
        "type": "singleInstance",
        "user": "",
        "pwd": "",
        "mongod": ["mongo"],
        "database": "FindHotel"
    }
};

var connParams = null;
if (env === 'prd') {
    connParams = dbConfig.prd;
}  else {
    connParams = dbConfig.loc;
}
var mongod = connParams.mongod;

var databaseURL = null;
var mongoDbConn = null;

var hosts = null;
for (var i=0; i<mongod.length; i++){
    if (i === 0) {
        hosts = mongod[0];
    }else {
        hosts = hosts + ',' + mongod[i];
    }
}

var dbConnUrl = null;
if (!( connParams.user === "" && connParams.pwd === "")) {
    dbConnUrl = 'mongodb://' + connParams.user + ':' + connParams.pwd + '@' + hosts + '/' + connParams.database;
    console.log(dbConnUrl);
} else {
    dbConnUrl = 'mongodb://' + hosts + '/' + connParams.database ;
}


exports.createMongoConn = function(callback) {
    mongoClient.connect(dbConnUrl,function (err, database) {
        if (err) {
            callback(err);
        } else {
            console.log('Connection established to: ', dbConnUrl);
            exports.mongoDbConn = database;
            console.log('DB connection successfull.');
            callback(false);
        }
    });
};     