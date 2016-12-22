var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server) {
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
};

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
	var name = 'Guest'+guestNumber;
	nickNames[socket.id] = name;
	socket.emit('nameResult', {
		succes: true,
		name: name
	});
	namesUsed.push(names);
	return guestNumber+1;
}

function joinRoom(socket, room){
	socket.join(room);
	socket.emit('joinResult', {room: room});
	socket.broadcast.to(room).emit('message', {text: nickNames[socket.id]+' has joinded room '+room+'.'});
	var usersInRoom = io.sockets.clients(room);
	if(usersInRoom.length > 1){
		var usersInRoomSummary = 'Users currently in ' + room + ': ';
		for(var index in usersInRoom) {
			var userSocketId = usersInRoom[index].id;
			if(userSocketId != socket.id){
				if(index > 0){
					usersInRoomSummary += ', ';
				}
				usersInRoomSummary += nickNames[userSocketId];
			}
		}
		usersInRoomSummary += '. ';
		socket.emit('message', {text: usersInRoomSummary});
	}
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
	socket.on('nameAttempt', function(name){
		if(name.indexOf('Guest') == 0){
			socket.emit('nameResult', {
				succes: false, 
				message: 'Names cannot begin with "guest".'
			} else {
				if(namesUsed.indexOf(name) == -1){
					var previousName = nickNames[socket.id];
					var previousNameIndex = namesUsed.indexOf(previousName);
					namesUsed.push(name);
					nickNames[socket.id] = name;
					delete namesUsed.push[previousNameIndex];
					socket.emit('nameResult', {
						succes: true,
						name: name
					});
					socket.broadcast.to(currentRoom[socket.id]).emit('message', {'message: ',
						text: previousName + ' is known as ' + name + '.'
				});
				}
			});
		}
	});
}
