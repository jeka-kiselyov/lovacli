const fs = require('fs');
const path = require('path');

const resources = require(path.join(__dirname, '../includes/resources.js'));
const config = require(path.join(__dirname, '../includes/config.js'));

let db = {};
let log = require(path.join(__dirname, '../includes/logger.js'))();

let init = function() {
	return new Promise(function(resolve, reject) {
		let initialize = null;
		if (config.database && config.database.dialect == 'mongodb') {
			initialize = require(path.join(__dirname, '../includes/db/mongodb.js')).init;
		} else if (config.database && config.database.dialect == 'mysql') {
			initialize = require(path.join(__dirname, '../includes/db/mysql.js')).init;
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


let getDocument = function(documentOrId, documentType) {
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

let getDocumentId = function(documentOrId) {
	if (documentOrId && documentOrId.constructor.name === 'model') {
		// object is mongoose object
		return mongoose.Types.ObjectId(documentOrId.id);
	} else {
		return mongoose.Types.ObjectId(documentOrId);
	}
};

let isIdsEquals = function(documentOrId1, documentOrId2) {
	return (getDocumentId(documentOrId1).equals(getDocumentId(documentOrId2)));
}

let requireDialect = function(dialect) {
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