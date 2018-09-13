// var db = rfr('includes/db.js');
// db.requireDialect('mongodb');

module.exports = function(mongoose, connection) {
	var modelName = 'Sample';
	var schema = mongoose.Schema({
	    name: String,
	    for: String
	}, 
	{ collection: 'sizes' });

	// schema.virtual('APIValues').get(function () {    });  //// - item.APIValues
	// schema.statics.getActive = function() {   };			///// - db.Size.getActive()
	// schema.methods.updateSomething = function() {   };   ///// - item.updateSomething()
	//                                                      ///// more: http://mongoosejs.com/docs/guide.html

	var model = connection.model(modelName, schema);
	return {
		'modelName': modelName,
		'model': model
	};
};