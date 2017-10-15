var config = {
  user:'chenxiaoming',
  pass:'clm3613159',
  ip:'ds064198.mlab.com',
  port:'64198',
  database:'whater'
}
// var url = `mongodb://${config.user}:${config.pass}@${config.ip}:${config.port}/${config.database}`
// 			  mongodb://<dbuser>:<dbpassword>@ds064198.mlab.com:64198/whater

var url

if(process.env.NVM_HOME){
	console.log("dev kaifa");
  url = 'mongodb://127.0.0.1:27017/whater'
}else{
  console.log('production');
  url = "mongodb://"+config.user+":"+config.pass+"@"+config.ip+":"+config.port+"/"+config.database;
}
exports.url = url;



