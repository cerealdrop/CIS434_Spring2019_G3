var turnPlayer = ["White", "Black"];
var turn = 0;

var actor = "";
var kingPos = "";

var cKing = [["c1", "g1"], ["c8", "g8"]];
var cRook = [["a1", "h1"], ["a8", "h8"]];

var passant = "z0";
var pawnClr = "";

function nextTurn() {

    var text = document.getElementById("turn").innerHTML;
    var sIndex = text.indexOf("<b>") + 3;
    var eIndex = text.indexOf("</b>");

    turn = (turn + 1) % 2;
    document.getElementById("turn").innerHTML = text.replace(text.substring(sIndex, eIndex), turnPlayer[turn] + "'s Turn");

    switch(gameState()) {
        case "check": {
            document.getElementById("state").innerHTML = "Check!";
            break;
        }
        case "mate": {
            document.getElementById("turn").innerHTML = text.replace(text.substring(sIndex, eIndex), "Check Mate!");
            document.getElementById("state").innerHTML = turnPlayer[(turn + 1) % 2] + " Wins";
            break;
        }
        case "draw": {
            document.getElementById("state").innerHTML = "Draw!";
            break;
        }
        default: document.getElementById("state").innerHTML = "";
    }
}

function gameState() {

    // Can't be in check mate if not in check
    // But can draw
    if (kingPos == "") {
        for (let piece of piecePos) {
            if (piece[1].color == turnPlayer[turn] && getMovementOptions(piece[1], piece[0]).length > 0)
                return "";
        }
        return "draw";
    }
    // Check each piece for the turn player at the start of turn if in check state.
    for (let piece of piecePos) {
        if (piece[1].color == turnPlayer[turn] && getMovementOptions(piece[1], piece[0]).length > 0)
            return "check";
    }
    return "mate";
}

function displayMoveNotation(mov, take, from, to, pass, prom) {

    var notation = mov.abbr + from;
    if (take != null) {
        notation += "x" + take.abbr + to;
    } else if (pass)
        notation += "x" + mov.abbr + to + "(e.p.)";
    else
        notation += "-" + to;

    if (prom != "" && prom != null)
        notation += "(" + prom + ")";

    if (mov.abbr == "K") {
        var diff = from.charCodeAt(0) - to.charCodeAt(0);
        if (diff == 2)
            notation = "O-O-O";
        else if (diff == -2)
            notation = "O-O";
    }

    switch(gameState()) {
        case "check": {
            notation += "!";
            break;
        }
        case "mate": {
            notation +="#";
        }
    }
    console.log(notation);
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

    var king = pieceArr[(turn + 1) % 2][5].name;
    var moves = getMovementOptions(piecePos.get(pos), pos);

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

function inCheck(piece, pos) {

    // Checks movements from pos for each type of piece.
    // Returns true if such an opposing piece exists in one of those locations.
    if (piece.abbr == "K") {
        var opp = pieceArr[(turn + 1) % 2];

        // Need to disable check temporarily so that full movement can be checked
        var k = kingPos;
        var a = actor;
        kingPos = "";
        actor = "";

        for (var i = 0; i < 5; i++) {
            for (let mov of getMovementOptions(pieceArr[turn][i], pos)) {

                if (piecePos.has(mov) && (piecePos.get(mov).name == opp[i].name)) {
                    kingPos = k;
                    actor = a;
                    return true;
                }
            }
        }
        kingPos = k;
        actor = a;

        var row = parseInt(pos.substring(1));
        var col = pos.charCodeAt(0);

        // Checks for the king separately so as to avoid infinite recursion loops
        for (var v = row - 1; v <= row + 1; v++) {
            for (var h = col - 1; h <= col + 1; h++) {
                var id = String.fromCharCode(h) + v;
    
                if (piecePos.has(id) && piecePos.get(id) == opp[5].name)
                    return true;
            }
        }
        return false;
    }
    // Return false if not in check, or new position would take or block the actor checking the king.
    return kingPos != "" && actor != pos && !blocking(actor, kingPos, pos);
}

function getPin(pos) {

    // A piece cannot be pinned if there is a piece between it and the king.
    // A piece can only be pinned by a rook, bishop or queen and by only 1 piece at a time.
    // Return false if another piece is in the way.

    // Need to check if piece is in line with king first.
    var r = Math.abs(parseInt(pos.substring(1)) - parseInt(kings[turn].substring(1)));
    var c = Math.abs(pos.charCodeAt(0) - kings[turn].charCodeAt(0));
    var opp = (turn + 1) % 2;
    
    if (piecePos.has(pos) && (r == 0 || c == 0 || r == c) && !blocking(pos, kings[turn], null)) {
    
        // Get direction of movement
        var dir = getDirection(kings[turn], pos);

        // Checks for an opposing Queen and either a Rook or a Bishop
        var pins = [pieceArr[opp][1], pieceArr[opp][4]];
        if (Math.abs(dir[0]) == Math.abs(dir[1]))
            pins[0] = pieceArr[opp][3];

        var row = parseInt(pos.substring(1)) + dir[0];
        var col = pos.charCodeAt(0) + dir[1];
        var step = String.fromCharCode(col) + row;
        while (row > 0 && row < 9 && col > 96 && col < 105) {

            // Returns true if piece at position step and can pin the current piece.
            if (piecePos.has(step) && pins.includes(piecePos.get(step)))
                return step;

            // Increment/Decrement
            row += dir[0];
            col += dir[1];

            // Check next position.
            var step = String.fromCharCode(col) + row;
        }
    }
    return "";
}

// Returns only the positions for a piece that
// Protect the King while that piece is pinned.
function pinnedPositions(movs, pos, pin) {

    // Preserve the current position for this piece.
    var piece = piecePos.get(pos); 
    piecePos.delete(pos);
    var validMovs = [];

    for (let mov of movs) {
        if (mov == pin || blocking(kings[turn], pin, mov))
            validMovs.push(mov);
    }
    piecePos.set(pos, piece);
    return validMovs;
}

// Returns true if pos is between start and end.
// False otherwise.
function blocking(start, end, pos) {

    // Get direction of movement
    var dir = getDirection(start, end);

    // Initial position to check
    var row = parseInt(start.substring(1)) + dir[0];
    var col = start.charCodeAt(0) + dir[1];

    var step = String.fromCharCode(col) + row;
    while (step != end) {

        // If this piece or another piece will be in the way
        if (step == pos || piecePos.has(step))
            return true;

        // Increment/Decrement
        row += dir[0];
        col += dir[1];

        // Check next position.
        var step = String.fromCharCode(col) + row;
    }
    return false;
}

function castleMovement() {

    var positions = [];
    if (cKing[turn][0] != "" || cKing[turn][1] != "") {
        var row = 1 + (turn * 7);

        for (var i = 0; i <= 1; i++) {
            if (cKing[turn][i] != "") {
                var dir = getDirection(cKing[turn][i], cRook[turn][i])[1]; // Column dir only
                var col = 101; // Char code for 'e'

                var kPos = kings[turn];
                kings[turn] = String.fromCharCode(col - dir) + row;

                var id = String.fromCharCode(col + dir) + row; // Adjacent pos to King
                var movs = getMovementOptions(pieceArr[turn][1], cRook[turn][i]);

                if (movs.includes(id)) {
                    var legal = true;

                    for (var j = 0; j <= 2; j++) {
                        id = String.fromCharCode(col + (dir * j)) + row;

                        if (inCheck(pieceArr[turn][5], id)) {
                            legal = false;
                            break;
                        }
                    }
                    if (legal)
                        positions.push(cKing[turn][i]);
                }
                kings[turn] = kPos;
            }
        }
    }
    return positions;
}

function castle(piece, to, from) {

    // ascii value of "e" (King's column) = 101
    var row = 1 + (turn * 7);
    if (piece.abbr == "K") {
        if (cKing[turn].includes(to)) {
            var oldPos = "a" + row;
            var newPos = "d" + row;
            if (cKing[turn].indexOf(to) == 1) {
                oldPos = "h" + row;
                newPos = "f" + row;
            }
            piecePos.delete(oldPos);
            piecePos.set(newPos, pieceArr[turn][1]);

            document.getElementById(oldPos).innerHTML = "";
            document.getElementById(newPos).innerHTML = "<h1>" + String.fromCharCode(pieceArr[turn][1].icon) + "</h1>";
        }
        cKing[turn] = ["", ""];
        cRook[turn] = ["", ""];
    } else if (piece.abbr == "R" && cRook[turn].includes(from)) {
            cKing[turn][cRook[turn].indexOf(from)] = "";
            cRook[turn][cRook[turn].indexOf(from)] = "";
    }
}

function canPassant(row, col) {
    return passant.charCodeAt(0) == col && row == passant.substring(1);
}

function enPassant(piece, oldPos, newPos) {

    var pass = false;
    if (piece.abbr == "P") {
        if (pawnClr != "" && piece.color != pawnClr) {
            var row = parseInt(newPos.substring(1)) + getPawnDirection(pawnClr);

            if (passant == newPos.substring(0, 1) + row) {
                document.getElementById(passant).innerHTML = "";
                piecePos.delete(passant);
                pass = true;
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
    return pass;
}

function getDirection(first, second) {

    // Get difference in position between the first and second piece.
    var rowDir = parseInt(second.substring(1)) - parseInt(first.substring(1));
    var colDir = second.charCodeAt(0) - first.charCodeAt(0);
    
    // Direction is from the perspective of the first piece.
    if (rowDir != 0)
        rowDir /= Math.abs(rowDir);
    if (colDir != 0)
        colDir /= Math.abs(colDir);

    return [rowDir, colDir];
}

function cmprPosition(oldPos, newPos, diff) {
    return Math.abs(parseInt(newPos.substring(1)) - parseInt(oldPos.substring(1))) == diff;
}