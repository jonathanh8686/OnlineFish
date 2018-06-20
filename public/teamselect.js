
// voting on team captains?
function TeamSelect(){
    console.log(socket.id);
    console.log("Sending request for team selection from: " + playerUsername[socket.id]);
    socket.emit('askteam', playerUsername[socket.id]);

}
