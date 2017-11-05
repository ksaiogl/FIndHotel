"use strict";

var fs = require('fs');
var parse = require('csv').parse;
var async = require('async');
var path = require('path');
var config = require('./mongoQurey.js');

// take file path argument from command line (absolute or relative path)
// or default to the file path I used
var filePath = "./SourceData/data_dump.csv";
var collection = "findIP";


exports.importData = function(file, callback){
		// Read in airport data from csv file and write it to database.
		async.waterfall([
		    async.apply(readCSV, filePath),
		    //validateFileExt,
		    parseCSV,
		    saveDataToDB
		], function(err, result){
		    if(err){
		        console.log(result);
		        return callback(true, "failure");
		    }
		    console.log('data saved to db');
		    getIPDetails("70.95.73.73", function (err, result) {
		    	if(err)
		    	{
		    		console.log("err : " + err);
		    		return callback(true, err);
		    		process.exit(0);

		    	}else{
		    		console.log("result : " + result);
		    		return callback(false, "Success");
		    		process.exit(0);
		    	}
		    });	
		    
		});
};		

// Validate extension and read csv file.
function readCSV(filePath, cb){

	var extname = path.parse(filePath).ext;
	if(extname == ".csv"){
	    fs.readFile(filePath, function (err, data) {
	        if (err) {
	            return cb(true, err);
	        }
	        return cb(null, data);
	    });
	}else{
		return cb(true, "No files with .csv found");
	}
}

// parse airports csv
function parseCSV(data, cb){
    parse(data, function (err, parsedData) {
        if (err) {
            return cb(true, err);
        }
        return cb(null, parsedData);
    });
}


function saveDataToDB(data, cb){
	console.log("saveDataToDB");
    var errCount = 0;
    var sucCount = 0;
	const csvFilePath= "./SourceData/data_dump.csv";
	const csv=require('csvtojson')
	csv()
	.fromFile(csvFilePath)
	.on('json',(jsonObj)=>{
        config.upsertOne(collection, jsonObj, jsonObj, function (err, response) {
        	if(err){
        		console.log("Error inserting data");
        		errCount = errCount + 1;
        	}else{
        		sucCount = sucCount + 1;
        		console.log(sucCount);
        	}
        });	
	})
	.on('done',(error)=>{
		console.log('end')
		console.log('total num of records uploaded successfully' + sucCount);
		console.log('total num of records rejeted' + errCount);
		return cb(false, null);
	})
}


function getIPDetails(IPaddress, cb){
	console.log("getIPDetails");
	var query = {"ip_address":IPaddress};
	 config.findOne(collection, query, null, null, function (err, response) {
        	if(err){
        		console.log("err" + err);
        		return cb(true, err);
        	}else{
        		console.log(response);
        		return cb(false, response);
        	}
        });	
}



