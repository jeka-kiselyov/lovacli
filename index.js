#!/usr/bin/env node

var rfr = require('rfr');
var config = rfr('includes/config.js');
var db = rfr('includes/db.js');
var logger = rfr('includes/logger.js');

var resources = rfr('includes/resources.js');

var prog = require('caporal');

var initApplication = function(options) {
	options = options || {};

	config.updateConfig(options);

	prog
	  .version('1.0.0')
	  .logger(logger)
	  .description(config.name);

	resources.loadCommands().then(function(handlers){
		for (var k in handlers) {
			handlers[k].handler(prog);
		}

		prog.parse(process.argv);	
	});
};

if (!module.parent) {
	initApplication();
} else {
	module.exports = {
		init: initApplication,
		db: db,
		prog: prog
	};
}


