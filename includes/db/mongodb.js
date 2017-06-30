var fs = require('fs');
var path = require('path');
var rfr = require('rfr');
var basename = path.basename(module.filename);
var resources = rfr('includes/resources.js');
var config = rfr('includes/config.js');
var Promise = require("bluebird");

var log = rfr('includes/logger.js');

try {
    require.resolve("mongoose");
} catch(e) {
    log.error("Mongoose is not found. Run: npm install mongoose --save");
    process.exit(e.code);
}

var mongoose = require('mongoose');


var options = {
	logging: false
};

var initMongoose = function() {
	return new Promise(function(resolve, reject) {
		var db = {};

	    var options = { 
	    	useMongoClient: true,
	    	promiseLibrary: require('bluebird')
	    };

	    mongoose.Promise = require('bluebird');

		log.debug('Creating connection to MongoDB');
	    mongoose.createConnection(config.database.database, options).then(function(connection){
			log.debug('We are connected to db');

			resources.loadModelsPaths().then(function(paths){
				paths.forEach(function(path) {
					var inc = null;
					try {
						var model = require(path);
						inc = model(mongoose, connection);

						if (inc && inc.modelName && inc.model) {
							db[inc.modelName] = inc.model;
						} else {
							throw 'modelName and model missed';
						}
					} catch(e) {
						log.error("Invalid mongoose model: "+path+" | ", e);
					}
				});

				log.debug('Models loaded');
				/// Ready
				resolve(db);
			});			
	    }).catch(function(err){
	    	log.error(err);
	    	reject();
	    });
	});
};


exports.init = initMongoose;