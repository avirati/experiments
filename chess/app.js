var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io');

var homepage='/index.html';
var rooms=[];
var server = http.createServer(function(req, res) {
	console.log(req.url);
    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + /*homepage*/req.url));
}).listen(8080, function() {
    console.log('Listening at: http://localhost:8080');
});

var io=socketio.listen(server);

io.sockets.on('connection', function (socket) {

	socket.on('initiateGameHosting',function(msg){
		//console.log(msg);
		var roomID=makeid();
		socket.join(roomID);
		socket.emit('initiateGameHosting',roomID);
	});

	socket.on('joinGameHosting',function(roomID){
		socket.join(roomID);
		socket.emit('joinGameHosting','SUCCESS');
	});

    socket.on('boardPosition',function(boardPosition){
    	var roomId=boardPosition.roomId;
    	var fen=boardPosition.fen;
    	io.sockets.in(roomId).emit('boardPosition',fen);
    });


});

//Rooms Management

function closeRoom(socket)
{
	//Iterate among Rooms
	for (var i = rooms.length - 1; i >= 0; i--) {
		//Iterate among clients
		for (var j = rooms[i].clients.length - 1; j >= 0; j--) {
			//if host exists in Room
			if(rooms[i].clients[j].id==socket.id)
			{
				//Remove Room
				rooms.splice(i,1);
				return;
			}
		};
	};
}

function getRoomClients(socket)
{

}

//UTIL
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}