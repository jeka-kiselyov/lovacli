const path = require('path');

class DB {
	constructor(params = {}) {
		this._config = params.config || {};
		this._logger = params.logger || {};
		this._program = params.program || null;
	}

	get config() {
		return this._config;
	}

	get logger() {
		return this._logger;
	}

	async init() {
		let availableSequelizeDialects = ['mysql', 'sqlite', 'postgres', 'mssql'];

		let initializerClass = null;
		if (this.config.database && this.config.database.dialect == 'mongodb') {
			initializerClass = require(path.join(__dirname, '../includes/db/mongodb.js'));
		} else if (this.config.database && (availableSequelizeDialects.indexOf(this.config.database.dialect) != -1)) {
			initializerClass = require(path.join(__dirname, '../includes/db/sequelize.js'));
		} else {
			return this;
		}

		let initializer = new initializerClass({
			config: this.config,
			logger: this.logger
		});
		
		let models = await initializer.init();
		for (let k in models) {
			this[k] = models[k];

			if (models[k].logger === undefined) {
				models[k].logger = this.logger;
			}
			if (models[k].program === undefined) {
				models[k].program = this._program;
			}
		}

		return this;
	}
}


module.exports = DB;