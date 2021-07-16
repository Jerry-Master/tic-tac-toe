var cw = $('#board').width();
$('#board').css({'height':cw+'px'});

function update_rounds(num_rounds){
    $('#rounds').html('<h3># of rounds</h3> \
    <p>'+str(num_rounds)+'</p> \
    ')
}

function update_player(player){
    $('#player').html('<h3>Currently playing:</h3> \
    <p>Player '+str(player)+'</p> \
    ')
    $('#player_').html('<h3>Currently playing:</h3> \
    <p>Player '+str(player)+'</p> \
    ')
}