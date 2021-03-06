//Implementation of minimax WITH alpha beta pruning method for AI aspect(s)

	/*The "AI" (Really computer) part starts here 
	    Step 1: Board visualization begins here.
		The implementation of minimax was the initial the starting point for this AI.
		However, the additional implelentation of alpha-beta pruning technique helps to reduce run time of the minimax algorithm by 'ignoring' the optional moves that are not deemed to be good.
    */
    // Set initial depth to 2 or 3
    // Computer will always be black
    // Black minimizes, White maximizes
var positionCount = 0;
var board = new Array(8);
var d = "";

var minimaxRoot = function(depth) {

	var bestMove = -9999;
	var bestMoveFound = [];

	genBoard();
    d = new Date().getTime();
    // Gets valid moves for each piece, then checks for the optimal move (for algorithm)
    for (let piece of Array.from(piecePos)) {
        if (piece[1].color == turnPlayer[turn]) {
            var newGameMoves = getMovementOptions(piece[1], piece[0]);

            for(var i = 0; i < newGameMoves.length; i++) {
	            computerMove(piece[0], newGameMoves[i]); // move piece on board
				var value = minimax(depth - 1, -10000, 10000, false); // computer is black
                undoLastMove();

		        if(value >= bestMove) {
		            bestMove = value;
	                bestMoveFound = [piece[0], newGameMoves[i]];
	            }
			}
//			if (positionCount >= 118597)
			if (new Date().getTime() - d > 20000) // 20 seconds
				break;
        }
    }
    computerMove(bestMoveFound[0], bestMoveFound[1]);

	board = new Array();
    positionCount = 0;
}

//calculate best move
var minimax = function (depth, alpha, beta, isMaximisingPlayer) {

    var s = gameState();
    positionCount++;
	if (depth === 0 || s == "mate" || s == "draw") {
		return evaluateBoard();
	}

	if (isMaximisingPlayer) {
		var bestMove = -9999;

        for (let piece of Array.from(piecePos)) {
            if (piece[1].color == turnPlayer[turn]) {
                var newGameMoves = getMovementOptions(piece[1], piece[0]);
    
                for(var i = 0; i < newGameMoves.length; i++) {
                    computerMove(piece[0], newGameMoves[i]);
                    bestMove = Math.max(bestMove, minimax(depth - 1, alpha, beta, !isMaximisingPlayer));
		            undoLastMove();

                    alpha = Math.max(alpha, bestMove);
		            if (beta <= alpha)
		            {
		                return bestMove;
		            }
                }
            }
        }
		return bestMove;
    }
    else {
		var bestMove = 9999;

        for (let piece of Array.from(piecePos)) {
            if (piece[1].color == turnPlayer[turn]) {
                var newGameMoves = getMovementOptions(piece[1], piece[0]);
    
                for(var i = 0; i < newGameMoves.length; i++) {
                    computerMove(piece[0], newGameMoves[i]);
                    bestMove = Math.min(bestMove, minimax(depth - 1, alpha, beta, !isMaximisingPlayer));
                    undoLastMove();

                    beta = Math.min(beta, bestMove);
		            if (beta <= alpha) {
		                return bestMove;
	                }
                }
            }
        }
		return bestMove;
    }
};

function genBoard() {

	for (var i = 0; i < 8; i++) {
		board[i] = new Array(8);
		for (var j = 0; j < 8; j++) {
			board[i][j] = 0;
		}
	}
	var t = turn;
	var k = kingPos;
	var a = actor;
	kingPos = "";
	actor = "";

	for (let piece of Array.from(piecePos)) {
		if (piece[1].color != turnPlayer[turn])
			turn = (turn + 1) % 2;

		var row = parseInt(piece[0].substring(1)) - 1;
		var col = piece[0].charCodeAt(0) - 97;
		board[row][col] += piece[1].value;
		for (let mov of getMovementOptions(piece[1], piece[0])) {
			row = parseInt(mov.substring(1)) - 1;
			col = mov.charCodeAt(0) - 97;
			board[row][col] += piece[1].value;
		}
	}
	turn = t;
	kingPos = k;
	actor = a;
}

		var evaluateBoard = function () {
		    var totalEvaluation = 0;
		    for (let piece of Array.from(piecePos)) {
                x = piece[0].charCodeAt(0) - 97; //col
                y = parseInt(piece[0].substring(1)) - 1; //row
		        totalEvaluation = totalEvaluation + getPieceValue(piece[1], x ,y);
		    }
		    return totalEvaluation;
		};

		var reverseArray = function(array) {
		    return array.slice().reverse();
		}
		/*Step 2: position evalaution begins here. 
		  It is determined that white is the computer AI and black is the player.
		  The algorithm can then be improved to choose the move that gives the highest evaluation instead of choosing at random from a list of possible options.
		*/
		var pawnEvalWhite =
		[
			[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
			[5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
			[1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
			[0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
			[0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
			[0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
			[0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
			[0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
		];

	var pawnEvalBlack = reverseArray(pawnEvalWhite);

	var knightEval =
		[
			[-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
			[-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
			[-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
			[-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
			[-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
			[-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
			[-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
			[-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
		];

	var bishopEvalWhite = [
		[ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
		[ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
		[ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
		[ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
		[ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
		[ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
		[ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
		[ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
	];

	var bishopEvalBlack = reverseArray(bishopEvalWhite);

	var rookEvalWhite = [
		[  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
		[  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
		[ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
		[ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
		[ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
		[ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
		[ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
		[  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
	];

	var rookEvalBlack = reverseArray(rookEvalWhite);

	var evalQueen = [
		[ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
		[ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
		[ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
		[ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
		[  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
		[ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
		[ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
		[ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
	];

	var kingEvalWhite = [

		[ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
		[ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
		[ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
		[ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
		[ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
		[ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
		[  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
		[  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
	];

	var kingEvalBlack = reverseArray(kingEvalWhite);

		var getPieceValue = function (piece, x, y) {
		    if (piece === null) {
		        return 0;
		    }
		    var getAbsoluteValue = function (piece, isWhite, x ,y) {
		        if (piece.abbr === 'P') {
		            return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
		        }
		        else if (piece.abbr === 'R') {
		            return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
		        }
		        else if (piece.abbr === 'N') {
		            return 30 + knightEval[y][x];
		        }
		        else if (piece.abbr === 'B') {
		            return 30 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
		        } else if (piece.abbr === 'Q'){
		            return 90 + evalQueen[y][x];
		        }
		        else if (piece.abbr === 'K') {
		            return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
		        }
		        throw "Unknown piece type: " + piece.abbr;
			};
			//return piece.value * 10 + board[y][x] + Math.pow(-1, turn) * getAbsoluteValue(piece, piece.color === 'White', x ,y);
		    var absoluteValue = Math.pow(-1, turn) * board[y][x] / 5.0 + getAbsoluteValue(piece, piece.color === 'White', x ,y);
		    return piece.color === 'White' ? -absoluteValue : absoluteValue;
        };