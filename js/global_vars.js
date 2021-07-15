var board = [];
var player0 = [];
var player1 = [];
var currentPlayer = 0;
var finished = false;
var total_pieces = 0;
var moving_piece = -1;
var curr_board = -1;
var waiting_response = false;
const OFFSET = 80;
const WIDTH = 80;
const HEIGHT = 80;
var BOARD = document.querySelector('#board');
const SCREEN_WIDHT = BOARD.offsetWidth;
const SCREEN_HEIGHT = BOARD.offsetHeight;
const VALID_POSITIONS = [
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
