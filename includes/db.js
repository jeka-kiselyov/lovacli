var fs = require('fs');
var path = require('path');
var rfr = require('rfr');
var basename = path.basename(module.filename);
var resources = rfr('includes/resources.js');
var config = rfr('includes/config.js');
var Promise = require("bluebird");
var db = {};

var log = rfr('includes/logger.js')();

var init = function() {
	return new Promise(function(resolve, reject) {
		if (config.database.dialect == 'mongodb') {
			var initialize = rfr('includes/db/mongodb.js').init;
		} else if (config.database.dialect == 'mysql') {
			var initialize = rfr('includes/db/mysql.js').init;
		} else {
			return reject('Invalid database dialect in config');
		}

		initialize().then(function(models){
			for (var k in models) {
				db[k] = models[k];
			}
			resolve(db);
		}).catch(reject);
	});
};


var getDocument = function(documentOrId, documentType) {
	return new Promise(function(resolve, reject) {
		if (documentOrId instanceof db[documentType]) {
			resolve(documentOrId);
		} else {
			db[documentType].findById(documentOrId).then(function(document){
				resolve(document);
			}).catch(function(e){
				resolve(null);
			});
		}
	});
};

var getDocumentId = function(documentOrId) {
	if (documentOrId && documentOrId.constructor.name === 'model') {
		// object is mongoose object
		return mongoose.Types.ObjectId(documentOrId.id);
	} else {
		return mongoose.Types.ObjectId(documentOrId);
	}
};

var isIdsEquals = function(documentOrId1, documentOrId2) {
	return (getDocumentId(documentOrId1).equals(getDocumentId(documentOrId2)));
}

var requireDialect = function(dialect) {
	if (config.database.dialect != dialect) {
		throw ''+dialect+' is required';
	}
}


db.requireDialect = requireDialect;
db.isIdsEquals = isIdsEquals;
db.getDocumentId = getDocumentId;
db.getDocument = getDocument;
db.init = init;
module.exports = db;