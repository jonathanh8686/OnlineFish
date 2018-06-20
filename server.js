var express = require('express');
var app = express();

var server = app.listen(3000); // open port 3000
var io = require('socket.io')(server);
app.use(express.static('public'));

io.sockets.on('connection', newConnection);

var playersInLobby = 0; // keep a server count with the number of players currently connected

function newConnection(socket) {
    console.log('New Connection: ' + socket.id); // log new connections

    socket.on('join', logJoin);
    function logJoin(pid) {
        playersInLobby += 1;
        var data = {
            pc: playersInLobby,
            id: pid
        }
        io.sockets.emit('join', data);
        console.log(pid + " has joined!");
        console.log("There are now " + playersInLobby + " players in lobby.");
    }

    socket.on('disconnect', logLeave);
    function logLeave(reason) {
        playersInLobby -= 1;
        var data = {
            pc: playersInLobby,
            id: socket.id
        }
        io.sockets.emit('leave', data);
        console.log(socket.id + " has left! (Reason: " + reason + ")");
        console.log("There are now " + playersInLobby + " players in lobby.");
    }

    socket.on('chat', logMessage);
    function logMessage(data) {
        io.sockets.emit('chat', data); // emit to all users the chat message that has just been sent
        console.log("[" + data.id + "] " + data.username + ": " + data.text);
    }
}

console.log("Server is up and running!");
