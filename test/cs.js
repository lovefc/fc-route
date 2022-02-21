/*
var tls = require('tls');
    var fs = require('fs');
 
    var options = {
    key: fs.readFileSync(__dirname+'/server.key'),
    cert: fs.readFileSync(__dirname+'/server.crt'),
        requestCert: true,
        rejectUnauthorized: true
    };
 
    var server = tls.createServer(options, function(cleartextStream) {
        console.log('server connected',cleartextStream.authorized ? 'authorized' : 'unauthorized');
        cleartextStream.write('this message is come from server!');
        cleartextStream.setEncoding('utf8');
        cleartextStream.pipe(cleartextStream);
        cleartextStream.on('data', function(data) {
              console.log(data);
        });
    });
	server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // 流是双工的
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200
  });
  stream.end('<h1>Hello World</h1>');
});

    server.listen(8000, function() {
        console.log('server bound');
    });
	
*/

var net =require('net');
var http = require('http');
var https = require('https');
var fs = require('fs');
var os = require('os');
function writeFile(filePath){
     fs.appendFileSync(filePath,'1'+os.EOL);
}

var httpPort = 0;
var httpsPort = 0;

const Eventproxy = require('eventproxy')

let proxy = new Eventproxy();

var status = "ready";	

var select = function(callback){
	proxy.once("selected",callback); // 只执行一次事件
    if(status == "ready"){
		status = "pending";
		writeFile(__dirname+'/cs.txt');
        proxy.emit("selected",'hello2');
		status = "ready";
    }
}	

var app = function(req, res){

select(function(p){
    res.end(p);
});

}

var server = http.createServer(app).listen(httpPort);

server.on('listening', function() {
  httpPort = server.address().port;
});

// configuare https
const httpsOption = {
    key: fs.readFileSync(__dirname+'/server.key'),
    cert: fs.readFileSync(__dirname+'/server.crt'),
}

var sserver = https.createServer(httpsOption, app).listen(httpsPort);
server.on('listening', function() {
  httpsPort = server.address().port;
});
net.createServer(function(socket){
  socket.once('data', function(buf){
    console.log(buf[0]);
    // https数据流的第一位是十六进制“16”，转换成十进制就是22
    var address = buf[0] === 22 ? httpsPort : httpPort;
    //创建一个指向https或http服务器的链接
    var proxy = net.createConnection(address, function(){
      proxy.write(buf);
       //反向代理的过程，tcp接受的数据交给代理链接，代理链接服务器端返回数据交由socket返回给客户端
       socket.pipe(proxy).pipe(socket);
    }) 

    proxy.on('error', function(err) {
      console.log(err)
    })
  })

  socket.on('error', function(err){
    console.log(err);
  })
}).listen(3000);