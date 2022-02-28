var process = require('process');
var cp = require('child_process');
var fs = require('fs');

var server = cp.fork('http.js');

fs.watchFile('http.js', function (event, filename) {
    server.kill();
    server = cp.fork('http.js');
});

process.on('SIGINT', function () {
    server.kill();
    fs.unwatchFile('http.js');
    process.exit();
});

/*
fs.watch('./', function (event, filename) { // sub directory changes are not seen
    console.log(`restart server`);
    server.kill();
    server = cp.fork('server.js');    
	
})
*/