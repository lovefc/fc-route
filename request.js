/*
 * @Author       : lovefc
 * @Date         : 2022-02-19 23:48:06
 * @LastEditTime : 2022-02-20 00:38:04
 */
const _url = require('url');
const _querystring = require("querystring");
class request {
	url(url) {
		let options = _url.parse(url); // 要访问的url;
		let port = options.port ? options.port : 80;
		let protocol = options.protocol;
		if (protocol === 'https') {
			port = options.port ? options.port : 443;
			this.http = require('http2');
		} else {
			this.http = require('http');
		}
		options.port = port;
		this.options = options;
		return this;
	}

	// 反向代理
	proxy(sport) {
		let that = this;
		that.http.createServer(function (req, res) {
			let options = _url.parse(req.url);
			options.headers = req.headers;
			options.headers.host = that.options.hostname;
			let method = req.method.toLowerCase();
			let options3 = {
				hostname: that.options.hostname,
				host: that.options.hostname,
				port: that.options.port,
				path: options.path,
				method: method,
				headers: options.headers
			};
			let proxyRequest = that.http.request(options3, function (proxyResponse) { //代理请求获取的数据再返回给本地res
				proxyResponse.on('data', function (chunk) {
					// console.log('proxyResponse length:', chunk.length);
					res.write(chunk, 'binary');
				});
				//当代理请求不再收到新的数据，告知本地res数据写入完毕。
				proxyResponse.on('end', function () {
					// console.log('proxied request ended');
					res.end();
				});

				res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
			});
			//data只有当请求体数据进来时才会触发
			//尽管没有请求体数据进来，data还是要写，否则不会触发end事件
			req.on('data', function (chunk) {
				proxyRequest.write(chunk, 'binary');
			});
			req.on('end', function () {
				proxyRequest.end();
			});
		}).listen(sport);
	}
    
	// 产生区间随机数
	random(minNumber, maxNumber) {

		let range = maxNumber - minNumber; //取值范围的差

		let random = Math.random(); //小于1的随机数

		return minNumber + Math.round(random * range); //最小数与随机数和取值范围求和，返回想要的随机数字

	}
	rand_ip()
    {
		let ip_long = [
            [
                '607649792',
                '608174079'
            ], //36.56.0.0-36.63.255.255
            [
                '975044608',
                '977272831'
            ], //58.30.0.0-58.63.255.255
            [
                '999751680',
                '999784447'
            ], //59.151.0.0-59.151.127.255
            [
                '1019346944',
                '1019478015'
            ], //60.194.0.0-60.195.255.255
            [
                '1038614528',
                '1039007743'
            ], //61.232.0.0-61.237.255.255
            [
                '1783627776',
                '1784676351'
            ], //106.80.0.0-106.95.255.255
            [
                '1947009024',
                '1947074559'
            ], //116.13.0.0-116.13.255.255
            [
                '1987051520',
                '1988034559'
            ], //118.112.0.0-118.126.255.255
            [
                '2035023872',
                '2035154943'
            ], //121.76.0.0-121.77.255.255
            [
                '2078801920',
                '2079064063'
            ], //123.232.0.0-123.235.255.255
            [
                '-1950089216',
                '-1948778497'
            ], //139.196.0.0-139.215.255.255
            [
                '-1425539072',
                '-1425014785'
            ], //171.8.0.0-171.15.255.255
            [
                '-1236271104',
                '-1235419137'
            ], //182.80.0.0-182.92.255.255
            [
                '-770113536',
                '-768606209'
            ], //210.25.0.0-210.47.255.255
            [
                '-569376768',
                '-564133889'
            ] //222.16.0.0-222.95.255.255
        ];
        let rand_key = this.random(0, 9);
        let _ip = '';
		return _ip;
    }

	/**
	 * 构建post函数
	 * @param {string} url 
	 * @param {array}  requestData 
	 * @param {string} header
	 */
	post(requestData = {}) {
		let that = this;
		let post_data = _querystring.stringify(requestData);
		this.options.method = 'POST';
		this.options.port = this.options.port;
		this.options.headers = {
			'Content-Length': post_data.length
		};
		return new Promise((resolve, reject) => {
			let body = '';
			let req = that.http.request(this.options, function (res) {
				if (res.statusCode != 200) {
					reject(res);
					return;
				}
				res.on('data', function (buffer) {
					body += buffer;
				});
				res.on('end', function () {
					resolve(body);
				});
			});
			req.write(post_data);
			req.on('error', (e) => {
				reject(e);
			});
			req.end();
		});
	}
}
module.exports = request;