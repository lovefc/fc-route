/*
 * @Author       : lovefc
 * @Date         : 2021-03-17 16:39:17
 * @LastEditTime : 2025-04-16 18:19:40
 */

const _querystring = require('querystring');
const _url = require('url');
const _fs = require("fs");
const _path = require("path");

class route {

	// 构造函数
	constructor() {
		this.routeRule = {};
		this.params = {};
		this.routeCache = {};
		this.prefixStr = '';
		this.routeSort = 0;
		this.methods = [
			'HEAD',
			'OPTIONS',
			'GET',
			'PUT',
			'PATCH',
			'POST',
			'DELETE',
			'ALL'
		];
		this.notPage = function (res) {
			let body = '<html><head><title>404 Not Found</title></head><body style="width:100%;height:100%;top:45%;position:relative;overflow:hidden;"><center><h1>404 Not Found</h1></center></body></html>';
			res.writeHead(404, {
				"Content-Type": "text/html;charset=UTF8"
			});
			res.end(body);
		}
		let that = this;
		for (let i = 0; i < this.methods.length; i++) {
			let method = this.methods[i].toLowerCase(); // 获取方法
			this.routeRule[method] = {};
			this[method] = function (rule, callback) {
				// 检测是不是数组
				if (Array.isArray(rule) === true) {
					for (let i2 in rule) {
						let rule2 = rule[i2];
						rule2 = that.prefixStr + rule2;
						that.routeRule[method][rule2] = callback;
					};
				} else {
					if (that.isFun(rule)) {
						++that.routeSort;
						that.routeRule[method][that.routeSort] = rule;
					} else {
						rule = that.prefixStr + rule;
						that.routeRule[method][rule] = callback;
					}
				}
				return that;
			};
		}
	}

	// 设定前缀
	prefix(prefix) {
		this.prefixStr = prefix;
	}

	use(method, rule, callback) {
		if (typeof method === 'function') {
			return this;
		}
		this.routeRule[method][rule] = callback;
		return this;
	}

	// http初始化函数
	async httpInit(req, res) {
		let query = this.getParam(req.url);
		let param = decodeURI(query[0]); // 获取字符串
		if (param === '/favicon.ico') {
			return;
		}
		let params = new URLSearchParams(query[1]);
		const parsed = {};
		for (const [key, value] of params) {
			parsed[key] = value;
		}
		this.params = parsed;
		this.req = req;
		this.res = res;
		let method = req.method.toLowerCase();
		let routes = Object.assign(this.routeRule.all, this.routeRule[method]); // 合并数组，如果all在前面，那么就会被后面的替换
		this.run(routes, param);
	}

	// 初始化http
	http(server) {
		let that = this;
		server.on('request', async function (req, res) {
			await that.httpInit(req, res);
		});
	}

	// 解析参数
	getParam(url) {
		let query = [];
		if (url.indexOf("?") != 0) {
			query = url.split("?");
		}
		return query;
	}

	// 运行匹配
	run(routeRule, routePath) {
		let i = 0,
			rules = [];
		let reg = /^[0-9]$/;
		for (let key in routeRule) {
			if (reg.test(key)) {
				this.callBack(routeRule[key]);
			}
			if (this.match(key, routePath)) {
				rules[i] = routeRule[key];
				if (key.search(/(%|@|:|~|!)/) == -1) {
					break;
				}
			}
			i++;
		}
		rules = rules.reverse();
		if (rules[0] && this.isFun(rules[0])) {
			this.callBack(rules[0]);
		} else {
			this.callBack(this.notPage(this.res));
		}
	}

	// 回调
	callBack(call) {
		try {
			this.req.params = this.params;
			this.isFun(call) && call(this.req, this.res);
		} catch (error) {
			console.error("错误: " + error.message);
			this.notPage(this.res);
		}
	}

	// 判断函数
	isFun(fun) {
		return (typeof fun === 'function') ? true : false;
	}

	// 判断正则
	isReg(reg) {
		let isReg;
		try {
			isReg = eval(reg) instanceof RegExp
		} catch (e) {
			isReg = false
		}
		return isReg
	}

	// 匹配路由
	match(rulestr, routePath) {
		let route = routePath; // 当前路由
		// 如果在规则中没遇到一些特殊字符串
		if (rulestr.search(/(%|@|:|~|!)/) == -1) {
			if (route == rulestr) {
				return true;
			}
			return false;
		}
		// 判断正则
		let match = [];
		match = this.rules(rulestr);
		if (route && match) {
			let patt = new RegExp(eval(match['match']), "g");
			// 去头去尾,只吃中间,exec匹配后的后三个键名是固定的,前面的键名也是固定的
			let arr = patt.exec(route);
			if (arr) {
				let query = arr.slice(1, arr.length);
				let param = match['param'];
				Object.keys(param).map(function (key, index) {
					param[key] = query[index];
				});
				this.params = Object.assign(this.params, param);
				return true;
			}
		}
		return false;
	}

	// 匹配路由规则
	rules(rulestr) {
		if (this.routeCache[rulestr]) {
			return this.routeCache[rulestr];
		}
		let rules = {
			"%": "(\\d+)", // 匹配数字
			"@": "([A-za-z]+)", // 匹配大小写字符串
			":": "([A-Za-z0-9@&*%!#-_]+)", // 匹配大小写数字以及&*%!#
			"!": "([\u4e00-\u9fa5]+)", // 匹配中文
			"~": "(|[\u4e00-\u9fa5\A-Za-z0-9@&*%!:#$-_\/]+)", // 匹配所有字符串,此项能匹配以上的所有路由,请放在第二匹配上,第一匹配请不要用,请慎重选择			
		};
		let values = [];
		let patt = new RegExp(/(%|@|:|~|!)([A-Za-z0-9_-]+)/); // 匹配定义的规则
		let str = [];
		while ((str = patt.exec(rulestr)) != null) {
			let pament = str[0]; // 全部匹配
			let pament2 = str[1]; // 符号
			let pament3 = str[2]; // 变量名
			if (rules.hasOwnProperty(pament2)) {
				rulestr = rulestr.replace(pament, rules[pament2]);
				values[pament3] = pament3;
			}
		}
		let route = [];
		route['match'] = '/^' + rulestr.replace(/\//g, '\\/') + '$/';
		route['param'] = values;
		this.routeCache[rulestr] = route;
		return route;
	}
}

module.exports = route;