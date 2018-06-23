var numImages = [], suitImages = [], cardImages = {};
var numSelImage, suitSelImage;
var selectedCard, selectedNumber, selectedSuit, selectedUsername; // confusing but selectedCard refers to the player
var lightEffects = []; // kind of weird but it's [x, y, width, height, red, green, blue, keep?, type];
var effectIgnore = []
var numPositions = [453, 506, 555, 607, 659, 708, 754, 804, 855, 916, 976, 1030, 1090, 1145, 1200];
var suitPositions = [448, 532, 616, 700];
var youTurn = false, canCall = true;
var playerTurn;
var drawOwnCards = false;

function SelectionUI(){

    for(var i = 0; i < cardNumbers.length; i++){
        for(var j = 0; j < cardSuits.length; j++){
            cardImages[cardNumbers[i] + cardSuits[j]] = loadImage("images/cards/" + cardNumbers[i] + cardSuits[j] + ".png");
        }
    }
    cardImages["red_joker"] = loadImage("images/cards/red_joker.png");
    cardImages["black_joker"] = loadImage("images/cards/black_joker.png");

    numSelImage = loadImage("images/numSel.png");
    suitSelImage = loadImage("images/suitSel.png");

    buttonImg1 = loadImage("images/callNormal.png");
    buttonImg2 = loadImage("images/callClicked.png");

    socket.emit('askTurn', socket.id);
    socket.on('whoseTurn', turnCheck);
    function turnCheck(turnData){
        playerTurn = turnData;
        console.log(turnData);
        if(socket.id == turnData) youTurn = true;
        else youTurn = false;
    }
    mouseCheckInterval = setInterval(mouseOver, 10);
}



function drawOptions(){
    image(numSelImage, 450, 310);
    image(suitSelImage, 450, 370);

    if(showCard != null)
    {
        var showPos = cardPositions[playerNameList.indexOf(playerUsername[playerTurn])];

        textAlign(CENTER, CENTER);
        textSize(20);
        fill(0);
        text(showText, showPos[0] + 75, showPos[1] - 10);
        image(cardImages[showCard], showPos[0], showPos[1], cardWidth, cardHeight);
    }

    if(youTurn)
        image(buttonImg1 , 800, 380);

    if(drawOwnCards){
        for(var i = 0; i < youCards.length; i++){
            image(cardImages[youCards[i]], 200 + i * 30, 300, cardWidth, cardHeight);
        }
    }
}

function mouseClicked(){
    var userClicked;
    for(var i = 0; i < cardPositions.length; i++){
        if(mouseX >= cardPositions[i][0] && mouseX <= cardPositions[i][0] + cardWidth){
            if(mouseY >= cardPositions[i][1] && mouseY <= cardPositions[i][1] + cardHeight){
                if((abs(youPos - i) % 2 == 1 && youTeam == 'blue') || (abs(youPos - i) % 2 == 0 && youTeam == 'red')){ // they are on different teams
                    // allow them to call something
                    if(selectedCard != null)
                        effectIgnore.push("card");
                    selectedCard = i;
                    selectedUsername = playerNameList[selectedCard];
                }

            }
        }
    }

    if(mouseX >= 450 && mouseX <= 450 + 760 && mouseY >= 310 && mouseY <= 310 + 70){
        for(var i = 0; i < numPositions.length; i++){
            if(mouseX <= numPositions[i]){
                if(i != selectedNumber)
                    effectIgnore.push("num");
                selectedNumber = i;
                break;
            }
        }

    }

    if(mouseY >= 370 && mouseY <= 370 + 70 && mouseX >= 450 && mouseX <= 450 + 320){
        for(var i = 0; i < suitPositions.length; i++){
            if(mouseX >= suitPositions[i] && mouseX <= suitPositions[i] + 80){
                if(i != selectedSuit)
                    effectIgnore.push("suit");
                selectedSuit = i;
                break;
            }
        }
    }

    if(mouseX >= 800 && mouseX <= 800 + 258 && mouseY >= 380 && mouseY <= 380+71 && canCall){
        callCard(selectedUsername, selectedNumber, selectedSuit)
    }
}

function mouseOver(){ // this whole thing is so shit i can't believe it but it works and i'm never looking at the code again after this
    if(dealAnimationDone){

        if(selectedCard != null && selectedNumber != null && selectedSuit != null){
            if(!callLegal(selectedCard, selectedNumber, selectedSuit)){
                canCall = false;
            }
            else
                canCall = true;
        }

        if(!youTurn) canCall = false;

        drawEffect();

        newLights = [];
        for(var i = 0; i < lightEffects.length; i++){
            if(lightEffects[i][7]){
                var isUniq = true;
                for(var j = 0; j < newLights.length; j++){
                    var isSame = true;
                    for(var k = 0; k < 7; k++)
                        if(lightEffects[i][k] != newLights[j][k])
                            isSame = false;
                    if(isSame)
                        isUniq = false;
                }
                if(isUniq){
                    var ign = false;
                    for(var j = 0; j < effectIgnore.length; j++){
                        if(effectIgnore[j] == lightEffects[i][8]){
                            ign = true;
                        }
                    }

                    if(!ign)
                        newLights.push(lightEffects[i]);
                }
            }
        }
        effectIgnore = [];
        lightEffects = newLights;

        checkCard();
        checkSuit();
        drawOptions();
        checkNum();


    }

    function checkNum(){
        if(mouseX >= 450 && mouseX <= 450 + 760 && mouseY >= 310 && mouseY <= 310 + 70){
            for(var i = 0; i < numPositions.length; i++){
                if(mouseX <= numPositions[i]){
                    if(i == selectedNumber)
                        lightEffects.push([numPositions[i - 1], 308, 54, 60, 0, 255, 40, true, "num"]);
                    else
                        lightEffects.push([numPositions[i - 1], 308, 54, 60, 255, 255, 255, false, "num"]);
                    break;
                }
            }

        }
    }

    function checkSuit(){
        if(mouseY >= 370 && mouseY <= 370 + 70 && mouseX >= 450 && mouseX <= 450 + 320){
            for(var i = 0; i < suitPositions.length; i++){
                if(mouseX >= suitPositions[i] && mouseX <= suitPositions[i] + 80){
                    if(i == selectedSuit)
                        lightEffects.push([suitPositions[i], 368, 70, 82, 0, 255, 40, true, "suit"]);
                    else
                        lightEffects.push([suitPositions[i], 368, 70, 82, 255, 255, 255, false, "suit"]);
                    break;
                }
            }
        }
    }

    function checkCard(){
        var rectMargin = 10;
        var overCard = false;
        for(var i = 0; i < cardPositions.length; i++){
            if(mouseX >= cardPositions[i][0] && mouseX <= cardPositions[i][0] + cardWidth){
                if(mouseY >= cardPositions[i][1] && mouseY <= cardPositions[i][1] + cardHeight){
                    overCard = true;
                    if((abs(youPos - i) % 2 == 1 && youTeam == 'blue') || (abs(youPos - i) % 2 == 0 && youTeam == 'red')){
                        if(i == selectedCard) lightEffects.push([cardPositions[i][0] - rectMargin, cardPositions[i][1] - rectMargin,
                            cardWidth + rectMargin * 2, cardHeight + rectMargin * 2, 0, 255, 40, true, "card"]);
                        else lightEffects.push([cardPositions[i][0] - rectMargin, cardPositions[i][1] - rectMargin,
                            cardWidth + rectMargin * 2, cardHeight + rectMargin * 2, 255, 255, 255, false, "card"]);
                    }

                    if(i == 0){
                        drawOwnCards = true;
                    }
                }
            }
        }

        if(!overCard) drawOwnCards = false;

    }
}

function drawEffect(x, y, width, height, cr, cb, cg){
    background(backgroundImg);
    updateCard();
    drawNames();

    for(var i = 0; i < lightEffects.length; i++){
        if(canCall) fill(lightEffects[i][4], lightEffects[i][5], lightEffects[i][6], 100);
        else fill(255, 21, 21, 100);
        rect(lightEffects[i][0], lightEffects[i][1], lightEffects[i][2], lightEffects[i][3]);
    }
}
