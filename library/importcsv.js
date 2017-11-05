"use strict";

var fs = require('fs');
var parse = require('csv').parse;
var async = require('async');
var path = require('path');
var config = require('./mongoQurey.js');
var dBconfig = require('./config.js');
// const csv = require('csvtojson');
var csv = require('fast-csv');
var V = require('jsonschema').Validator;
var validator = new V();
var rowValidation = require('./validation.js').rowValidation;
var ElapsedTime = require('elapsed-time')
var _ = require('underscore');

exports.importData = function (filePath, collection, callback) {
	var et = ElapsedTime.new().start();
	// Read in airport data from csv file and write it to database.
	async.waterfall([
		async.apply(readCSV, filePath),
		//validateFileExt,
		parseCSV,
		connectMongo,
		async.apply(saveDataToDB, filePath, collection)
	], function (err, result) {
		if (err) {
			console.log(result);
			return callback(true, "failure");
		}
		console.log('data saved to db');
		console.log('Elapsed Time: ' + et.getValue());
	});
};

// Validate extension and read csv file.
function readCSV(filePath, cb) {
	console.log("readCSV");
	var extname = path.parse(filePath).ext;
	if (extname == ".csv") {
		fs.readFile(filePath, function (err, data) {
			if (err) {
				return cb(true, err);
			}
			return cb(null, data);
		});
	} else {
		return cb(true, "No files with .csv found");
	}
}

// parse airports csv
function parseCSV(data, cb) {
	console.log("parseCSV");
	parse(data, function (err, parsedData) {
		if (err) {
			return cb(true, err);
		}
		return cb(null);
	});
}

function connectMongo(cb) {
	dBconfig.createMongoConn(function (error) {
		if (error) {
			console.log('Unable to load environment variables. Error:', error);
			return cb(true, error);
		} else {
			var db = dBconfig.mongoDbConn
			console.log("Connected to DB successfully");
			return cb(false, db);
		}
	});
}

// function saveDataToDB(filePath, collection, db, cb){
// 	console.log("saveDataToDB");
//     var errCount = 0;
// 	var sucCount = 0;
// 	var count =0;
// 	csv()
// 	.fromFile(filePath)
// 	.on('json',(jsonObj)=>{
//         // config.upsertOne(collection, jsonObj, jsonObj, function (err, response) {
//         // 	if(err){
//         // 		console.log("Error inserting data");
//         // 		errCount = errCount + 1;
//         // 	}else{
//         // 		sucCount = sucCount + 1;
//         // 		console.log(sucCount);
//         // 	}
// 		// });	
// 		// setTimeout(function() {
// 			console.log(++count);
// 		// }, 5000);
// 		// console.log(++count);
// 	})
// 	.on('done',(error)=>{
// 		console.log('end')
// 		console.log('total num of records uploaded successfully' + sucCount);
// 		console.log('total num of records rejeted' + errCount);
// 		db.close();
// 		return cb(false, null);
// 	})
// }

// function saveDataToDB(filePath, collection, db, cb) {
// 	var errCount = 0;
// 	var sucCount = 0;
// 	var totalCount = 0;
// 	var stream = fs.createReadStream(filePath);
// 	var parser = csv().fromStream(stream, { headers: true }).on("data", function (data) {
// 		console.log('here');
// 		parser.pause();
// 		totalCount = totalCount + 1;
// 		console.log(typeof data);
// 		console.log(JSON.stringify(data));
// 		config.upsertOne(collection, data, data, function (err, response) {
// 			if (err) {
// 				console.log("Error inserting data");
// 				console.log("err: "+JSON.stringify(err));
// 				console.log("response: "+JSON.stringify(response));
// 				errCount = errCount + 1;
// 				parser.resume();
// 			} else {
// 				sucCount = sucCount + 1;
// 				console.log(sucCount);
// 				parser.resume();
// 			}
// 		});

// 	}).on("end", function () {
// 		console.log('end of saving file');
// 		console.log('end')
// 		console.log('total num of records- ' + totalCount);
// 		console.log('total num of records uploaded successfully- ' + sucCount);
// 		console.log('total num of records rejeted- ' + errCount);
// 	});
// };


function saveDataToDB(filePath, collection, db, cb) {
	console.log("saveDataToDB");
	var errCount = 0;
	var sucCount = 0;
	var count = 0;
	var count1 = 0;
	var unCount = 0;
	var duplicateCount = 0;
	var wrongFormatCount = 0;

	csv.fromPath(filePath, {
			headers: true
		})
		.validate(function (data, next) {
			console.log("count: " + (++count));
			var validation_result = validator.validate(data, rowValidation);
			if (validation_result.errors.length > 0) {
				++wrongFormatCount;
				++errCount;
				console.log("inside errors");
				next(null);
			} else {
				data = formatRow(data);
				config.upsertOne(collection, data, data, function (err, response) {
					if (err) {
						console.log("Error inserting data");
						errCount = errCount + 1;
						next(null);

					} else {
						if ("upserted" in response.result && response.result.upserted.length > 0) {
							++sucCount;
							console.log("sucCount: " + sucCount);							
						} else {
							++errCount;
							++duplicateCount;
						}
						next(null)
					}
				});
			}
		})
		.on("data", function (data) {})
		.on("end", function () {
			console.log('end')
			console.log('total num of records : ' + count);
			console.log('total num of records inserted: ' + sucCount);
			console.log('total num of records rejeted: ' + errCount);
			console.log('total num of records with wrong format: ' + wrongFormatCount);
			console.log('total num of records duplicate records: ' + duplicateCount);
			db.close();
			return cb(false, null);
		});

}

var formatRow = (row) => {
	return _.pick(row, 'ip_address', 'country_code', 'country', 'city', 'latitude', 'longitude', 'mystery_value');
};