var MongooseDao = require('mongoosedao');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId
var QiniuSchema = new Schema({
	appid: {
		type: 'string'
	},
	token: {
		type: 'string'
	},
	createdate: {
		type: Date,
		default: Date.now
	},
	at: {
		type: Number,
		default: parseInt(new Date().getTime() / 1000)
	},
	expires_in: {
		type: Number
	}
});
var QiniuModel = mongoose.model('QiniuModel', QiniuSchema);

var Dao = new MongooseDao(QiniuModel);

module.exports = {
	QiniuModel: QiniuModel,
	Dao: Dao
};