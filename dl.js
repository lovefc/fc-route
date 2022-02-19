const http = require('http');

const net = require('net');

const { URL } = require('url');

const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});

proxy.on('connect', (req, clientSocket, head) => {
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    // 把connect请求剩下的数据转发给服务器               
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

proxy.listen(4008, '127.0.0.1', () => {
  const body = 'GET https://www.baidu.com:80 HTTP/1.1\r\n\r\n';
  const length = body.length;
  const socket = net.connect({host: '127.0.0.1', port: 4008});
  socket.write(`CONNECT www.baidu.com:80 HTTP/1.1\r\n\r\n${body}`);
  socket.setEncoding('utf-8');
  socket.on('data', (chunk) => {
    console.log(chunk)
  });
});