"use strict";

var config = require('./mongoQurey.js');
var dBconfig = require('./config.js');

exports.getIPDetails = (IPaddress, cb) => {
	dBconfig.createMongoConn(function (error) {
		if (error) {
			console.log('Unable to load environment variables. Error:', error);
			return cb(true, error);
		} else {
			var db = dBconfig.mongoDbConn
			console.log("getIPDetails");
			var query = {
				"ip_address": IPaddress
			};
			var fields = {
				"_id": 0
			};
			config.findOne(query, fields, null, function (err, response) {
				if (err) {
					console.log("err" + err.stack);
					var resJon = {
						"http_code": 500,
						"response": "Internal Server Error"
					}
					return cb(true, resJon);
				} else {
					console.log(response);
					var resJon = {
						"http_code": 200,
						"response": response
					}
					return cb(false, resJon);
				}
			});
		}
	});
};