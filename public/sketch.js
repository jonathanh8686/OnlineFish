var socket;
var gameInstance;

function setup() {
	createCanvas(1600, 800);
	background(51);

	socket = io.connect('66.27.76.64:3000'); // connect to the server (hosted on my computer)
	socket.on('connect', connectionMade)

}

function connectionMade(){
	console.log("Establishing game connection...");
	gameInstance = new Game(socket); // initalize the game

}


function draw() {
	noStroke();
	fill(255);
}
