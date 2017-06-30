var fs = require('fs');
var rfr = require('rfr');
var Promise = require('bluebird');
var path = require('path');
var log = rfr('includes/logger.js');
var config = rfr('includes/config.js');

var walk = function(dir, done) {
	var results = [];
	fs.readdir(dir, function(err, list) {
		if (err) {
			return done(err);
		}
		var i = 0;
		(function next() {
			var file = list[i++];
			if (!file) {
				return done(null, results);
			}
			file = dir + '/' + file;
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function(err, res) {
						results = results.concat(res);
						next();
					});
				} else {
					if (file.slice(-3) === '.js') {
						results.push(file);
					}
					next();
				}
			});
		})();
	});
};

var loadModelsPaths = function(dirname) {
	dirname = dirname || config.paths.models;

	return new Promise(function(resolve, reject) {
		var absPath = path.join(rfr.root, dirname);
		walk(absPath, function(err, results) {
			if (err) {
				return reject(err);
			}

			resolve(results);
		});
	});
};
exports.loadModelsPaths = loadModelsPaths;

exports.loadModels = function(dirname) {
	dirname = dirname || config.paths.models;
	return new Promise(function(resolve, reject) {
		loadModelsPaths(dirname).then(function(paths){
			var models = [];
			paths.forEach(function(file){
				var inc = require(file);

				if (inc && typeof inc == 'function') {
					models.push(inc);
				} else {
					log.error('Error: resources: Bad code in '+file+' model');					
				}
			});

			resolve(models);			
		});
	});
};


exports.loadCommands = function(dirname) {
	dirname = dirname || config.paths.commands;
	return new Promise(function(resolve, reject) {
		var absPath = path.join(rfr.root, dirname);
		walk(absPath, function(err, results) {
			if (err) {
				return reject(err);
			}

			var commands = [];
			results.forEach(function(file){
				var name = file.substr(file.lastIndexOf('/'), file.indexOf('.'));
				var inc = require(file);

				if (inc && 'handler') {
					commands.push({
						handler: inc.handler
					});
				} else {
					log.error('Error: resources: Bad code in '+file+' command');
				}
			});

			resolve(commands);
		});
	});
};