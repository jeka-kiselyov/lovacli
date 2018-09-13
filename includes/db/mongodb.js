const fs = require('fs');
const path = require('path');

const resources = require(path.join(__dirname, '../../includes/resources.js'));;
const config = require(path.join(__dirname, '../../includes/config.js'));;
const log = require(path.join(__dirname, '../../includes/logger.js'))();;

try {
    require.resolve("mongoose");
} catch(e) {
    log.error("Mongoose is not found. Install it in order to use mongodb models in lovacli. Run: npm install mongoose --save");
    process.exit(e.code);
}

const mongoose = require('mongoose');

const options = {
	logging: false
};

let initMongoose = function() {
	return new Promise(function(resolve, reject) {
		let db = {};

	    let options = { 
	    	useNewUrlParser: true
	    };

		log.debug('Creating connection to MongoDB');
	    mongoose.createConnection(config.database.database, options).then(function(connection){
			log.debug('We are connected to db');

			resources.loadModelsPaths().then(function(paths){
				paths.forEach(function(path) {
					let inc = null;
					try {
						let model = require(path);
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