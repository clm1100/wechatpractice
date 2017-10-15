var MongooseDao  = require('mongoosedao');
var mongoose 	 = require('mongoose');
var _            = require('lodash');
var bcrypt       = require('bcryptjs');
var Schema 		 = mongoose.Schema;
var ObjectId 	 = mongoose.Schema.Types.ObjectId
var UserSchema = new Schema({
		username: 			{ type: 'string' },
		password: 			{ type: 'string' },
		encrypted_password: { type: 'string' },
		headurl: 			{ type: 'string' },
		power: 				{ type: Number,default:1 },
		sex: 				{ type: Number }   
});

var lastMod = require('./lastMod');

UserSchema.plugin(lastMod, { index: true });
// 默认返回结果没有这个属性,但是在访问时会显示出来;

UserSchema.virtual('sex_to_s').get(function() {
if(this.sex === 0) return '女';
if(this.sex === 1) return '男';
return '未知';
});

/*为了配合passport*/
UserSchema.methods.checkPassword = function(password) {
return bcrypt.compareSync(password, this.encrypted_password);
};

UserSchema.pre('save', function(next) {
	console.log("我是模块")
if(!_.isEmpty(this.password)) {
  var salt = bcrypt.genSaltSync(10);
  this.encrypted_password = bcrypt.hashSync(this.password, salt);
  this.password = undefined;

  next();
} else next();
});





var UserModel = mongoose.model('UserModel', UserSchema);

var Dao 	  = new MongooseDao(UserModel);
 
module.exports = {
 UserModel:UserModel,
 Dao:Dao
};