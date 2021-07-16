var myCanvas;
var board = [];
var player0 = [];
var player1 = [];
var rounds = 0;
var currentPlayer = 0;
var finished = false;
var total_pieces = 0;
var moving_piece = -1;
var curr_board = -1;
var waiting_response = false;
var BOARD = document.querySelector('#board');
var SCREEN_WIDHT = BOARD.offsetWidth + parseFloat(jQuery('#board').css("margin-left"));
var SCREEN_HEIGHT = BOARD.offsetHeight;
var OFFSET = 3 * SCREEN_WIDHT / 18;
var WIDTH = 3 * SCREEN_WIDHT / 18;
var HEIGHT = 3 * SCREEN_HEIGHT / 18;
var compute_valid_positions = function(){
    return [
    [
        [OFFSET - WIDTH / 2, OFFSET - HEIGHT / 2],
        [(SCREEN_WIDHT - 2 * OFFSET) / 2 + OFFSET - WIDTH / 2,
                    OFFSET - HEIGHT / 2],
        [(SCREEN_WIDHT - 2 * OFFSET) + OFFSET - WIDTH / 2,
                    OFFSET - HEIGHT / 2],
    ],
    [
        [OFFSET - WIDTH / 2, 
                    (SCREEN_HEIGHT - 2 * OFFSET) / 2 + OFFSET-  HEIGHT / 2],
        [(SCREEN_WIDHT - 2 * OFFSET) / 2 + OFFSET - WIDTH / 2,
                    (SCREEN_HEIGHT - 2 * OFFSET) / 2 + OFFSET - HEIGHT / 2],
        [(SCREEN_WIDHT - 2 * OFFSET) + OFFSET - WIDTH / 2,
                    (SCREEN_HEIGHT - 2 * OFFSET) / 2 + OFFSET - HEIGHT / 2],
    ],
    [
        [OFFSET - WIDTH / 2, 
                    (SCREEN_HEIGHT - 2 * OFFSET) + OFFSET - HEIGHT / 2],
        [(SCREEN_WIDHT - 2 * OFFSET) / 2 + OFFSET - WIDTH / 2,
                    (SCREEN_HEIGHT - 2 * OFFSET) + OFFSET - HEIGHT / 2],
        [(SCREEN_WIDHT - 2 * OFFSET) + OFFSET - WIDTH / 2,
                    (SCREEN_HEIGHT - 2 * OFFSET) + OFFSET - HEIGHT / 2],
    ]
];
}
var VALID_POSITIONS = compute_valid_positions();
