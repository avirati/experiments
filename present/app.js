var domain = require('domain'),
d = domain.create();

d.on('error', function(err) {
  console.error(err);
});

d.run(function(){
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
	var currentSlide=0;
	io.sockets.on('connection', function (socket) {
		io.sockets.in('audience').emit('cmd',currentSlide);
		socket.on('hostIdentifierFlag',function(flag){

			if(flag == "true")
			{
				socket.join('host');
			}
			else
			{
				socket.join('audience');
			}
		
		});
		
		socket.on('cmd',function(val){
			if(typeof currentSlide == 'number')
			{
				currentSlide=val;
			}
			io.sockets.in('audience').emit('cmd',val);
		});
		socket.on('screen',function(screen){
			io.sockets.in('host').emit('screen',screen);
		});
	});
});

