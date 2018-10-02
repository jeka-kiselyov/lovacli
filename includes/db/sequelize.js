const fs = require('fs');
const path = require('path');

const resources = require(path.join(__dirname, '../../includes/resources.js'));

try {
    require.resolve("sequelize");
} catch(e) {
    console.error("Sequelize is not found. Install it in order to use mysql models in lovacli. Run: npm install sequelize --save");
    process.exit(e.code);
}

const Sequelize = require('sequelize');

class SequelizeInitilizer {
	constructor(params = {}) {
		this._config = params.config || {};
		this._logger = params.logger || {};
	}

	get config() {
		return this._config;
	}

	get logger() {
		return this._logger;
	}

	async init() {
		let db = {};

		let options = {
			logging: false,
			operatorsAliases: false
		};

		let sequelize = null;

		this.requireModule(this.config.database.dialect);

		if (this.config.database.use_env_variable) {
			sequelize = new Sequelize(process.env[this.config.database.use_env_variable], options);
		} else {
			options.host = this.config.database.host || null;
			options.dialect = this.config.database.dialect || null;
			options.storage = this.config.database.storage || null;

			sequelize = new Sequelize(this.config.database.database, this.config.database.username, this.config.database.password, options);
		}

		let modelPaths = await resources.loadModelsPaths(this.config.paths.models);

		let that = this;
		modelPaths.forEach(function(path) {
			try {
			    let model = sequelize['import'](path);
			    db[model.name] = model;
			} catch(e) {
				that.logger.error("Invalid sequelize model: "+path+" | ", e);
			}
		});

		Object.keys(db).forEach(function(modelName) {
		  if (db[modelName].associate) {
		    db[modelName].associate(db);
		  }
		});

		this.logger.debug('Sequelize models loaded');

		if (this.config.database.sync) {
			this.logger.debug('Sequelize models synchronization...');
			await sequelize.sync();
			this.logger.debug('Sequelize models synchronization. Done.');
		}

		sequelize.db = db;
		db.sequelize = sequelize;
		db.Sequelize = Sequelize;

		return db;
	}

	requireModule(dialectName) {
		let dialectNameToModuleName = {
			'mysql': 'mysql2',
			'sqlite': 'sqlite3',
			'postgres': 'pg',
			'mssql': 'tedious'
		};

		if (dialectNameToModuleName[dialectName]) {
			try {
			    require.resolve(dialectNameToModuleName[dialectName]);
			} catch(e) {
			    this.logger.error(""+dialectNameToModuleName[dialectName]+" is not found. Install it in order to use "+dialectName+" models in lovacli. Run: npm install "+dialectNameToModuleName[dialectName]+" --save");
			    process.exit(e.code);
			}
		}
	}
}

module.exports = SequelizeInitilizer;