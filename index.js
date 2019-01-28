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

		if (this._config.database) {
			this._db = new DB({
				config: this._config,
				logger: this._logger,
				program: this
			});
		} else {
			this._db = null;
		}

		// initialize caporal program. https://www.npmjs.com/package/caporal
		this._prog = prog
			  .version(this._config.version)
			  .logger(this.logger)
			  .description(this.config.name);

		//
		this._commands = {};

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

	async loadCommand(filename) {
		let name = path.basename(filename, path.extname(filename));
		let inc = require(filename);

		if (Command.isPrototypeOf(inc)) {
			let command = new inc({
				program: this,
				name: name
			});

			await command.init();

			this._commands[name] = command;

			return command;
		}

		return null;
	}

	async execute(name, args = [], options = {}) {
		if (typeof(this._commands[name]) === undefined) {
			throw new Error('Invalid command name: '+name);
		}

		return await this._commands[name].execute(args, options);
	}

	async init(handleImmediate = true) {
		try {
			let resources = require(path.join(__dirname, 'includes/resources.js'));
			let filenames = await resources.loadPaths(this.config.paths.commands);

			for (let filename of filenames) {
				await this.loadCommand(filename);
			}
		} catch(e) {
			this.exit(e);
		}

		if (handleImmediate) {
			await this.handle();
		}
	}

	async handle() {
		try {
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


