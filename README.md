<h1 align="center">fc-route</h2=1>

<p align="center">
 <img src="https://img.shields.io/badge/node-route-yellow.svg?style=plastic&logo=Node.js" alt="Coverage Status">
 <img src="https://img.shields.io/badge/License-Mit-blue.svg?style=plastic&logo=npm" alt="Coverage Status">
</p>
<h3 align="center">
 一个轻便高效的node原生路由
</h3>
<h4 align="center">
支持原生node的http，https，http2模块，经过高并发测试，性能优越，精确匹配，使用方便
</h4>    

##

### 安装npm包
```
npm install fc-route
```
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


## 更新记录

### 2023/10/06
~0.0.5 => 现在不用担心使用原生http，处理逻辑写错了会中断了进程,另外新加了`res.json`来帮你快速输出json格式~
功能已废弃，分出独立的http工具类。

### 2025/03/24
0.0.6 => 更新了query参数规则，可以获取index?a=2
```
router.get('/index/%page',async function (req, res) {
    console.log(req.params);
    // 如果访问http://xxx.xx/index/10?a=1,将会获取到这样的值，{ page: '10', a : '1' },前面定义的name会覆盖后面的name
    res.end('hello world');
});
```

### 2025/04/13
0.0.7 => 不再支持koa模式,彻底删除koa兼容，分出独立的http工具类提供使用。
具体参考使用demo

### 2025/04/16
0.0.8 => 若干优化，强烈建议更新到此版本
建议搭配此库：[https://github.com/lovefc/fc-response-demo](https://github.com/lovefc/fc-response-demo)

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022-[lovefc](http://lovefc.cn)