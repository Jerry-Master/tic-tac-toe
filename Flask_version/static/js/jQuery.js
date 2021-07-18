$(function(){
    $('a#human').on('click touchend', function(e) {
        e.preventDefault();
        use_ai = false;
        ai_player = -1;
        restart();
        return false;
    });

    $('a#ai0').on('click touchend', function(e) {
        e.preventDefault();
        console.log('change ai');
        use_ai = true;
        ai_player = 0;
        restart();
        return false;
    });

    $('a#ai1').on('click touchend', function(e) {
        e.preventDefault();
        console.log('change ai');
        use_ai = true;
        ai_player = 1;
        restart();
        return false;
    });

    $('a#ai').on('click touchend', function(e) {
        e.preventDefault();
        console.log('change ai');
        ai_player = 2;
        restart();
        return false;
    });
});

var cw = $('#board').width();
$('#board').css({'height':cw+'px'});

function update_rounds(num_rounds){
    $('#rounds').html('<h3># of rounds</h3> \
    <p>'+str(num_rounds)+'</p> \
    ')
}

function show_indication(player){
    $('#player_').html('<h3>Currently playing:</h3> \
    <p>Player '+str(player)+'</p> \
    <p>Click to see next move</p> \
    ')
    $('#player').html('<h3>Currently playing:</h3> \
    <p>Player '+str(player)+'</p> \
    <p>Click to see next move</p> \
    ')
}

function update_player(player){
    if (ai_player == 2){
        show_indication(player);
    } else {
        $('#player').html('<h3>Currently playing:</h3> \
        <p>Player '+str(player)+'</p> \
        ')
        $('#player_').html('<h3>Currently playing:</h3> \
        <p>Player '+str(player)+'</p> \
        ')
    }
}