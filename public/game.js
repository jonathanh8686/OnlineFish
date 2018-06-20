// TODO: THE ORDER IS NOT CORRECT FIX IT
function Game(){
    initPositions();
    drawNames();
}

function rot(arr, order) {
    order = order % arr.length;
    var a = arr.length - order;

    reverse(arr, 0, a-1);
    reverse(arr, a, arr.length-1);
    reverse(arr, 0, arr.length-1);
} // allows for rotating the array

function reverse(arr, left, right){
    while(left < right){
        var temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
}

function initPositions(){
    // TODO: this is so shit pls make less shit
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

function drawNames(){
    // so this is like mega autisic so im going to eventually change this i promise

    var playerNameList = [];
    for(var key in playerUsername){
        playerNameList.push(playerUsername[key]);
    }

    var youPos = 0;
    for(var i = 0; i < playerNameList.length; i++){
        console.log("pnl: " + playerNameList[i]);
        console.log("pu: " + playerUsername[socket.id]);
        if(playerNameList[i] == playerUsername[socket.id])
            youPos = i;
    }
    console.log(youPos);
    playerNameList = rot(playerNameList, youPos);
    textSize(50);

    for(var i = 0; i < playerPositions.length; i++){
        if(i == 0 || i == 3) textAlign(CENTER, CENTER);
        else if(i == 1|| i == 2) textAlign(RIGHT, CENTER);
        else if(i == 4 || i == 5) textAlign(LEFT, CENTER);
        text(playerNameList[i], playerPositions[i][0], playerPositions[i][1]);
    }

}
