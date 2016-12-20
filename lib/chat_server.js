var socket.io = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server);
io = socketio.listen(server);
io.set('log level', 1);

io.sockets.on('connection', function(socket){
	guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
	joinRoom(socket, 'lobby');

	handleMessagesBroadcasting(socket, nickNames);
	handleNameChangeAttempts(socket, nickNames, namesUsed);
	hadleRoomJoining('rooms', function(){
		socket.emit('rooms', io.sockets.manager.rooms);
	});

	handleClientDisconnect(socket, nickNames, namesUsed);
});