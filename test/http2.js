const _router = require('../index');

let router = new _router();

const http2 = require('http2');

const fs = require('fs');

const server = http2.createSecureServer({
    key: fs.readFileSync(__dirname+'/server.key'),
    cert: fs.readFileSync(__dirname+'/server.crt'),
});

//router.prefix('/app');

// 默认匹配页
router.all('/', function (req, res) {
	let postHTML = 'hello world';
	res.end(postHTML);
});

router.http(server);

//https默认de监听端口时443，启动1000以下的端口时需要sudo权限
server.listen(443, function(err){  
     console.log("https listening on port: 443");
});