var turnPlayer = ["White", "Black"];
var turn = 0;

var actor = "";
var kingPos = "";

var passant = "z0";
var pawnClr = "";

function nextTurn() {

    var text = document.getElementById("turn").innerHTML;
    var index = text.indexOf(turnPlayer[turn]);

    turn = (turn + 1) % 2;
    document.getElementById("turn").innerHTML = text.replace(text.substring(index, index + 5), turnPlayer[turn]);
}

function isTurn(color) {

    return color == turnPlayer[turn];
}

function highlightBackColors() {

    for (var i = 0; i < movs.length; i ++) {
        backColors.push(document.getElementById(movs[i]).style.backgroundColor);
        document.getElementById(movs[i]).style.backgroundColor = "#BFFFFE";
    }
}

function clearHighlights() {

    while (movs.length > 0)
        document.getElementById(movs.pop()).style.backgroundColor = backColors.pop();
}

function setCheckIfTrue(pos) {

    var king = Piece.BLACK_KING.name;
    if (turn == 1)
        king = Piece.WHITE_KING.name;

    var moves = getMovementOptions(piecePos.get(pos));
    while (moves.length > 0) {
        var loc = moves.pop();
        if (piecePos.has(loc) && piecePos.get(loc).name == king) {
            actor = pos;
            kingPos = loc;
            return;
        }
    }
    actor = "";
    kingPos = "";
}

function checkMate() {

    if (check == "")
        return false;
    // check each piece for the turn player at the start of turn if in check state.

    // while or for each loop for each piece for the turn player check {
        //if (!inCheck(piece, pos)) return false;
    //}
    return true;
}

function inCheck(piece, pos) {

    if (check == "" || (check == pos && piece.name.substring(1) != "King"))
        return false;

    if (piece.name.substring(1) == "King") {
        // check movements from pos for each type of piece (use same color as king for pawn).
        var colDir = pos.charCodeAt(0) - kingPos.charCodeAt(0);
        var col = kingPos.charCodeAt(0);

        var rowDir = parseInt(pos.substring(1)) - parseInt(kingPos.substring(1));
        var row = parseInt(kingPos.substring(1));

        var testPos = kingPos;
        while (col > 96 && col < 105 && row > 0 && row < 9 && !piecePos.has(testPos)) {
            
        }
    }

    if (piecePos.get(check).name.substring(1) == "Knight" || piecePos.get(check).name.substring(1) == "Pawn")
        return true;

    // returns false if pinned
    if (!pinned(pos)) {
        // get difference in position between king and actor, then find direction.
        // return true if new position is in the way.
    }
    return false; // otherwise
}

function movsFromKing(pos) {
    
}

function pinned(pos) {
    var movs = g;
    
}

function canPassant(row, col) {
    return passant.charCodeAt(0) == col && row == passant.substring(1);
}

function enPassant(piece, oldPos, newPos) {

    if (piece.name.substring(1) == "Pawn") {
        if (pawnClr != "" && piece.color != pawnClr) {
            var row = parseInt(newPos.substring(1)) + getDirection(pawnClr);

            if (passant == newPos.substring(0, 1) + row) {
                document.getElementById(passant).innerHTML = "";
                piecePos.delete(passant);
            }
        }
        if (cmprPosition(oldPos, newPos, 2)) {
            passant = newPos;
            pawnClr = piece.color;
        } else {
            passant = "z0";
            pawnClr = "";
        }
    } else {
        passant = "z0";
        pawnClr = "";
    }
}

function cmprPosition(oldPos, newPos, diff) {
    return Math.abs(parseInt(newPos.substring(1)) - parseInt(oldPos.substring(1))) == diff;
}