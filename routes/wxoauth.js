var express = require('express');
var router = express.Router();
var crypto = require("crypto");
var wechat = require('wechat');
var OAuth = require('wechat-oauth');
var superagent = require('superagent');
var request = require('request');
var configWx = require('../config/config').wx;
var configDomain = require('../config/config').domain;
var APPID = configWx.appid;
var SECRET = configWx.secret;
var client = new OAuth(APPID, SECRET);
var mainUrl = `http://${configDomain}`;

console.log(mainUrl);

router.get('/infocb', function(req, res) {
	var CODE = req.query.code;
	// 根据code获取token
	var url = " https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + APPID + "&secret=" + SECRET + "&code=" + CODE + "&grant_type=authorization_code"
	request(url, function(error, response, body) {
		// res.send(body);
		// var ACCESS_TOKEN  = body.access_token
		console.log(JSON.parse(body))
		var url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=" + APPID + "&grant_type=refresh_token&refresh_token=" + JSON.parse(body).refresh_token;
		request(url, function(err, response, body) {
			var obj = JSON.parse(body);
			var ACCESS_TOKEN = obj.access_token;
			var OPENID = obj.openid;
			// res.send(obj);
			var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + ACCESS_TOKEN + "&openid=" + OPENID + "&lang=zh_CN";
			request(url, function(err, response, body) {
				res.json(body);
			})
		})
	})

})


router.get('/basecb', function(req, res) {
	var code = req.query.code;
	client.getAccessToken(code, function(err, result) {
		var accessToken = result.data.access_token;
		var openid = result.data.openid;

		res.send({
			accessToken: accessToken,
			openid: openid,
		});
	});

})



router.get('/info', function(req, res) {
	// var url = client.getAuthorizeURL('http://c882a3c7.ngrok.io/w', '300', 'snsapi_userinfo');
	var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + encodeURI(mainUrl+'/oauth/infocb') + "&response_type=code&scope=snsapi_userinfo&state=300#wechat_redirect "
	console.log(url);
	res.redirect(url);
});


router.get('/base', function(req, res) {
	var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + encodeURI(mainUrl+'/oauth/basecb') + "&response_type=code&scope=snsapi_base&state=123#wechat_redirect"
	res.redirect(url);

})


module.exports = router;