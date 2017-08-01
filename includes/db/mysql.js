var fs = require('fs');
var path = require('path');
var rfr = require('rfr');
var basename = path.basename(module.filename);
var resources = rfr('includes/resources.js');
var config = rfr('includes/config.js');
var Promise = require("bluebird");
var log = rfr('includes/logger.js');

try {
    require.resolve("sequelize");
} catch(e) {
    log.error("Sequelize is not found. Run: npm install sequelize --save");
    process.exit(e.code);
}

var Sequelize = require('sequelize');

var options = {
	logging: false
};

var initMySQL = function() {
	return new Promise(function(resolve, reject) {
		var db = {};

		var options = {
			logging: false
		};

		if (config.database.use_env_variable) {
			var sequelize = new Sequelize(process.env[config.database.use_env_variable], options);
		} else {
			options.host = config.database.host || null;
			options.dialect = config.database.dialect || null;
			options.storage = config.database.storage || null;

			var sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, options);
		}

		resources.loadModelsPaths().then(function(paths){
			paths.forEach(function(path) {
				try {
				    var model = sequelize['import'](path);
				    db[model.name] = model;
				} catch(e) {
					log.error("Invalid sequelize model: "+path+" | ", e);
				}
			});

			log.debug('Models loaded');

			Object.keys(db).forEach(function(modelName) {
			  if (db[modelName].associate) {
			    db[modelName].associate(db);
			  }
			});

			sequelize.db = db;
			db.sequelize = sequelize;
			db.Sequelize = Sequelize;
			/// Ready
			/// 

			resolve(db);
		});

	});
};

exports.init = initMySQL;