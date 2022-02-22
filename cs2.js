/*
 * @Author       : lovefc
 * @Date         : 2022-02-22 10:00:33
 * @LastEditTime : 2022-02-22 10:00:49
 */
/*
var http = require('http');

var opt = {
 host:'127.0.0.1',
 port:'7890',
 method:'get',//这里是发送的方法
 path:'http://www.google.com.hk/',   //这里是访问的路径
 headers:{
'Accept-Language':'zh-CN,zh;q=0.8',
'Host':'www.google.com.hk'
 }
}

//以下是接受数据的代码
var body = '';
var req = http.request(opt, function(res) {
 res.on('data',function(d){
 body += d;
 }).on('end', function(){
 console.log(res.headers)
 console.log(body)
 });
 
}).on('error', function(e) {
 console.log("Got error: " + e.message);
})
req.end();

*/

const axios = require('axios');

let opts = {
   host: '127.0.0.1',
   port: 7890
}

axios.get('http://www.google.com.hk/', {proxy: opts}).then(function (response) {
    console.log(response);
});