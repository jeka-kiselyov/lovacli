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

	process.exit();	
};

var application = {
	init: initApplication,
	exit: exitApplication,
	prog: prog
};

if (!module.parent) {
	initApplication();
} else {
	module.exports = application;
}


