var blueTeam = [], redTeam = [], youTeam = "";
var playerNameList = [], orderedPlayerNameList = [];
var youPos, youUsername;
var playerPositions = [];

function GameInitalizer(){
    initPositions();
    initNames();
    drawNames();
}

function initPositions(){
    // TODO: this is so shit pls make less shit
    playerPositions = [];
    playerPositions.push([800, 700]);
    playerPositions.push([1400, 525]);
    playerPositions.push([1400, 275]);
    playerPositions.push([800, 100]);
    playerPositions.push([200, 275]);
    playerPositions.push([200, 525]);
}

function rot(arr, count){
    for(var i = 0; i < count; i++)
        arr.push(arr.shift())
    return arr;
}

function initNames(){
    for(var key in playerUsername){
        playerNameList.push(playerUsername[key]);
    }
    orderedPlayerNameList = playerNameList; // keep a copy with the same ordering

    for(var i = 0; i < playerNameList.length; i++){
        if(playerNameList[i] == playerUsername[socket.id])
            youPos = i;
    }
    playerNameList = rot(playerNameList, youPos);

    if(youPos % 2 == 0) youTeam = "blue";
    else youTeam = "red";
    console.log("You are on " + youTeam + " team!");
}

function drawNames(){
    initPositions();
    // so this is like mega autisic so im going to eventually change this i promise
    textSize(50);
    textFont(playerTextFont);

    for(var i = 0; i < playerPositions.length; i++){
        if(i == 0 || i == 3) textAlign(CENTER, CENTER);
        else if(i == 1|| i == 2) textAlign(RIGHT, CENTER);
        else if(i == 4 || i == 5) textAlign(LEFT, CENTER);

        if((i + youPos) % 2){
            fill(255, 0, 0);
            redTeam.push(playerNameList[i]);
        }
        else {
            fill(25, 75, 255);
            blueTeam.push(playerNameList[i]);
        }
        text(playerNameList[i], playerPositions[i][0], playerPositions[i][1]);
    }
}
