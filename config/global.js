const path = require('path');

module.exports = function() {

	return {
	    "name": "LovaCLISampleApp",
	    "debug": true,
	    "version": "1.0.0",
	    "paths": {
	      "models": path.join(__dirname, "../app/models"),
	      "commands": path.join(__dirname, "../app/commands"),
	      "tests": path.join(__dirname, "../app/tests")
	    },
	  //   "database": {
			// "dialect": 'mongodb',
			// "host": 'localhost',
			// "database": 'mongodb://localhost/test',
			// "username": 'root',
			// "password": 'root'
	  //   },
	    "database": {
			"dialect": 'mysql',
			"host": 'localhost',
			"database": 'avg',
			"username": 'root',
			"password": 'root'
	    }
	};

};
