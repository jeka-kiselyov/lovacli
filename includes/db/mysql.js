const fs = require('fs');
const path = require('path');

const resources = require(path.join(__dirname, '../../includes/resources.js'));;
const config = require(path.join(__dirname, '../../includes/config.js'));;
const log = require(path.join(__dirname, '../../includes/logger.js'))();;

try {
    require.resolve("sequelize");
} catch(e) {
    log.error("Sequelize is not found. Install it in order to use mysql models in lovacli. Run: npm install sequelize --save");
    process.exit(e.code);
}

try {
    require.resolve("mysql2");
} catch(e) {
    log.error("mysql2 is not found. Install it in order to use mysql models in lovacli. Run: npm install mysql2 --save");
    process.exit(e.code);
}

const Sequelize = require('sequelize');

const options = {
	logging: false
};

let initMySQL = function() {
	return new Promise(function(resolve, reject) {
		let db = {};

		let options = {
			logging: false
		};

		let sequelize = null;

		if (config.database.use_env_variable) {
			sequelize = new Sequelize(process.env[config.database.use_env_variable], options);
		} else {
			options.host = config.database.host || null;
			options.dialect = config.database.dialect || null;
			options.storage = config.database.storage || null;

			sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, options);
		}

		resources.loadModelsPaths().then(function(paths){
			paths.forEach(function(path) {
				try {
				    let model = sequelize['import'](path);
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