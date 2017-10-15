var MongooseDao = require('mongoosedao');
var mongoose = require('mongoose');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var lastMod = require('./lastMod');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId
var ImageSchema = new Schema({
	Imagename: {
		type: 'string'
	},
	category: {
		type: ObjectId,
		ref: 'CategoryModel'
	},
	user: {
		type: ObjectId,
		ref: 'UserModel'
	},
	url: {
		type: 'string'
	},
});


ImageSchema.plugin(lastMod, {
	index: true
});

ImageSchema.virtual('original').get(function() {
	// return this.url ? cloudUrl + 'message/' + (this.from.nickname ? this.from.id : this.from) + '/' + this.photo + '!cover' : null;
	return "1000";
});

var ImageModel = mongoose.model('ImageModel', ImageSchema);

var Dao = new MongooseDao(ImageModel);

module.exports = {
	ImageModel: ImageModel,
	Dao: Dao
};