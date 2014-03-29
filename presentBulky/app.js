var http=require('http'),
	socketio=require('socket.io'),
	fs=require('fs');


var server = http.createServer(function(req, res) {
	console.log(req.url);
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + /*homepage*/req.url));
}).listen(8080, function() {
    console.log('Listening at: http://localhost:8080');
});

var io=socketio.listen(server);

io.sockets.on('connection', function (socket) {
	socket.join('audience');
	socket.on('screen',function(screen){
		//socket.emit('screen',screen);
		io.sockets.in('audience').emit('screen',screen);
	});
});