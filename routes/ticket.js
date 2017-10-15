var express = require('express');
var router = express.Router();
var request = require('request');
var configWx = require('../config/config').wx;
var configDomain = require('../config/config').domain;
var APPID = configWx.appid;
var SECRET = configWx.secret;
var mainUrl = `http://${configDomain}`;
var TicketDao = require('../models/ticket').Dao;
var AccessTokenDao = require('../models/access_token').Model;

router.get('/getsignature', function(reeq, res) {
	res.send('getsignature');
});
/*
1.根据appid获取ticket
2、查看是否存在ticket 不存在的话 请求接口获取
存在的话，拿出来，并判断时间,不过期直接使用,时间过期，重新请求
3、重新请求的话:
a.根据appid获取access_token
b、查看是否存在access_token 不存在的话 请求接口获取,存在的话，
判断时间，时间不过期直接使用，过期重新请求，抛出结果;
 */


function refreshToken(appid, secret, cb) {
	let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
	request(url, function(err, response, body) {
		if (body) {
			AccessTokenDao.findOne({
				appid: appid
			}, function(err, tokenData) {
				if (!tokenData) tokenData = new AccessTokenDao();
				let data = JSON.parse(body);
				tokenData.appid = appid;
				tokenData.access_token = data.access_token;
				tokenData.expires_in = data.expires_in;
				tokenData.at = parseInt(new Date().getTime() / 1000);
				tokenData.save(function(err) {
					cb(tokenData, err);
				})
			})
		} else {
			cb(null, err);
		}
	})
};

function getToken(appid, secret, cb) {
	AccessTokenDao.findOne({
		appid: appid
	}, function(err, data) {
		if (data) {
			let dif = data.at + 7000 - parseInt(new Date().getTime() / 1000);
			if (dif > 0) {
				cb(data, err)
			} else {
				refreshToken(appid, secret, function(data, err) {
					cb(data, err)
				})
			}
		} else {
			refreshToken(appid, secret, function(data, err) {
				cb(data, err);
			})
		}
	})
}

router.get('/token',function(req,res){
	getToken(APPID,SECRET,function(data,err){
		res.send(data);
	})
})

module.exports = router;