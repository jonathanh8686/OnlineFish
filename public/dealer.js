var cards = [];
var cardNumbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
var cardSuits = ['C', 'D', 'H', 'S'];

var backImage;
var cardDealGraphics;
var animateInterval;

function Dealer(){
    backImage = loadImage("images/cards/backs/gray_back.png");
    cardDealGraphics = createGraphics(1600, 800);

    socket.on('dealtCards', receivedCard);
    function receivedCard(data){
        console.log(data);
    }

    console.log("Emitting deal request!");
    socket.emit('askdeal', socket.id);

    animateInterval = setInterval(animateDeal, 100);
    animateDeal();
}

var pturn = 0, sendCount = 0;
function animateDeal(){
    sendCount++;
    sendCard(700, 300, playerPositions[pturn][0] - 100, playerPositions[pturn][1]);
    pturn = (pturn + 1) % 6;

    if(sendCount == 18)
    {
        clearInterval(animateInterval);
    }
}


// ok this code is going to suck so much ass and be so much work but i can't think of another way to do it because im rarted

var playerdxy = [];

function sendCard(bx, by, ex, ey){
    console.log("sending card");
    var dx = (ex - bx) / 100, dy = (ey - by) / 100;
    var x = bx, y = by;
    playerdxy.push([x, y, dx, dy, ex, ey]); // ??????>!>!>!!>!>!>!@HFEBJSdjhgdhrujty6rtgnj
    updateInterval = setInterval(updateCard, 10);
}

function updateCard(){
    background(backgroundImg);
    drawNames();
    for(var i = 0; i < playerdxy.length; i++){
        image(backImage, playerdxy[i][0], playerdxy[i][1], 120, 210);
        if(playerdxy[i][0] == playerdxy[i][4] && playerdxy[i][1] == playerdxy[i][5])
            playerdxy.splice(i, 1);
        else {
            playerdxy[i][0] += playerdxy[i][2];
            playerdxy[i][1] += playerdxy[i][3];
        }
    }
}
