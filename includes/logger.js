var rfr = require('rfr');
var path = require('path');
var winston = require('winston');
var config = rfr('includes/config.js');

var transports = [];

transports.push(new(winston.transports.File)({
			filename: path.join(rfr.root, 'data/logs/application.log'),
			level: 'info'
		}));

if (config.debug) {
	transports.push(new(winston.transports.Console)({
				level: 'debug'
			}));	
} else {
	transports.push(new(winston.transports.Console)({
				level: 'error'
			}));	
}

var logger = new(winston.Logger)({
	transports: transports
});

module.exports = logger;