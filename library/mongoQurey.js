var dbConfig = require('./config.js');
var collection = "Test"

exports.upsertOne = (collection, query, updates, callback) => {
	var db = dbConfig.mongoDbConn;
	var fhColl = db.collection(collection);
	fhColl.updateOne(query, updates, {
		upsert: true
	}, (err, response) => {
		return callback(err, response);
	});
};

exports.findOne = (query, fields, options, callback) => {
	var db = dbConfig.mongoDbConn;
	var fhColl = db.collection(collection);
	options = options || {};
	fields = fields || {};

	/*if (!_.isEmpty(fields)) {
	  options.fields = fields;
	}*/

	fhColl.findOne(query, fields, function (err, response) {
		return callback(err, response);
	});
};