#!/usr/bin/env node

const prog = require('caporal');
const path = require('path');
const _ = require('lodash');

const LovaClass = require(path.join(__dirname, 'includes/abstract/lovaclass.js'));
const Command = require(path.join(__dirname, 'includes/abstract/command.js'));
const Logger = require(path.join(__dirname, 'includes/logger.js'));
const DB = require(path.join(__dirname, 'includes/db.js'));

class Program {
	constructor(options = {}) {

		// default config
		this._config = {
			"name": "LovaCLISampleApp",
			"debug": true,
			"version": "1.0.0",
			"paths": {
				"models": path.join(__dirname, "../app/models"),
				"commands": path.join(__dirname, "../app/commands"),
				"tests": path.join(__dirname, "../app/tests")
			}
		};

		// extend config with passed parameters
		_.merge(this._config, options);

		// load and initialize sub-classes
		this._logger  = new Logger(this._config);
		this._db = new DB({
			config: this._config,
			logger: this._logger,
			program: this
		});

		// initialize caporal program. https://www.npmjs.com/package/caporal
		this._prog = prog
			  .version('1.0.0')
			  .logger(this.logger)
			  .description(this.config.name);


		this._prog.program = this;
	}

	get prog() {
		return this._prog;
	}

	get logger() {
		return this._logger;
	}

	get db() {
		return this._db;
	}

	get config() {
		return this._config;
	}

	async init() {
		try {
			let resources = require(path.join(__dirname, 'includes/resources.js'));

			let commandClasses = await resources.loadCommands(this.config.paths.commands);

			for (let commandClass of commandClasses) {
				if (Command.isPrototypeOf(commandClass)) {
					let command = new commandClass({
						program: this
					});
					command.init();
				}
			}

			this.prog.parse(process.argv);

		} catch(e) {
			this.exit(e);
		}
	}

	exit(e = null) {
		if (e instanceof Error) {
			if (this.config.debug) {
				this.logger.error(e.stack);
			} else {
				this.logger.error(""+e);			
			}			
			process.exit(1); // @todo: get code from Error object?
		} else if (e) {
			this.logger.error(""+e);			
			process.exit(1);
		} else {
			process.exit();
		}
	}

	handleCatcher(handler) {
		let program = this;
		if (handler && handler.constructor && handler.constructor.name == 'AsyncFunction') {
			let newHandler = async function(args, options, logger) {
				try {
					return await handler(args, options, logger);
				} catch(e) {
					program.exit(e);
				}
				return null;
			}

			return newHandler;
		} else {
			let newHandler = function(args, options, logger) {
				try {
					return handler(args, options, logger);
				} catch(e) {
					program.exit(e);
				}
				return null;
			}

			return newHandler;		
		}
	}
};

if (!module.parent) {
	let program = new Program();
	program.init();
} else {
	module.exports = {
		Program: Program,
		Command: Command,
		LovaClass: LovaClass
	};
}


