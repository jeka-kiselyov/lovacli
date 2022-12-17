
const path = require('path');
const resources = require(path.join(__dirname, '../../includes/resources.js'));

try {
    require.resolve("mongoose");
} catch(e) {
    console.error("Mongoose is not found. Install it in order to use mongodb models in lovacli. Run: npm install mongoose --save");
    process.exit(e.code);
}

const mongoose = require('mongoose');

class MongoDBInitilizer {
	constructor(params = {}) {
		this._config = params.config || {};
		this._logger = params.logger || {};

		this._initializedInstance = null;
	}

	get config() {
		return this._config;
	}

	get logger() {
		return this._logger;
	}

	async init() {
		if (this._initializedInstance !== null) {
			return this._initializedInstance;
		}

		let db = {};

	    let options = { 
	    	useNewUrlParser: true,
				useUnifiedTopology: true
	    };

		this.logger.debug('Creating connection to MongoDB');

		let connection = await mongoose.createConnection(this.config.database.database, options);

		this.logger.debug('We are connected to MongoDB');

		let modelPaths = await resources.loadModelsPaths(this.config.paths.models);

		let that = this;
		modelPaths.forEach(function(path) {
			let inc = null;
			try {
				let model = require(path);
				inc = model(mongoose, connection, db);

				if (inc && inc.modelName && inc.model) {
					db[inc.modelName] = inc.model;
				} else {
					throw 'modelName and model missed';
				}
			} catch(e) {
				that.logger.error("Invalid mongoose model: "+path+" | ", e);
			}
		});

		db.mongoose = mongoose;
		db.connection = connection;

		this._initializedInstance = db;

		return db;
	}
}

module.exports = MongoDBInitilizer;
