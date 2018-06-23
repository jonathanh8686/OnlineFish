var showCard, showText, u1Pos;

function Caller(){
    socket.on('callResult', callHandle)
    function callHandle(data){
        if(data.result == "hit"){
             showCard = data.card;
             showText = playerUsername[data.target];
        }
        else {
            howCard = null;
            showText = "Missed " + data.card;
        }


        if(data.p1 == socket.id && data.result == "hit"){
            youCards.push(data.card);
        }

        if(data.target == socket.id && data.result == "hit"){
            youCards.splice(youCards.indexOf(data.card), 1);
        }

        console.log(youCards);
    }
}

function animateCall(callRes){
    u1Pos = cardPositions[playerNameList.indexOf(playerUsername[callRes.p1])];
}

function callCard(playerCalled, cardNumber, cardSuit){
    var cardName = cardNumbers[cardNumber - 1] + cardSuits[cardSuit];
    if(cardNumber == 14 && (cardSuit == 1 || cardSuit == 2)){
        cardName = 'red_joker';
    }
    else if(cardNumber == 14 && (cardSuit == 0 || cardSuit == 3)){
        cardName = 'black_joker';
    }

    var data = {
        player: playerCalled,
        card: cardName
    }

    console.log("Calling " + playerCalled + " for the " + cardName);
    socket.emit("cardCalled", data);
}

function callLegal(playerCalled, cardNumber, cardSuit){
    cardNumber--;
    var cardName = cardNumbers[cardNumber] + cardSuits[cardSuit];
    for(var i = 0; i < youCards.length; i++){
        if(cardNumber == 13 && (cardSuit == 1 || cardSuit == 2)){
            if(youCards[i] == 'red_joker')
                return false;
            cardName = 'red_joker';
        }
        else if(cardNumber == 13 && (cardSuit == 0 || cardSuit == 3)){
            if(youCards[i] == "black_joker")
                return false;
            cardName = 'black_joker';
        }
        else{
            if(youCards[i] == cardName)
                return false;
        }
    }

    var halfSuitIndex = -1;
    //console.log(cardName);
    for(var i = 0; i < halfSuits.length; i++){
        for(var j = 0; j < halfSuits[i].length; j++){
            if(halfSuits[i][j] == cardName)
                halfSuitIndex = i;
        }
    }
    console.log(halfSuitIndex);
    var inSuitCount = 0;
    for(var i = 0; i < halfSuits[halfSuitIndex].length; i++){
        for(var j = 0; j < youCards.length; j++){
            if(halfSuits[halfSuitIndex][i] == youCards[j])
                inSuitCount++;
        }
    }
    if(inSuitCount == 0) return false;

    return true;
}
