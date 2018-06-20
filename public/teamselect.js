var playerPositions = [];
// TODO: IMPLEMENT VOTING but not rn
// voting on team captains?
function TeamSelect(){

    socket.on('startTeamVoting', beginVoting)
    function beginVoting(data){
        console.log("Got the OK from server to being voting!");
        setupVotingNames();
    }

    console.log("Sending request for team selection from: " + playerUsername[socket.id]);
    socket.emit('askteam', playerUsername[socket.id]);

}

function setupVotingNames(){

}
