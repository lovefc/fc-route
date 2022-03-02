<h1 align="center">fc-route</h2=1>

<p align="center">
 <img src="https://img.shields.io/badge/node-route-yellow.svg?style=plastic&logo=Node.js" alt="Coverage Status">
 <img src="https://img.shields.io/badge/License-Mit-blue.svg?style=plastic&logo=npm" alt="Coverage Status">
</p>
<h3 align="center">
 一个轻便高效的node路由
</h3>
<h4 align="center">
支持原生node的http，https，http2模块，支持koa框架，经过高并发测试，性能优越，精确匹配，使用方便
</h4>    

****

## 使用方法

### http：
```
const http = require('http');
let server = http.createServer();
const _router = require('fc-route');
let router = new _router();
router.get('/',function (req, res) {
	res.end('hello world');
});

router.http(server);
server.listen(3000, function () {
	console.log('服务器3000启动成功，可以访问了。。。')
})
```
### https：
```
const https = require('https');
const fs = require('fs');
const  server = https.Server({
    key: fs.readFileSync(__dirname+'/server.key'),
    cert: fs.readFileSync(__dirname+'/server.crt'),
});
const _router = require('fc-route');
let router = new _router();
router.get('/',function (req, res) {
	res.end('hello world');
});

router.http(server);
server.listen(3001, function () {
	console.log('服务器3001启动成功，可以访问了。。。')
})
```
### http2：
```
const http2 = require('http2');
const fs = require('fs');
const server = http2.createSecureServer({
    key: fs.readFileSync(__dirname+'/server.key'),
    cert: fs.readFileSync(__dirname+'/server.crt'),
});
const _router = require('fc-route');
let router = new _router();
router.get('/',function (req, res) {
	res.end('hello world');
});

router.http(server);
server.listen(3002, function () {
	console.log('服务器3002启动成功，可以访问了。。。')
})
```
### koa：
```
const Koa = require('koa');
const app = new Koa();
const _router = require('fc-route');
let router = new _router();
router.get('/',function (req, res) {
	res.end('hello world');
});

router.http(app);
server.listen(3004, function () {
	console.log('服务器3004启动成功，可以访问了。。。')
})
```
>更多使用demo请看这里 >>> [戳这里](https://github.com/lovefc/fc-route-demo)
## 路由方法
|   方法  |   说明  |
| --- | --- |
|   get  |    router.get('/',function (req, res){})  |
|   post  |    router.post('/',function (req, res){})  |
|  head |    router.head('/',function (req, res){})  |
|  options  |    router.options('/',function (req, res){})  |
|    put  |    router.put('/',function (req, res){})  |
|    patch  |    router.patch('/',function (req, res){})  |
|    delecte |    router.delecte('/',function (req, res){})  |
|    all  |    router.all('/',function (req, res){})  |

> all方法匹配所有，请谨慎使用
> 为了安全考虑，一些特殊的http方法并没有做适配

## 路由匹配符
|   匹配符号  |    作用  | 代码  |
| --- | --- | --- |
|   %   |    匹配数字  | router.get('/%value',function (req, res){})  |
|   @  |    匹配大小写  | router.get('/@value',function (req, res){})  |
|   :  |    匹配大小写数字  | router.get('/:value',function (req, res){})  |
|   !  |    匹配中文  | router.get('/!value',function (req, res){})  |
|   ~  |    匹配以上全部  | router.get('/~value',function (req, res){})  |
> ~匹配所有字符串,此项能匹配以上的所有路由,请放在第二匹配上,第一匹配请不要用,请慎重选择

## 匹配取参数

```
router.get('/%sz/@zm', function (req, res) {
	let { sz, zm } = req.params;
	res.end('数字:'+sz+'，字母:'+zm);
});
```
## 全局设置
```
router.get(function (req, res) {
	res.write('所有的get方法，这里都会输出');
});
```

## 设置路由前缀

```
router.prefix('/app')
```
## 精确匹配原则
>当你设置两行规则的时候，会优先匹配最精准的路由
```
router.get('/%sz/@zm', function (req, res) {
	let { sz, zm } = req.params;
	res.end('数字:'+sz+'，字母:'+zm);
});
router.get('/6/@zm', function (req, res) {
	let { zm } = req.params;
	res.end('字母:'+zm);
});
```
> 按照一般的路由匹配，上面那个匹配肯定会覆盖下面的，实际上则不然，当你第二个参数为6的时候，只会匹配第二个
> 这个精确匹配功能koa的路由并不具备，无需担心效率，内部有缓存机制

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022-[lovefc](http://lovefc.cn)
