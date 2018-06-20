var socket;
var gameInstance, playerInstance, selectionInstance;
var fadeInterval;
var playerUsername;

function setup() {
	createCanvas(1600, 800);
	background(51);

	socket = io.connect('66.27.76.64:3000'); // connect to the server (hosted on my computer)
	socket.on('connect', connectionMade)

}

function connectionMade(){
	console.log("Establishing game connection...");
	gi = new JoinLeave(); // initalize the game
	ident = new Identify();
}

function fadeOutPreviousScreen(){
	background(51);
	beginGame();
	//fadeInterval = setInterval(fadeLogin, 10);
}

var tpFactor = 0;
function fadeLogin(){
	fill(51, 51, 51, min(255,tpFactor));
	console.log(tpFactor);
	rect(0, 0, 1600, 800);
	tpFactor += 0.5;

	if(tpFactor >= 50) {
		clearInterval(fadeInterval);
		beginGame();
	}
}

function beginGame(){
	//selectionInstance = TeamSelect();
	gameInstance = Game();
}


function draw() {
	noStroke();

}
