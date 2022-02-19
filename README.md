**HttpBody解析类库--fc-body** 

- Http请求体解析,支持多文件,支持类型限制,body大小限制,简单优雅,快速高效

**如何安装：** 

````
npm install fc-body

````

**如何使用：** 
```
//  promise对象
const fc_body = require('fc-body');
let body = new fc_body({isAutoSaveFile: true, savePath: __dirname+"/upload"});
let post = '';
http.createServer(async (req,res) => {
    try {
       post = await body.getBody(req);
       console.log(post);
    } catch (e) {
       console.log(e);
    }
});
```
**option参数：** 

| 参数 |类型| 空 | 默认 | 备注 |
|----    |-------    |--- |---|------      | 
| type | string | 是  |  空 |  限制上传类型，多个用,号分割(不区分大小写),为空不限制  |
| isAutoSaveFile | bool |否  | false  | 是否保存文件   |
| savePath | string | 否 | os.tmpdir() | 保存目录 |
| minSize   | int,float | 否   | 0   |  上传文件的最小M数   |
| maxSize  | int,float | 否   | 5   |  上传文件的最大M数   |
| errorMsg | object | 否 |  {'TIMEOUT':'POST超时','UNDERSIZE':'数据过小','OVERSIZE':'数据过大','NOTALLOWEDTYPE':'不允许的类型'} | 错误消息|

**使用参考**

* Koa2参考实例 : [test/koa.js](test/koa.js)
* Htpp参考实例 : [test/http.js](test/http.js)

**作者备注**
- 如果发现问题，欢迎向我反馈，毕竟一个人测试有限，会有注意不到的地方。
- 作者QQ：1102952084
- 作者博客：lovefc.cn