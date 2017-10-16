var express = require('express');
var router = express.Router();
var OAuth = require('wechat-oauth');
var request = require('request');
var configWx = require('../config/config').wx;
var configDomain = require('../config/config').domain;
var APPID = configWx.appid;
var SECRET = configWx.secret;
var client = new OAuth(APPID, SECRET);
var mainUrl = `http://${configDomain}`;

var UserModel = require('../models/user').UserModel;

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

		if (!err) {
			res.send(result);
		} else {
			res.send("报错了");
		}
	});

})



router.get('/info', function(req, res) {
	// var url = client.getAuthorizeURL('http://c882a3c7.ngrok.io/w', '300', 'snsapi_userinfo');
	var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + encodeURI(mainUrl + '/oauth/infocb') + "&response_type=code&scope=snsapi_userinfo&state=300#wechat_redirect "
	console.log(url);
	res.redirect(url);
});


router.get('/base', function(req, res) {
	var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + encodeURI(mainUrl + '/oauth/basecb') + "&response_type=code&scope=snsapi_base&state=123#wechat_redirect"
	res.redirect(url);

})


router.get('/login', function(req, res) {
	// var url = client.getAuthorizeURL('http://c882a3c7.ngrok.io/w', '300', 'snsapi_userinfo');
	var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + encodeURI(mainUrl + '/oauth/logincb') + "&response_type=code&scope=snsapi_userinfo&state=300#wechat_redirect "
	console.log(url);
	res.redirect(url);
});

router.get('/logincb', function(req, res) {
	var CODE = req.query.code;
	// 根据code获取token
	var url = " https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + APPID + "&secret=" + SECRET + "&code=" + CODE + "&grant_type=authorization_code"
	request(url, function(error, response, body) {
		// res.send(body);
		// var ACCESS_TOKEN  = body.access_token
		// res.json(JSON.parse(body));
		let obj = JSON.parse(body);
		let openid = obj.openid;
		UserModel.findOne({
			openid: openid
		}, function(err, result) {
			if (!!result) {
				res.json(result);
			} else {
				let user = new UserModel();
				let url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=" + APPID + "&grant_type=refresh_token&refresh_token=" + obj.refresh_token;
				request(url, function(err, response, body) {
					let obj = JSON.parse(body);
					let ACCESS_TOKEN = obj.access_token;
					let OPENID = obj.openid;
					// res.send(obj);
					let url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + ACCESS_TOKEN + "&openid=" + OPENID + "&lang=zh_CN";
					request(url, function(err, response, body) {
						let obj = JSON.parse(body);
						user.openid = obj.openid;
						user.nickname = obj.nickname;
						if(!user.username){user.username=obj.nickname};
						user.language = obj.language;
						user.city = obj.city;
						user.province = obj.province;
						user.country = obj.country;
						user.headimgurl = obj.headimgurl;
						if(!user.headurl){user.headurl=obj.headimgurl};
						user.privilege = obj.privilege;
						user.sex = obj.sex;
						user.save(function(err){
							if(!err){
								res.json(user);
							}else{
								res.send("报错了");
							}
						})
					})
				})

			}
		})
	})

})



module.exports = router;