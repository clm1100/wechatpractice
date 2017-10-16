var express = require('express');
var router = express.Router();
var request = require('request');
var sha1  = require('sha1');
var configWx = require('../config/config').wx;
var configDomain = require('../config/config').domain;
var APPID = configWx.appid;
var SECRET = configWx.secret;
var mainUrl = `http://${configDomain}`;
var TicketDao = require('../models/ticket').Model;
var AccessTokenDao = require('../models/access_token').Model;


var signature = require('wx_jsapi_sign');
var config = require('../config')();


// router.post('/getsignature', function(req, res){
//   var url = req.body.url;
//   console.log(url);
//   signature.getSignature(config)(url, function(error, result) {
//         if (error) {
//             res.json({
//                 'error': error
//             });
//         } else {
//             res.json(result);
//         }
//     });
// });




router.post('/getsignature', function(req, res) {
	var page = req.body.url;
	TicketDao.findOne({
		appid: APPID
	}, function(err, ticket) {
		if (ticket) {
			let dif = ticket.at + 7000 - parseInt(new Date().getTime() / 1000);
			if (dif > 0) {

				var json = ticket.toJSON();
				var timestamp = parseInt(new Date().getTime() / 1000);
				json.at = timestamp;
				json.signature = wechatSignature(json, page,timestamp);
				res.json(json);

			} else {
				refreshTicket(APPID, SECRET, page, ticket,function(data) {
				console.log("wwwwwww");
				res.json(data);
			})
			}

		} else {
			refreshTicket(APPID, SECRET, page, ticket,function(data) {
				console.log("=====================");
				res.json(data);
			})
		}
	})
});

router.get('/token', function(req, res) {
	getToken(APPID, SECRET, function(data, err) {
		res.send(data);
	})
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

/* 微信签名实现 */
function wechatSignature(t, page,timestamp) {
	// var string = 'jsapi_ticket=' + t.ticket + '&noncestr=' + t.noncestr + '&timestamp=' + timestamp + '&url=' + page;
	var string = `jsapi_ticket=${t.ticket}&noncestr=${t.noncestr}&timestamp=${timestamp}&url=${page}`;
	return sha1(string);
}

function refreshTicket(appid, secret, page,ticket, cb) {
	let t = ticket ? ticket:new TicketDao();
	getToken(appid, secret, function(data, err) {
		let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${data.access_token}&type=jsapi`;
		request(url, function(err, response, body) {
			let data =  JSON.parse(body);
			let timestamp =parseInt(new Date().getTime()/1000);
			t.ticket = data.ticket;
			t.appid = APPID;
			t.at = timestamp;
			t.noncestr = sha1(new Date());
			t.expires_in = data.expires_in;
			var signature = wechatSignature(t, page,timestamp);
			// cb(signature);
			t.save(function(err){
				let json = t.toJSON();
				json.signature = signature;
				cb(json)
			})
		})
	})
}

module.exports = router;