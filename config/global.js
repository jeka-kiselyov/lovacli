const rfr = require('rfr');
const path = require('path');

module.exports = function() {

	return {
	    "name": "LovaCLISampleApp",
	    "version": "1.0.0",
	    "paths": {
	      "models": path.join(rfr.root, "app/models"),
	      "commands": path.join(rfr.root, "app/commands"),
	      "tests": path.join(rfr.root, "app/tests")
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
