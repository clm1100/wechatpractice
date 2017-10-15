var MongooseDao = require('mongoosedao');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId
var TicketnSchema = new Schema({
    appid: {
        type: String,
        trim: true,
        required: true
    },
    ticket: {
        type: String,
        trim: true
    },
    noncestr: {
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
var TicketnModel = mongoose.model('TicketnModel', TicketnSchema);

var Dao = new MongooseDao(TicketnModel);

module.exports = {
    Model: TicketnModel,
    Dao: Dao
};