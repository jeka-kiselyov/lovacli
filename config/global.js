module.exports = function() {

	return {
	    "name": "LA Marketing CLI Worker",
	    "version": "1.0.0",
	    "paths": {
	      "models": "app/models",
	      "commands": "app/commands",
	      "tests": "app/tests"
	    },
	    "errors": {
	      "displayStack": false,
	      "prefix": ""
	    },
	    "smtp": {
	      "host": "mailtrap.io",
	      "username": "0ce2800348ea0b",
	      "password": "215904ce877c49",
	      "port": "465",
	      "secure": false,
	      "filterExampleDotComEmails": true
	    }
	};

};