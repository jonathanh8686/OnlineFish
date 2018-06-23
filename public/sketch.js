var socket;
var gameinitInstance, playerInstance, selectionInstance, dealerInstance, selectionInstance, callInstance;
var fadeInterval;
var playerUsername;
var cardCallInstance;

var playerTextFont;
var backgroundImg;

function preload(){
	playerTextFont = loadFont("fonts/academic.ttf");
}

function setup() {
	var cnv = createCanvas(1600, 800);
	background(51);

	backgroundImg = loadImage("images/background.jpg");

	//socket = io.connect('66.27.76.64:3000');
	socket = io.connect('localhost:3000'); // connect to the server (hosted on my computer)
	socket.on('connect', connectionMade)

}

function connectionMade(){
	console.log("Establishing game connection...");
	gi = new JoinLeave(); // initalize the game
	ident = new Identify();
}

function fadeOutPreviousScreen(){
	background(backgroundImg);
	beginGame();
	//fadeInterval = setInterval(fadeLogin, 10);
}

var tpFactor = 0;
function fadeLogin(){
	fill(51, 51, 51, min(255,tpFactor));

	rect(0, 0, 1600, 800);
	tpFactor += 0.5;

	if(tpFactor >= 50) {
		clearInterval(fadeInterval);
		beginGame();
	}
}

function beginGame(){
	console.log("game begin");
	//selectionInstance = TeamSelect();
	gameinitInstance = GameInitalizer();
	dealerInstance = Dealer();

	selectionInstance = SelectionUI();
	callInstance = Caller();
}


function draw() {
	noStroke();

}
