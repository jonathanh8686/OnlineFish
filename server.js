var express = require('express');
var app = express();

var server = app.listen(3000); // open port 3000
var io = require('socket.io')(server);
app.use(express.static('public'));

io.sockets.on('connection', newConnection);

var playersInLobby = 0; // keep a server count with the number of players currently connected
var playerUsername = {}; // playerUsername[socket.id] = username
var playerID = {}; //playerID[username] = socket.id
var playerCards = {};
var playersAskedForTeamSelection = 0, playersAskedTeam = []; // keep track of the unique players that send team requests
var playersAskedTurn = [];
var playerTurn;

var cards = [];
var cardNumbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
var cardSuits = ['C', 'D', 'H', 'S'];
genCards();

function genCards(){
    for(var n in cardNumbers){
        for(var suit in cardSuits){
            cards.push(cardNumbers[n] + cardSuits[suit]);
        }
    }
    cards.push("black_joker");
    cards.push("red_joker");
}

function newConnection(socket) {
    console.log(' New Connection: ' + socket.id); // log new connections

    socket.on('askTurn', determineTurn);

    function determineTurn(playerID){
        var alreadyAsked = false;
        for(var i = 0; i < playersAskedTurn.length; i++){
            if(playersAskedTurn[i] == playerID)
                alreadyAsked = true;
        }

        if(!alreadyAsked) playersAskedTurn.push(playerID);
        console.log(playersAskedTurn.length + " have asked for the turn!");

        if(playersAskedTurn.length == 6){
            playersAskedTurn = [];
            //var randChoose = Math.floor(Math.random() * playerID.length);
            console.log(playerTurn);
            if(playerTurn == null || playerTurn == undefined){
                console.log("Emitting turn information...");
                playerTurn = Object.keys(playerUsername)[0];
                io.sockets.emit('whoseTurn', playerTurn);
                console.log(playerTurn);
                console.log("It's " + playerUsername[playerTurn] + "\'s turn!");
            }
            else{
                io.sockets.emit('whoseTurn', playerTurn);
                console.log("It's " + playerUsername[playerTurn] + "\'s turn!");
            }
        }

    }

    socket.on('cardCalled', cardCalled);
    function cardCalled(data){
        var playerCalled = data.player;
        var cardName = data.card;
        var pid = playerID[playerCalled];

        var hit = false;
        for(var i = 0; i < playerCards[pid].length; i++){
            if(playerCards[pid][i] == cardName){
                hit = true;
                playerCards[pid].splice(i, 1);
            }
        }

        var callData = {
            p1: playerTurn,
            target: pid,
            card: cardName,
            result: "n/a"
        }

        if(hit){
            console.log(playerUsername[playerTurn] + " took the " + cardName + " from " + playerCalled);
            playerCards[playerTurn].push(cardName);
            callData.result = "hit";
        } else{
            console.log(playerUsername[playerTurn] + " failed to take the " + cardName + " from " + playerCalled);
            console.log("It is now " + playerCalled + '\'s to move');
            playerTurn = pid;
            io.sockets.emit('whoseTurn', playerTurn);
            callData.result = "miss";
        }
        console.log("emitting call result information");
        io.sockets.emit('callResult', callData);
    }

    socket.on('askdeal', dealPlayer);
    function dealPlayer(playerID){
        console.log("Received deal request from " + playerID + " (" + playerUsername[playerID] + ")");
        var dealtCards = []; // 0 to 5

        for(var i = 0; i < 9; i++){
            var indChosen = Math.floor(Math.random() * cards.length);
            var cardChosen = cards[indChosen];
            dealtCards.push(cardChosen);
            cards.splice(indChosen, 1); // delete the card that was dealt
        }

        if(cards.length == 0) genCards();

        playerCards[playerID] = dealtCards;
        console.log("Sending cards back to player!");
        io.sockets.connected[playerID].emit('dealtCards', dealtCards);
        //socket.broadcast.to(playerID).emit(dealtCards, 'dealtCards');
    }

    // var prevLobby = playersInLobby;
    // socket.on('askteam', logAskTeam);
    // function logAskTeam(data){
    //     var inflag = false;
    //     for(var i in playersAsked){
    //         if(data == i) inflag = true;
    //     }
    //
    //     if(!inflag){
    //         playersAsked.push(data);
    //         playersAskedForTeamSelection++;
    //     }
    //     console.log("Received team request from: " + data);
    //
    //     if(playersAskedForTeamSelection == 6) // number of players in game
    //     {
    //         console.log("Players ready for team selection!");
    //         console.log("Emitting voting packet");
    //         playersAsked = []; // reset all the variables keeping track of the # of players asked for teams selection
    //         playersAskedForTeamSelection = 0;
    //         io.sockets.emit('startTeamVoting', "OK");
    //     }
    // }

    socket.on('declareName', logDeclareName); // when someone enters their username
    function logDeclareName(data){
        playerUsername[data.pid] = data.um;
        playerID[data.um] = data.pid;
        //console.log(playerUsername);
        var rtnData = {
            puser: playerUsername,
            pid: playerID
        }
        //console.log(rtnData.puser);
        io.sockets.emit('updateNames', rtnData); // send the playerUsername data to all clients

        console.log(data.pid + " has declared their username to be " + data.um);
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
        if(playersInLobby < 0) playersInLobby = 0;

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
