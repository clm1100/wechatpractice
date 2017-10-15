var MongooseDao  = require('mongoosedao');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId
var CategorySchema = new Schema({
		name: 				{ type: 'string' },
		createdate: 		{ type: Date, default: Date.now },
		headurl: 			{ type: 'string' },
		ordernumber: 		{ type: Number,default:1 },
		user:   			{ type: ObjectId,ref: 'UserModel'}
});
var CategoryModel = mongoose.model('CategoryModel', CategorySchema);

var Dao   		  = new MongooseDao(CategoryModel);
 
module.exports = {
 CategoryModel:CategoryModel,
 Dao:Dao
};