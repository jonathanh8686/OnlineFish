function Chat(){

    var messages = [];
    var msgMax = 15;

    this.addMessage = function(data, textGraphics){

        if(messages.length > msgMax){
            for(var i = 0; i < messages.length - 1; i++){
                messages[i] = messages[i + 1];
            }
        }

        if(messages.length > msgMax){
            messages[messages.length - 1] = data;
        }
        else{
            messages.push(data);
        }

        textSize(15);
        for(var i = 0; i < messages.length; i++){
            textGraphics.text(messages[i].username + ": " + messages[i].text, 20, 40 * (i + 1), 300, 40);
        }

        //createP(data.id + ": " + data.text);
    }
}
