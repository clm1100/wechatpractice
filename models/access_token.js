var MongooseDao = require('mongoosedao');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId
var AccessTokenSchema = new Schema({
    appid: {
        type: String,
        trim: true,
        required: true
    },
    access_token: {
        type: String,
        trim: true
    },
    expires_in: Number,
    at: {
        type: Number,
        default: parseInt(new Date().getTime() / 1000)
    },
    create_at: {
        type: Date,
        default: Date.now
    }
});
var AccessTokenModel = mongoose.model('AccessTokenModel', AccessTokenSchema);

var Dao = new MongooseDao(AccessTokenModel);

module.exports = {
    Model: AccessTokenModel,
    Dao: Dao
};