const path = require('path');
const winston = require('winston');
const config = require(path.join(__dirname, '../includes/config.js'));

let __loggers = {};

let getLogger = function(location) {

	location = location || config.paths.log || path.join(__dirname, '../data/logs/application.log');

	if (__loggers[location]) {
		return __loggers[location];
	}

	let transports = [];

	if (config.debug) {
		transports.push(new(winston.transports.Console)({
					level: 'debug'
				}));
		transports.push(new(winston.transports.File)({
					filename: location,
					level: 'debug'
				}));	
	} else {
		transports.push(new(winston.transports.Console)({
					level: 'error'
				}));	
		transports.push(new(winston.transports.File)({
					filename: location,
					level: 'info'
				}));	
	}

	__loggers[location] = new(winston.Logger)({
		transports: transports
	});

	// __loggers[location].debug('New Logger instance created');

	return __loggers[location];
};


module.exports = getLogger;