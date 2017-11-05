"use strict";

var TAG = 'server.js';
var express = require('express');
var app = express();
var env = require('./env.js').env;
var routes = require('./routes/index.js');
var getIPDetails = require('./routes/getIPDetails.js');
var path = require('path');
var config = require('./config.js');
var importData = require('./library/importcsv.js');
//var log = require('./Environment/log4js.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//CORS issue in the Browser.
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
	res.header("Access-Control-Allow-Credentials", true);
	next();
});

//Routing
app.use('/', routes);
app.use('/getIPDetails',getIPDetails);

if (env === "prd") {
	app.listen(8080);
	console.log('Listening on port 8080');
}else{
	//loc
	app.listen(8083);
	console.log('Listening on port 8083');
	importData.importData("./SourceData/csv2.csv", "Test",function(err, result){
		if(err){
			console.log("Error - File uploading file " + err + result);
		}	
		else{
			console.log("File uploaded successfully");
		}
	});
}