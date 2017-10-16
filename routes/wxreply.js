var express = require('express');
var router = express.Router();
var crypto = require("crypto");
var wechat = require('wechat');
var configWx = require('../config/config').wx;

var APPID = configWx.appid;
var SECRET = configWx.secret;

var config = {
	token: 'token',
	appid: APPID,
	encodingAESKey: '',
	checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

function sha1(str) {
	var md5sum = crypto.createHash("sha1");
	md5sum.update(str);
	str = md5sum.digest("hex");
	return str;
}

/* GET home page. */
router.get('/', function(req, res, next) {
	var query = req.query;
	var signature = query.signature;
	var echostr = query.echostr;
	var timestamp = query['timestamp'];
	var nonce = query.nonce;
	var oriArray = new Array();
	oriArray[0] = nonce;
	oriArray[1] = timestamp;
	oriArray[2] = "token"; //这里是你在微信开发者中心页面里填的token，而不是****
	oriArray.sort();
	var original = oriArray.join('');
	console.log("Original str : " + original);
	console.log("Signature : " + signature);
	var scyptoString = sha1(original);
	if (signature == scyptoString) {
		res.end(echostr);
		console.log("Confirm and send echo back");
	} else {
		res.end("false");
		console.log("Failed!");
	}
});



router.post('/', wechat(config, function(req, res, next) {
	console.log(req.weixin);
	res.reply("ok");
}));
// router.post('/', wechat(config, wechat.location(function (message, req, res, next) {
// 	console.log(req);
// 	res.reply("iiiiiiiiiiii")
// }).event(function (message, req, res, next) {
//   console.log(message);
//   res.reply('event')
// })
// ));


module.exports = router;