var express = require('express');
var app = express();
var getIPDetails = require('../library/getIPDetails.js');

app.get('/:ip', function (req, res) {
	var callback = function (err, regres) {
		res.statusCode = regres.http_code;
		res.json(regres);
	};
	getIPDetails.getIPDetails(req.params.ip, callback);
});

module.exports = app;