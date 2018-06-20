var express = require('express');
var app = express();

var server = app.listen(3000); // open port 3000
var io = require('socket.io')(server);
app.use(express.static('public'));

io.sockets.on('connection', newConnection);

var playersInLobby = 0; // keep a server count with the number of players currently connected
var playerUsername = {}; // playerUsername[socket.id] = username
var playersAskedForTeamSelection = 0, playersAsked = []; // keep track of the unique players that send team requests

function newConnection(socket) {
    console.log(' New Connection: ' + socket.id); // log new connections

    var prevLobby = playersInLobby;
    socket.on('askteam', logAskTeam);
    function logAskTeam(data){
        var inflag = false;
        for(var i in playersAsked){
            if(data == i) inflag = true;
        }

        if(!inflag){
            playersAsked.push(data);
            playersAskedForTeamSelection++;
        }
        console.log("Received team request from: " + data);

        if(playersAskedForTeamSelection == 6) // number of players in game
        {
            console.log("Players ready for team selection!");
            console.log("Emitting voting packet");
            playersAsked = []; // reset all the variables keeping track of the # of players asked for teams selection
            playersAskedForTeamSelection = 0;
            io.sockets.emit('startTeamVoting', "OK");
        }
    }

    socket.on('declareName', logDeclareName); // when someone enters their username
    function logDeclareName(data){
        playerUsername[data.pid] = data.username;
        io.sockets.emit('updateNames', playerUsername); // send the playerUsername data to all clients

        console.log(data.pid + " has declared their username to be " + data.username);
    }

    socket.on('join', logJoin); // when client connects to server
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

    socket.on('disconnect', logLeave); // when client leaves server
    function logLeave(reason) {
        playersInLobby -= 1;

        var data = {
            pc: playersInLobby,
            id: socket.id
        }
        io.sockets.emit('leave', data);
        console.log(playerUsername[socket.id] + " [" +socket.id + "] has left! (Reason: " + reason + ")");
        io.sockets.emit('updateNames', playerUsername); // keep username dictionary updated
        console.log("There are now " + playersInLobby + " players in lobby.");
        delete playerUsername[socket.id]; // delete key from dictionary
    }

    socket.on('chat', logMessage); // not currently in use (when client sends chat message)
    function logMessage(data) {
        io.sockets.emit('chat', data); // emit to all users the chat message that has just been sent
        console.log("[" + data.id + "] " + data.username + ": " + data.text);
    }
}

console.log("Server is up and running!");
