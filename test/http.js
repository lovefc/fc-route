/*
 * @Author       : lovefc
 * @Date         : 2022-02-14 16:25:16
 * @LastEditTime : 2022-02-15 14:00:00
 */
const http = require('http');

const _router = require('../index');

let server = http.createServer();

let router = new _router();

//router.prefix('/app');

// 默认匹配页
router.all('/', function (req, res) {
	let postHTML = 'hello world';
	res.end(postHTML);
});

// 3. 绑定端口号，启动服务
server.listen(3002, function () {
	console.log('服务器3002启动成功，可以访问了。。。')
})

router.http(server);
