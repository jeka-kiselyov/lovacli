const path = require('path');
const winston = require('winston');

class Logger {
	constructor(config = {}) {
		this._logFileName = config.paths.log || path.join(__dirname, '../data/logs/application.log');

		let transports = [];

		if (config.debug) {
			transports.push(new(winston.transports.Console)({
						level: 'debug'
					}));
			transports.push(new(winston.transports.File)({
						filename: this._logFileName,
						level: 'debug'
					}));	
		} else {
			transports.push(new(winston.transports.Console)({
						level: 'info'
					}));	
			transports.push(new(winston.transports.File)({
						filename: this._logFileName,
						level: 'info'
					}));	
		}

		this._logger = new(winston.Logger)({
				transports: transports
			});
	}

    log() {
    	this._logger.log.apply(this._logger, arguments);
    }

    info() {
    	this._logger.info.apply(this._logger, arguments);
    }

    warn() {
    	this._logger.warn.apply(this._logger, arguments);
    }

    debug() {
    	this._logger.debug.apply(this._logger, arguments);
    }

    error() {
    	this._logger.error.apply(this._logger, arguments);
    }
}

module.exports = Logger;