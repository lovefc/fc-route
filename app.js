/** 进程操作 **/

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`父进程${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`进程 ${worker.process.pid} 已销毁`);
  });

  cluster.on('listening', (worker) => {
    // 发送消息到子类
    worker.send({message: '父类的消息'})
  });

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', (data)=>{
      // receive by the worker
      console.log('master message: ', data)
    });
  }

} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);

  // send to master
  process.send({message: 'from worker'});

  process.on('message', (data)=>{
    // receive by the master
    console.log('worker message', data)
  })
}