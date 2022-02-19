var httpsModule = require('https');

var fs = require('fs');

const _router = require('fc-route');

let router = new _router();

var https = httpsModule.Server({
     key: fs.readFileSync(__dirname+'/server.key'),
     cert: fs.readFileSync(__dirname+'/server.crt')
});

//router.prefix('/app');

// 默认匹配页
router.all('/', function (req, res) {
	let postHTML = 'hello world';
	res.end(postHTML);
});

router.http(https);


//https默认de监听端口时443，启动1000以下的端口时需要sudo权限
https.listen(443, function(err){  
     console.log("https listening on port: 443");
});