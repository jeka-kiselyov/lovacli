var rfr = require('rfr');
var db = rfr('includes/db.js');
db.requireDialect('mysql');
var Promise = require('bluebird');

module.exports = function(sequelize, DataTypes) {
	var model = sequelize.define('Sample', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(255)
		}
	}, {
		timestamps: false,
		freezeTableName: true,
		tableName: 'd_deals'
	});

	// model.someMethod = function() { }    //// db.Sample.someMethod()
	// model.prototype.someMethod = function() { } /// instance.someMethod()

	return model;
};
