#!/usr/bin/env node

var rfr = require('rfr');
var prog = require('caporal');

var config = rfr('includes/config.js');

var initApplication = function(options) {
	options = options || {};

	config.updateConfig(options);

	var db = rfr('includes/db.js');
	var resources = rfr('includes/resources.js');
	var logger = rfr('includes/logger.js');

	application.logger = logger();
	application.db = db;

	prog
	  .version('1.0.0')
	  .logger(application.logger)
	  .description(config.name);

	resources.loadCommands().then(function(handlers){
		for (var k in handlers) {
			handlers[k].handler(prog);
		}

		prog.parse(process.argv);
	});
};

var exitApplication = function(options) {
	options = options || {};

	if (options instanceof Error) {
		options = {
			error: options
		};
	}

	if (options.error instanceof Error) {
		if (config.debug) {
			application.logger.error(options.error.stack);
		} else {
			application.logger.error(""+options.error);			
		}
	}

	process.exit();	
};

var handleCatcher = function(handler) {
	let newHandler = function(args, options, logger) {
		try {
			return handler(args, options, logger);
		} catch(e) {
			console.log(e);
		}
		return null;
	}

	return newHandler;
}

var application = {
	init: initApplication,
	exit: exitApplication,
	handleCatcher: handleCatcher,
	prog: prog
};

if (!module.parent) {
	initApplication();
} else {
	module.exports = application;
}


