var mongoose = require("mongoose");

// var db = mongoose.connect("mongodb://127.0.0.1:27017/db_helloworld"); 

// 核心代码，是否开启测试

var url = require('../config/mongodbConfig.js').url;

if(process.env.NVM_HOME){
	mongoose.set('debug', true);
}else{
	mongoose.set('debug', false);
}

var db = mongoose.connect(url,{useMongoClient:true},function(err){
	if(!err){
		console.log("连接成功ok")
	}
});

// db.connection.on("error", function (error) {  
//   console.log("error：" + error); 
// }); 

// db.connection.on("open", function () {  
//   console.log("start");
// });