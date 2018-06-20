var pcount = 0; // number of players currently in game
var username;
var drawPCInterval;

function JoinLeave(){
	textGraphics = createGraphics(1300, 200);
	drawPCInterval = setInterval(drawPlayerCount, 10);

	socket.on('join', getJoin); // listen if the server says anyone joins
	socket.on('leave', getLeave); // listen if the server says anyone leaves
	onJoin(socket);



	function onJoin(socket){
		console.log("You [" + socket.id + "] has joined the lobby!");
		socket.emit('join', socket.id); // emit data when YOU join
	}
	function getJoin(data){ // when you hear the server say someone joined
		pcount = data.pc; // keep track of the player count
		console.log("Server said " + data.id + " has joined the lobby!");
		console.log("Server says there are " + pcount + " players in lobby!");

	}
	function getLeave(data){
		pcount = data.pc; // keep track of the player count
		console.log("Server said " + data.id + " has left the lobby!");
		console.log("Server says there are " + pcount + " players in lobby!");
	}
	function drawPlayerCount(){

		textGraphics.background(150);

		textGraphics.textSize(100);
		textGraphics.fill(0, 0, sin(frameCount * 0.05) * 256);


		if(pcount <= 1) textGraphics.text("There is " + pcount + " person in lobby!", 30, 135);
		else textGraphics.text("There are " + pcount + " people in lobby!", 30, 135);

		image(textGraphics, 100, 100);
	}
}
