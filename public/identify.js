var username = "", finishedUsername = false, allowedUsername = true;
var userpromptGraphics;
var psocket;
var playerUsername;

function Identify(){
    userpromptGraphics = createGraphics(1300, 125);
    promptInterval = setInterval(promptName, 10); // keep updating the namePrompt

    socket.on('updateNames', updateNames);

    function promptName(){

        if(!finishedUsername) {

            var allowedUsername = true;
            for(var key in playerUsername){
                if(username == playerUsername[key])
                    allowedUsername = false;
            }

            userpromptGraphics.background(60, 150, 255);
            userpromptGraphics.fill(0, 0, sin(frameCount * 0.05) * 256);
        }
        else{
            userpromptGraphics.background(150);
            userpromptGraphics.fill(40, 255, 30);
        }

        if(!allowedUsername && !finishedUsername)
        {
            userpromptGraphics.background(150);
            userpromptGraphics.fill(255, 0, 0);
        }

        userpromptGraphics.textSize(75);
        userpromptGraphics.text("Username: " + username, 0, 90);
        image(userpromptGraphics, 100, 500);
    }

}

function updateNames(serverPU){
    playerUsername = serverPU;
    console.log(playerUsername);
    if(Object.keys(serverPU).length >= 6){
        console.log("Game will begin!");

        clearInterval(promptInterval);
        clearInterval(drawPCInterval);

        fadeOutPreviousScreen();

    }
}

function setName(){
    console.log("setname");
    var data = {
        pid: socket.id, // id that is declaring username
        username: username
    }
    socket.emit('declareName', data);
    console.log("You []" + data.pid + "] have declared your username to be " + data.username);
}
function keyPressed(){
    if(finishedUsername) return; // don't accept new username changes

    if(keyCode == 13 && allowedUsername){ // if the key pressed is not enter
        finishedUsername = true;
        setName(); // send the data to server
    }
    else if(keyCode == 8){ // backspace
        username = username.substring(0, username.length - 1); // remove the last character
    }
    else if(!finishedUsername && keyCode >= 65 && keyCode <= 90 && username.length <= 12){ // don't accept non-characters
        username += key;
    }
}
