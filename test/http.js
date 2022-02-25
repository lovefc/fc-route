/*
 * @Author       : lovefc
 * @Date         : 2022-02-14 16:25:16
 * @LastEditTime : 2022-02-25 16:52:23
 */
const http = require('http');

const _router = require('../index');

let server = http.createServer();

let router = new _router();

//router.prefix('/');


// 默认匹配页
router.get('/@zm',function (req, res) {
	let postHTML = 'hello world';
	res.end(postHTML);
});


router.get(function (req, res) {
	let postHTML = '4\r\n';
	res.write(postHTML);
});

router.get(function (req, res) {
	let postHTML = '2\r\n';
	res.write(postHTML);
});

router.get(function (req, res) {
	let postHTML = '3\r\n';
	res.write(postHTML);
});



// 3. 绑定端口号，启动服务
server.listen(3002, function () {
	console.log('服务器3002启动成功，可以访问了。。。')
})

router.http(server);
