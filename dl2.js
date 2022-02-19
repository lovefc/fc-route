/*
 * @Author       : lovefc
 * @Blog         : http://lovefc.cn
 * @Email        : fcphp@qq.com
 * @Date         : 2022-02-19 21:29:20
 * @LastEditTime : 2022-02-20 00:23:24
 */

const request = require('./request.js');

let res = new request();
// 代理
//res.proxy('8000');

(async function result() {
  let re = await res.url('http://lovefc.cn/').post('');
  console.log(re);
})()