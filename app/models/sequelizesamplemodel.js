

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
		tableName: 'mt_li_profiles'
	});

	// model.someMethod = function() { }    //// db.Sample.someMethod()
	// model.prototype.someMethod = function() { } /// instance.someMethod()

	return model;
};
