/*
 * @Author       : lovefc
 * @Blog         : http://lovefc.cn
 * @Email        : fcphp@qq.com
 * @Date         : 2022-02-19 21:29:20
 * @LastEditTime : 2022-02-20 00:46:46
 */

const request = require('./request.js');

let res = new request();

// 代理
res.url('https://lovefc.cn/').proxy('1993');

/*
(async function result() {
  let re = await res.url('http://lovefc.cn/').post('');
  console.log(re);
})()
*/