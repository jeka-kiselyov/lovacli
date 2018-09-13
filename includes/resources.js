const fs = require('fs');
const path = require('path');
const config = require(path.join(__dirname, '../includes/config.js'));
const log = require(path.join(__dirname, '../includes/logger.js'))();

let walk = function(dir, done) {
	let results = [];
	fs.readdir(dir, function(err, list) {
		if (err) {
			return done(err);
		}
		let i = 0;
		(function next() {
			let file = list[i++];
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

let loadModelsPaths = function(dirname) {
	dirname = dirname || config.paths.models;

	return new Promise(function(resolve, reject) {
		walk(dirname, function(err, results) {
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
			let models = [];
			paths.forEach(function(file){
				let inc = require(file);

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

		walk(dirname, function(err, results) {
			if (err) {
				return reject(err);
			}

			let commands = [];
			results.forEach(function(file){
				let name = file.substr(file.lastIndexOf('/'), file.indexOf('.'));
				let inc = require(file);

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
