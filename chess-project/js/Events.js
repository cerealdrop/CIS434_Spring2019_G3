var pos = "";

var backColors = [];
var movs = [];

var beforePromote = "";
var premoteFrom = null;
var promoteAt = "";
var promoteTake = null;

function action(clicked_id) {

    // If no piece has been selected yet
    if (pos == "") {
        // displays available movements on the board
        if (piecePos.has(clicked_id) && isTurn(piecePos.get(clicked_id).color)) {
            pos = clicked_id;

            backColors.push(document.getElementById(pos).style.backgroundColor);
            document.getElementById(pos).style.backgroundColor = getBackColor();

            movs = getMovementOptions(piecePos.get(pos), pos);
            highlightBackColors();
        }
    } else {
        if (movs.includes(clicked_id)) {

            // Displays position changes on the board
            document.getElementById(clicked_id).innerHTML = "<h1>" + String.fromCharCode(piecePos.get(pos).icon) + "</h1>";
            document.getElementById(pos).innerHTML = "";

            // Checks if a piece was taken this move, then
            // Stores movement in board map
            var mov = piecePos.get(pos);
            var take = null;
            if (piecePos.has(clicked_id)) {
                take = piecePos.get(clicked_id);
                piecePos.delete(clicked_id);
            }
            piecePos.set(clicked_id, mov);
            piecePos.delete(pos);

            // No longer in check if you were in check
            actor = "";
            kingPos = "";

            // Because Javascript is single threaded, we must wait until after
            // This thread is finished to resolve the rest of the execution
            if (!rankUp(mov, clicked_id)) {

                // Checks for special moves
                var pass = enPassant(mov, pos, clicked_id);
                if (!castle(mov, clicked_id, pos))
                    setCheckIfTrue(clicked_id);
                nextTurn();

                displayMoveNotation(mov, take, pos, clicked_id, pass);
            } else {
                // Global variables to preserve execution
                beforePromote = pos;
                promoteFrom = mov;
                promoteAt = clicked_id;
                promoteTake = take;
            }

            // Clear Selection
            document.getElementById(pos).style.backgroundColor = backColors.shift();
            clearHighlights();
            pos = "";

            if (vsComputer && state != "mate" && state != "draw") {
                minimaxRoot(3);
            }
        } else {
        // Clear Selection
        document.getElementById(pos).style.backgroundColor = backColors.shift();
        clearHighlights();
        pos = "";
        }
    }
}

function computerMove(prev, next) {

    // Get the piece
    var piece = piecePos.get(prev);
    var row = 1 + (((turn + 1) % 2) * 7);

    // Displays position changes on the board
    document.getElementById(next).innerHTML = "<h1>" + String.fromCharCode(piece.icon) + "</h1>";
    document.getElementById(prev).innerHTML = "";
    
    // Checks if a piece was taken this move, then
    // Stores movement in board map
    var take = null;
    if (piecePos.has(next)) {
        take = piecePos.get(next);
        piecePos.delete(next);
    }
    piecePos.set(next, piece);
    piecePos.delete(prev);

    // No longer in check if you were in check
    actor = "";
    kingPos = "";

    // Because Javascript is single threaded, we must wait until after
    // This thread is finished to resolve the rest of the execution
    if (piece.abbr != "P" || parseInt(pos.substring(1)) != row) {
    
        // Checks for special moves
        var pass = enPassant(piece, prev, next);
        if (!castle(piece, next, prev))
            setCheckIfTrue(next);
        nextTurn();
    
        displayMoveNotation(piece, take, prev, next, pass);
    } else {

        // Computer always changes the Pawn to a Queen
        document.getElementById(next).innerHTML = "<h1>" + String.fromCharCode(getPieceFromAbbr("Q", turnPlayer[turn]).icon) + "</h1>";
        piecePos.delete(next);

        var queen = getPieceFromAbbr("Q", turnPlayer[turn]);
        piecePos.set(next, queen);

        // Standard Execution
        setCheckIfTrue(next);
        nextTurn();
    
        displayMoveNotation(piece, take, prev, next, false, queen);
    }
}

function setPromotion(id) {

    // Change the Pawn to the piece that is to be promoted to
    piecePos.delete(promoteAt);
    var image = document.getElementById(id).innerHTML;
    document.getElementById(ps).innerHTML = image;

    var piece = getPieceFromAbbr(id, turnPlayer[turn]);
    piecePos.set(promoteAt, piece);

    // Exit out of the overlay and then continue with standard execution
    document.getElementById("overlay").style.display = "none";
    setCheckIfTrue(promoteAt);
    nextTurn();

    displayMoveNotation(promoteFrom, promoteTake, beforePromote, promoteAt, false, piece);

    // Reset promotion values
    beforePromote = "";
    promoteFrom = null;
    promoteAt = "";
    promoteTake = null;
}

// For against AI only
function undoLastTurn() {

    undoLastMove();
    undoLastMove();
}

// Undoes the last move made 
function undoLastMove() {

    // Clears any selection made by the current player
    action("z0");

    // Gets the array of logged data for parsing
    var rows = document.getElementById("moveLog").rows;
    var prevTurn = (turn + 1) % 2;
    var prevRow = 1 + (prevTurn * 7);

    // The header counts as a row
    if (rows.length > 1) {
        // Gets the most recent row
        var row = rows[rows.length - 1];

        // Stop here if no move has been made
        // Get the log for the last move otherwise
        if (row.cells.length > 0) {
            var cells = row.cells;
            var log = cells[cells.length - 1].innerHTML;

            // Remove the log for the move to be undone
            row.deleteCell(-1);
            if (row.cells.length == 0)
                document.getElementById("moveLog").deleteRow(-1);

            // Predeclare variables
            var piece = "";
            var from = "";
            var to = "";

            // Check for castling due to unique log value
            if (!log.includes("O-O")) {

                // Parse the last move made and reset the positions for any moved pieces
                piece = getPieceFromAbbr(log.substring(0, 1), turnPlayer[prevTurn]);
                from = log.substring(1, 3);

                document.getElementById(from).innerHTML = "<h1>" + String.fromCharCode(piece.icon) + "</h1>";
                piecePos.set(from, piece);

                // Still parsing
                if (piece.abbr == "K") {
                    kings[prevTurn] = from;
                    if (kTurn[prevTurn] == rows.length - prevTurn)
                        kTurn[prevTurn] = 0;
                }
                if (piece.abbr == "R" && rTurn[prevTurn].includes(rows.length - prevTurn))
                    rTurn[prevTurn][rTurn[prevTurn].indexOf(rows.length - prevTurn)] = 0;

                // Still parsing
                to = log.substring(4, 6);

                // If a piece was removed from the board, place it back on said board
                if (to.charCodeAt(0) < 97) {
                    var take = getPieceFromAbbr(to.substring(0, 1), turnPlayer[turn]);
                    to = log.substring(5, 7);

                    document.getElementById(to).innerHTML = "";
                    piecePos.delete(to);

                    // Still parsing
                    // Also checks for en passant as the taken pawn's position is displaced in the log
                    if (log.includes("(e.p.)")) {
                        if (take.color == "White") {
                            var r = parseInt(to.substring(1)) + 1;
                            to = to.substring(0, 1) + r;
                        } else {
                            var r = parseInt(to.substring(1)) - 1;
                            to = to.substring(0, 1) + r;
                        }
                    }
//                  ***Finished parsing***
                // Resets the positions that was most recently moved to
                    document.getElementById(to).innerHTML = "<h1>" + String.fromCharCode(take.icon) + "</h1>";
                    piecePos.set(to, take);
                } else {
                    document.getElementById(to).innerHTML = "";
                    piecePos.delete(to);
                }
            } else {
                // If castling was performed, then the positions for both
                // the king and rook must be reset
                var color = turnPlayer[prevTurn];
                var kPiece = getPieceFromAbbr("K", color);
                var rPiece = getPieceFromAbbr("R", color);

                // Hard coded reset because there is no value in doing it dynamically
                document.getElementById("e" + prevRow).innerHTML = "<h1>" + String.fromCharCode(kPiece.icon) + "</h1>";
                piecePos.set("e" + prevRow, kPiece);
                kings[prevTurn] = "e" + prevRow;
                kTurn[prevTurn] = 0;

                if (log == "O-O") {
                    document.getElementById("h" + prevRow).innerHTML = "<h1>" + String.fromCharCode(rPiece.icon) + "</h1>";
                    document.getElementById("g" + prevRow).innerHTML = "";
                    document.getElementById("f" + prevRow).innerHTML = "";

                    piecePos.set("h" + prevRow, rPiece);
                    piecePos.delete("g" + prevRow);
                    piecePos.delete("f" + prevRow);
                } else {
                    document.getElementById("a" + prevRow).innerHTML = "<h1>" + String.fromCharCode(rPiece.icon) + "</h1>";
                    document.getElementById("c" + prevRow).innerHTML = "";
                    document.getElementById("d" + prevRow).innerHTML = "";

                    piecePos.set("a" + prevRow, rPiece);
                    piecePos.delete("c" + prevRow);
                    piecePos.delete("d" + prevRow);
                }
            }
            // Can't perform en passant nor be put in check until at least turn 2
            // Resets the board/game state to the previous move
            // Parses logging information as shown previously
            rows = document.getElementById("moveLog").rows;
            var curRow = 1 + (turn * 7);
            if (rows.length > 2) {
                cells = rows[rows.length - 1].cells;
                log = cells[cells.length - 1].innerHTML;

                if (log.includes("O-O")) {
                    if (log == "O-O")
                        to = "g" + curRow;
                    else
                        to = "d" + curRow;
                    passant = "z0";
                    pawnClr = "";
                } else {
                    // Checks for en passant
                    piece = getPieceFromAbbr(log.substring(0, 1), turnPlayer[turn]);
                    from = log.substring(1, 3);
                    to = log.substring(4, 6);

                    if (isNaN(to.substring(1)))
                        to = log.substring(5, 7);

                    if (piece.abbr == "P" && cmprPosition(from, to, 2)) {
                        passant = to;
                        pawnClr = piece.color;
                    } else {
                        passant = "z0";
                        pawnClr = "";
                    }
                }
                setCheckIfTrue(to);
            }
            // No difference between next and previous turns (same player)
            nextTurn(); // Don't want to check minimax when undoing a move
        }
    }
}