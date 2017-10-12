var express = require('express');
var router = express.Router();
var crypto = require("crypto");
var wechat = require('wechat');
var OAuth = require('wechat-oauth');
var superagent = require('superagent');
var request = require('request');
var client = new OAuth('wx75340481908402a8', '2b6ee0cbeec0114eb539e68ba356329b');
var APPID = "wx75340481908402a8";
var SECRET = "2b6ee0cbeec0114eb539e68ba356329b";

var config = {
  token: 'token',
  appid: 'wx75340481908402a8',
  encodingAESKey: '',
  checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};






function sha1(str) {
  var md5sum = crypto.createHash("sha1");
  md5sum.update(str);
  str = md5sum.digest("hex");
  return str;
}

router.get('/', function(req, res) {
  console.log(9999999999999999999999)
  var CODE = req.query.code;
// 根据code获取token
  var url = " https://api.weixin.qq.com/sns/oauth2/access_token?appid="+APPID+"&secret="+SECRET+"&code="+CODE+"&grant_type=authorization_code"
  request(url,function(error, response, body){
    // res.send(body);
    // var ACCESS_TOKEN  = body.access_token
    console.log("2222222222222222222222222",JSON.parse(body))
    var url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid="+APPID+"&grant_type=refresh_token&refresh_token="+JSON.parse(body).refresh_token;
    request(url,function(err,response,body){
      var obj = JSON.parse(body);
      var ACCESS_TOKEN = obj.access_token;
      var OPENID = obj.openid;
      // res.send(obj);
      var url = "https://api.weixin.qq.com/sns/userinfo?access_token="+ACCESS_TOKEN+"&openid="+OPENID+"&lang=zh_CN";
      request(url,function(err,response,body){
        res.json(body);
      })
    })
  })



  // client.getAccessToken(code, function(err, result) {
  //   var accessToken = result.data.access_token;
  //   var openid = result.data.openid;

  //   client.getUser(openid, function(err, result) {
  //     var userInfo = result;
  //     res.send({
  //       accessToken: accessToken,
  //       openid: openid,
  //       userInfo: userInfo
  //     });
  //   });
  // });

})


router.get('/pp', function(req, res) {
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



/* GET home page. */
router.get('/test', function(req, res, next) {
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



router.post('/test', wechat(config, function(req, res, next) {
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



router.get('/aouth', function(req, res) {
  var url = client.getAuthorizeURL('http://c882a3c7.ngrok.io/w', '300', 'snsapi_userinfo');
  var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+"wx75340481908402a8"+"&redirect_uri="+encodeURI('http://c882a3c7.ngrok.io/w')+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect "
  console.log(url);
  res.redirect(url);
});


router.get('/pc', function(req, res) {
  // var url = client.getAuthorizeURL('http://64fc4d25.ngrok.io/w', '300', 'snsapi_userinfo');
  // var url = client.getAuthorizeURL('http://c882a3c7.ngrok.io/w/pp', '300', 'snsapi_base');
  // console.log(url);
  var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+"wx75340481908402a8"+"&redirect_uri="+encodeURI('http://c882a3c7.ngrok.io/w/pp')+"&response_type=code&scope=snsapi_base&state=123#wechat_redirect"
  res.redirect(url);



})


module.exports = router;
