var cards = [];
var cardNumbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
var cardSuits = ['S', 'H', 'D', 'C'];
var halfSuits = [['8S', '8H', '8D', '8C', 'red_joker', 'black_joker'],
 ['AS', 'KS', 'QS', 'JS', '10S', '9S'], ['7S', '6S', '5S', '4S', '3S', '2S'],
['AH', 'KH', 'QH', 'JH', '10H', '9H'], ['7H', '6H', '5H', '4H', '3H', '2H'],
['AD', 'KD', 'QD', 'JD', '10D', '9D'], ['7D', '6D', '5D', '4D', '3D', '2D'],
['AC', 'KC', 'QC', 'JC', '10C', '9C'], ['7C', '6C', '5C', '4C', '3C', '2C']];
var youCards = [];

var backImage;
var cardDealGraphics, cardWidth = 150, cardHeight = 210;
var animateInterval, updateInterval, contUpdate = true;
var dealAnimationDone = false;
var cardPositions = [];

function Dealer(){
    backImage = loadImage("images/cards/backs/gray_back.png");
    cardDealGraphics = createGraphics(1600, 800);
    initCardPositions();

    socket.on('dealtCards', receivedCard);
    function receivedCard(data){
        youCards = data;
        console.log(data);
    }

    console.log("Emitting deal request!");
    socket.emit('askdeal', socket.id);

    animateInterval = setInterval(animateDeal, 100);
    updateInterval = setInterval(updateCard, 10);
    animateDeal();
}

function initCardPositions(){
    // TODO: also shit
    cardPositions = [];
    cardPositions.push([550, 550]);
    cardPositions.push([1450, 450]);
    cardPositions.push([1450, 225]);
    cardPositions.push([550, 25]);
    cardPositions.push([50, 200]);
    cardPositions.push([50, 425]);
}

var pturn = 0, sendCount = 0;
function animateDeal(){
    if(contUpdate){
        sendCount++;
        sendCard(700, 300, cardPositions[pturn][0], cardPositions[pturn][1]);
        //console.log(playerPositions[pturn][0] - 100, playerPositions[pturn][1]);
        pturn = (pturn + 1) % 6;

        if(sendCount == 6)
            clearInterval(animateInterval);
    }
}

// ok this code is going to suck so much ass and be so much work but i can't think of another way to do it because im rarted
var playerdxy = [];

function sendCard(bx, by, ex, ey){
    var dx = (ex - bx) / 100, dy = (ey - by) / 100;
    var x = bx, y = by;
    playerdxy.push([x, y, dx, dy, ex, ey]); // ??????>!>!>!!>!>!>!@HFEBJSdjhgdhrujty6rtgnj
}

var runCount = 0;
function updateCard(){
        runCount++;
        background(backgroundImg);
        drawNames();
        for(var i = 0; i < playerdxy.length; i++){
            image(backImage, playerdxy[i][0], playerdxy[i][1], cardWidth, cardHeight);
            if(playerdxy[i][0] != playerdxy[i][4] || playerdxy[i][1] != playerdxy[i][5]){
                playerdxy[i][0] += playerdxy[i][2];
                playerdxy[i][1] += playerdxy[i][3];
            }
        }

        if(runCount >= 160)
        {
            clearInterval(updateInterval);
            clearInterval(animateInterval);
            dealAnimationDone = true;
            contUpdate = false;
        }
}
