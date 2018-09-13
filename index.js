#!/usr/bin/env node

const prog = require('caporal');
const path = require('path');

class LovaCLIApplication {
	constructor(options) {
		if (options) {
			this.init(options);
		}

		this._config = require(path.join(__dirname, 'includes/config.js'));
		this._logger = require(path.join(__dirname, 'includes/logger.js'))();
		this._db = require(path.join(__dirname, 'includes/db.js'));
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

	init(options = {}) {
		this.config.updateConfig(options);

		try {
			let resources = require(path.join(__dirname, 'includes/resources.js'));

			prog
			  .version('1.0.0')
			  .logger(this.logger)
			  .description(this.config.name);

			prog.application = this;

			resources.loadCommands().then(function(handlers){
				for (let k in handlers) {
					handlers[k].handler(prog);
				}

				prog.parse(process.argv);
			});
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
		} else {
			process.exit();
		}
	}

	handleCatcher(handler) {
		let application = this;
		if (handler && handler.constructor && handler.constructor.name == 'AsyncFunction') {
			let newHandler = async function(args, options, logger) {
				try {
					return await handler(args, options, logger);
				} catch(e) {
					application.exit(e);
				}
				return null;
			}

			return newHandler;
		} else {
			let newHandler = function(args, options, logger) {
				try {
					return handler(args, options, logger);
				} catch(e) {
					application.exit(e);
				}
				return null;
			}

			return newHandler;		
		}
	}
};

if (!module.parent) {
	let application = new LovaCLIApplication();
	application.init();
} else {
	module.exports = LovaCLIApplication;
}


