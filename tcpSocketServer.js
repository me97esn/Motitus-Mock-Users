var net = require('net');

var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
  socket.on('data', function (data) {
    console.log('Received: ' + data)
  })
	// socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');
