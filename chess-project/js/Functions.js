// Global variables stroing important information
var vsComputer = false;

var turnPlayer = ["White", "Black"];
var turn = 0;

var state = "";
var actor = "";
var kingPos = "";

const cKing = [["c1", "g1"], ["c8", "g8"]];
var kTurn = [0, 0];

const cRook = [["a1", "h1"], ["a8", "h8"]];
var rTurn = [[0, 0], [0, 0]];

var passant = "z0";
var pawnClr = "";

// Sets the game state for the next turn
function nextTurn() {

    // Parsing text
    var text = document.getElementById("turn").innerHTML;
    var sIndex = text.indexOf("<b>") + 3;
    var eIndex = text.indexOf("</b>");

    // Next turn
    turn = (turn + 1) % 2;

    // Sets new text
    document.getElementById("turn").innerHTML = text.replace(text.substring(sIndex, eIndex), turnPlayer[turn] + "'s Turn");

    // Displays current game state
    state = gameState();
    switch(state) {
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

// Gets the current board/game state
function gameState() {

    // Can't be in check mate if not in check
    // But can draw
    if (kingPos == "") {
        for (let piece of Array.from(piecePos)) {
            if (piece[1].color == turnPlayer[turn] && getMovementOptions(piece[1], piece[0]).length > 0)
                return "";
        }
        return "draw";
    }
    // Check each piece for the turn player at the start of turn if in check state.
    for (let piece of Array.from(piecePos)) {
        if (piece[1].color == turnPlayer[turn] && getMovementOptions(piece[1], piece[0]).length > 0)
            return "check";
    }
    return "mate";
}

// Logs the last move made in roughly reverse algebra notation
function displayMoveNotation(mov, take, from, to, pass, prom) {

    // Gets initial position
    var notation = mov.abbr + from;

    // Checks if piece was taken and displays associated movement
    // Special notation for en passant
    if (take != null) {
        notation += "x" + take.abbr + to;
    } else if (pass)
        notation += "x" + mov.abbr + to + "(e.p.)";
    else
        notation += "-" + to;

    // Notes that a pawn was promoted
    if (prom != "" && prom != null)
        notation += "(" + prom.abbr + ")";

    // Special notation for castling
    if (mov.abbr == "K") {
        var diff = from.charCodeAt(0) - to.charCodeAt(0);
        if (diff == 2)
            notation = "O-O-O";
        else if (diff == -2)
            notation = "O-O";
    }

    // Displays check and check mate
    switch(gameState()) {
        case "check": {
            notation += "!";
            break;
        }
        case "mate": {
            notation +="#";
        }
    }

    // Appends the moves to the current Log
    var rows = document.getElementById("moveLog").rows;
    var row = rows[rows.length - 1];
    if (row.cells.length > 1) {
        var row = document.getElementById("moveLog").insertRow(-1);
        var cell = row.insertCell(-1);
        cell.innerHTML = notation;
    } else {
        var cell = row.insertCell(-1);
        cell.innerHTML = notation;
    }
}

// Self explanatory
function isTurn(color) {

    return color == turnPlayer[turn];
}

// Gets highlight for current game state
function getBackColor() {

    if (kingPos == "")
        return "#98FB98"; // Green (Not Check); 98FB98
    return "#FF4949"; // Red (Check)
}

function highlightBackColors() {

    for (var i = 0; i < movs.length; i ++) {
        backColors.push(document.getElementById(movs[i]).style.backgroundColor);

        if (piecePos.get(pos).abbr == "K" && cKing[turn].includes(movs[i]))
            document.getElementById(movs[i]).style.backgroundColor = "#FF70D5";
        else
            document.getElementById(movs[i]).style.backgroundColor = "#BFFFFE";
    }
}

// Self explanatory
function clearHighlights() {

    while (movs.length > 0)
        document.getElementById(movs.pop()).style.backgroundColor = backColors.pop();
}

// Notifies the program that the next turn player is in check
function setCheckIfTrue() {

    turn = (turn + 1) % 2;
    var kPos = kings[turn];
    var chk = inCheck(piecePos.get(kPos), kPos);

    if (chk != "") {
        actor = chk;
        kingPos = kPos;
        turn = (turn + 1) % 2;
        return;
    }
    actor = "";
    kingPos = "";
    turn = (turn + 1) % 2;
}

// Checks if this move would put the turn player in check
function inCheck(piece, pos) {

    // Checks movements from pos for each type of piece.
    // Returns true if such an opposing piece exists in one of those locations.
    if (piece.abbr == "K") {
        var opp = pieceArr[(turn + 1) % 2];

        // Need to disable check and king position temporarily
        // so that full movement can be checked
        var k = kings[turn];
        piecePos.delete(k);

        var a = actor;
        kingPos = "";
        actor = "";

        // Checks if the king would be put in check in this position
        for (var i = 0; i < 5; i++) {
            for (let mov of getMovementOptions(pieceArr[turn][i], pos)) {
                if (piecePos.has(mov) && piecePos.get(mov).name == opp[i].name) {
                    piecePos.set(k, piece);
                    if (a != "") {
                        kingPos = k;
                        actor = a;
                    }
                    return mov;
                }
            }
        }
        piecePos.set(k, piece);
        if (a != "") {
            kingPos = k;
            actor = a;
        }

        var row = parseInt(pos.substring(1));
        var col = pos.charCodeAt(0);

        // Checks for the king separately so as to avoid infinite recursion loops
        for (var v = row - 1; v <= row + 1; v++) {
            for (var h = col - 1; h <= col + 1; h++) {
                var id = String.fromCharCode(h) + v;
    
                if (piecePos.has(id) && piecePos.get(id) == opp[5].name)
                    return id;
            }
        }
        return "";
    }
    // Return "" if not in check, or new position would take or block the actor checking the king.
    // Actor's position otherwise
    if (kingPos != "" && actor != pos && !blocking(actor, kingPos, pos))
        return actor;
    return "";
}

// Check if the piece is pinned
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

    // Checks for if the move is valid when pinned
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

    // Need to check if piece is in line with king first.
    var r = Math.abs(parseInt(start.substring(1)) - parseInt(end.substring(1)));
    var c = Math.abs(start.charCodeAt(0) - end.charCodeAt(0));

    if (r == 0 || c == 0 || r == c) {
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
    }
    return false;
}

// Gets the possible ways the king can perform a castle
function castleMovement() {

    var positions = [];
    // If the turn King has not yet moved
    if (kTurn[turn] == 0) {
        var row = 1 + (turn * 7);

        // Checks both initials rooks for the turn player
        for (var i = 0; i <= 1; i++) {
            if (rTurn[turn][i] == 0) {

                // Parse movement...
                var dir = getDirection(cKing[turn][i], cRook[turn][i])[1]; // Column dir only
                var col = 101; // Char code for 'e'

                // Required to prevent infinite loops when getting movement options
                // And if the king is currently in check
                var kPos = kings[turn];
                var ps = String.fromCharCode(col - dir) + row;
                var pc = "";
                if (piecePos.has(ps))
                    pc = piecePos.get(ps);
                kings[turn] = ps;

                var id = String.fromCharCode(col + dir) + row; // Adjacent pos to King
                var movs = getMovementOptions(pieceArr[turn][1], cRook[turn][i]);

                // Checks if the turn player can castle with this rook
                if (movs.includes(id)) {
                    var legal = true;

                    for (var j = 0; j <= 2; j++) {
                        id = String.fromCharCode(col + (dir * j)) + row;

                        if (inCheck(pieceArr[turn][5], id) != "") {
                            legal = false;
                            break;
                        }
                    }
                    if (legal)
                        positions.push(cKing[turn][i]);
                }
                kings[turn] = kPos;
                piecePos.delete(ps);
                if (pc != "")
                    piecePos.set(ps, pc);
            }
        }
    }
    return positions;
}

// Returns true if the player castles, false otherwise
function castle(piece, to, from) {

    // Uses the log to determine the number of turns that have passed
    var turnNumber = document.getElementById("moveLog").rows.length - turn;
    var row = 1 + (turn * 7);

    // Checks for if the piece is a king (or rook in else statement)
    if (piece.abbr == "K") {
        kings[turn] = to;

        // If the king has yet to move...
        if (kTurn[turn] == 0)
            kTurn[turn] = turnNumber;
        else
            return false;

        // If the turn player castles, then change the rook to the corresponding position
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

            return true;
        }
    // Can't castle with a rook that has already moved
    } else if (piece.abbr == "R" && cRook[turn].includes(from)) {
        var index = cRook[turn].indexOf(from);
        if (rTurn[turn][index] == 0)
            rTurn[turn][index] = turnNumber;
    }
    return false;
}

function canPassant(row, col) {
    return passant.charCodeAt(0) == col && row == passant.substring(1);
}

// Looks at the pawn movement, if any, for the current turn
// Returns a boolean value for logging purposes
function enPassant(piece, oldPos, newPos) {

    var pass = false;
    if (piece.abbr == "P") {

        // Checks if the turn player performed en passant
        if (pawnClr != "" && piece.color != pawnClr) {
            var row = parseInt(newPos.substring(1)) + getPawnDirection(pawnClr);

            if (passant == newPos.substring(0, 1) + row) {
                document.getElementById(passant).innerHTML = "";
                piecePos.delete(passant);
                pass = true;
            }
        }
        // Checks if their opponent can peform en passant on their next move
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

// Returns the approximate or exact (if in alignment) direction between 2 pieces
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

// Only checks vertical difference for pawns
function cmprPosition(oldPos, newPos, diff) {
    return Math.abs(parseInt(newPos.substring(1)) - parseInt(oldPos.substring(1))) == diff;
}