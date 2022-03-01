/*
 * @Author       : lovefc
 * @Date         : 2021-03-17 16:39:17
 * @LastEditTime : 2022-02-25 16:50:34
 */

const _querystring = require('querystring');
const _url = require('url');
const _fs = require("fs");
const _path = require("path");
class route {
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
		this.notPage = function (req, res) {
			res.writeHead(404, {
				"Content-Type": "text/html;charset=UTF8"
			});
			res.end('<html><head><title>404 Not Found</title></head><body style="width:100%;height:100%;top:45%;position:relative;overflow:hidden;"><center><h1>404 Not Found</h1></center></body></html>');
		}
		let that = this;
		for (let i = 0; i < this.methods.length; i++) {
			let method = this.methods[i].toLowerCase();
			this.routeRule[method] = {};
			this[method] = function (rule, callback) {
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
	async httpInit(req, res) {
		this.request = req;
		this.response = res;
		let query = this.getParam(req.url);
		let param = decodeURI(query[0]);
		if (param === '/favicon.ico') {
			return;
		}
		this._http['req'] = req;
		this._http['res'] = res;
		let method = req.method.toLowerCase();
		let routes = Object.assign(this.routeRule.all, this.routeRule[method]);
		this.run(routes, param);
	}
	httpCache() {
		let req = this.request;
		if (req.headers['if-modified-since']) {
			let oDate = new Date(req.headers['if-modified-since']);
			let time_client = Math.floor(oDate.getTime() / 1000);
			let time_server = Math.floor(new Date().getTime() / 1000);
			if (time_server > time_client) {
				return false;
			} else {
				return true;
			}
		}
	}
	httpCacheMsg() {
		let res = this.response;
		res.writeHeader(304);
		res.write('Not Modified');
		res.end();
	}
	async koaInit(ctx, next) {
		this.request = ctx.req;
		this.response = ctx.res;
		if (ctx.path === '/favicon.ico') {
			return;
		}
		this._koa['ctx'] = ctx;
		this._koa['next'] = next;
		let method = ctx.method.toLowerCase();
		let routes = Object.assign(this.routeRule[method], this.routeRule.all);
		this.run(routes, ctx.path);
	}
	koa(app) {
		let that = this;
		this._koa = {};
		app.use(async function (ctx, next) {
			await that.koaInit(ctx, next);
		});
	}
	http(server) {
		let that = this;
		this._http = {};
		server.on('request', async function (req, res) {
			await that.httpInit(req, res);
		});
	}
	getParam(url) {
		let query = [];
		if (url.indexOf("?") != 0) {
			query = url.split("?");
		}
		return query;
	}
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
			}
			i++;
		}
		rules = rules.reverse();
		if (rules[0] && this.isFun(rules[0])) {
			this.callBack(rules[0]);
		} else {
			this.callBack(this.notPage);
		}
	}
	callBack(call) {
		if (this._koa) {
			this._koa['ctx'].params = this.params;
			call(this._koa['ctx'], this._koa['next']);
		} else if (this._http) {
			this._http['req'].params = this.params;
			call(this._http['req'], this._http['res']);
		} else {
			call();
		}
	}
	isFun(fun) {
		return (typeof fun === 'function') ? true : false;
	}
	isReg(reg) {
		let isReg;
		try {
			isReg = eval(reg) instanceof RegExp
		} catch (e) {
			isReg = false
		}
		return isReg
	}
	match(rulestr, routePath) {
		let route = routePath;
		if (rulestr.search(/(%|@|:|~|!)/) == -1) {
			if (route == rulestr) {
				return true;
			}
			return false;
		}
		let match = [];
		match = this.rules(rulestr);
		if (route && match) {
			var patt = new RegExp(eval(match['match']), "g");
			let arr = patt.exec(route);
			if (arr) {
				let query = arr.slice(1, arr.length);
				let param = match['param'];
				Object.keys(param).map(function (key, index) {
					param[key] = query[index];
				});
				this.params = param;
				return true;
			}
		}
		return false;
	}
	rules(rulestr) {
		if (this.routeCache[rulestr]) {
			return this.routeCache[rulestr];
		}
		let rules = {
			"%": "(\\d+)",
			"@": "([A-za-z]+)",
			":": "([A-Za-z0-9@&*%!#-_]+)",
			"!": "([\u4e00-\u9fa5]+)",
			"~": "(|[\u4e00-\u9fa5\A-Za-z0-9@&*%!:#$-_\/]+)",		
		};
		let values = [];
		let patt = new RegExp(/(%|@|:|~|!)([A-Za-z0-9_-]+)/);
		let str;
		while ((str = patt.exec(rulestr)) != null) {
			let pament = str[0];
			let pament2 = str[1];
			let pament3 = str[2];
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