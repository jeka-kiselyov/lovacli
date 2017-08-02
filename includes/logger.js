var rfr = require('rfr');
var path = require('path');
var winston = require('winston');
var config = rfr('includes/config.js');

var __loggers = {};

var getLogger = function(location) {
	location = location || config.paths.log || path.join(rfr.root, 'data/logs/application.log');

	if (__loggers[location]) {
		return __loggers[location];
	}

	var transports = [];


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

	__loggers[location].debug('New Logger instance created');

	return __loggers[location];
};


module.exports = getLogger;