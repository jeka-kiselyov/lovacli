var prog = require('caporal');
var rfr = require('rfr');
var db = rfr('includes/db.js');

exports.handler = function(prog) {
	return prog.command('test', 'Test CLI framework')
		.argument('<something>', 'Just some random parameter')
		.action(function(args, options, logger) {
			logger.info("Here we are")

			db.init().then(function(db){
				db.Sample.findOne().then(function(item){
					console.log('Test found item in db. ID is: '+item.id);

					process.exit();
				}).catch(function(e){
					logger.error(e);
				})

			});
		});
};