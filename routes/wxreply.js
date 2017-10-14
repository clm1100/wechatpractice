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
	// 微信输入信息都在req.weixin上
	var message = req.weixin;
	console.log(message);
	if (message.FromUserName === 'diaosi') {
		// 回复屌丝(普通回复)
		res.reply('hehe');
	} else if (message.FromUserName === 'text') {
		//你也可以这样回复text类型的信息
		res.reply({
			content: 'text object',
			type: 'text'
		});
	} else if (message.FromUserName === 'hehe') {
		// 回复一段音乐
		res.reply({
			type: "music",
			content: {
				title: "来段音乐吧",
				description: "一无所有",
				musicUrl: "http://mp3.com/xx.mp3",
				hqMusicUrl: "http://mp3.com/xx.mp3",
				thumbMediaId: "thisThumbMediaId"
			}
		});
	} else {
		// 回复高富帅(图文回复)
		res.reply([{
			title: '你来我家接我吧',
			description: '这是女神与高富帅之间的对话',
			picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
			url: 'http://nodeapi.cloudfoundry.com/'
		}]);
	}
}));




module.exports = router;