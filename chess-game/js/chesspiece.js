const Piece = {

    WHITE_PAWN: { name: "wPawn", icon: 9817, color: "white", abbr: "P" },
    WHITE_ROOK: { name: "wRook", icon: 9814, color: "white", abbr: "R" },
    WHITE_KNIGHT: { name: "wKnight", icon: 9816, color: "white", abbr: "N" },
    WHITE_BISHOP: { name: "wBishop", icon: 9815, color: "white", abbr: "B" },
    WHITE_QUEEN: { name: "wQueen", icon: 9813, color: "white", abbr: "Q" },
    WHITE_KING: { name: "wKing", icon: 9812, color: "white", abbr: "K" },

    BLACK_PAWN: { name: "bPawn", icon: 9823, color: "black", abbr: "P" },
    BLACK_ROOK: { name: "bRook", icon: 9820, color: "black", abbr: "R" },
    BLACK_KNIGHT: { name: "bKnight", icon: 9822, color: "black", abbr: "N" },
    BLACK_BISHOP: { name: "bBishop", icon: 9821, color: "black", abbr: "B" },
    BLACK_QUEEN: { name: "bQueen", icon: 9819, color: "black", abbr: "Q" },
    BLACK_KING: { name: "bKing", icon: 9818, color: "black", abbr: "K" },
    
    getPiece : function(icon) { return this[Object.keys(this).find(key => this[key].icon === icon)]; }
}

var passant = "z0";

var castleChkW = false;
var castleQSW = "c1";
var castleKSW = "g1";

var castleChkB = false;
var castleQSB = "c8";
var castleKSB = "g8";

// Calls functions to highlight valid and disable invalid moves
function getMovementOptions(chessPiece, pos) {

    switch(chessPiece.name) {

        case "wPawn": return movPawn("white", pos);
        case "bPawn": return movPawn("black", pos);

        case "wRook": return movRook("white", pos);
        case "bRook": return movRook("black", pos);

        case "wKnight": return movKnight("white", pos);
        case "bKnight": return movKnight("black", pos);

        case "wBishop": return movBishop("white", pos);
        case "bBishop": return movBishop("black", pos);

        case "wQueen": return movQueen("white", pos);
        case "bQueen": return movQueen("black", pos);

        case "wKing": return movKing("white", pos);
        case "bKing": return movKing("black", pos);

        default: return new Array();
    }
}

// displays pawn movement options
function movPawn(clr, pos) {

    var col = pos.charCodeAt(0);
    var row = parseInt(pos.substring(1));
    var v = row;

    var incV = 1;
    var dist = 1;
    if (clr === "white" && row == 2)
        dist = 2;

    if (clr === "black") {
        incV = -1;
        dist = -1;

        if (row == 7)
            dist = -2;
    }

    var movs = [];
    while (v != (row + dist)) { // boolean expression (v > 1 && v < 8) doesn't matter for pawns
        v += incV;

        if (Math.abs(v - row) == 1) {
            for (var h = (col - 1); h <= (col + 1); h += 2) {

                if (h > 96 && h < 105) {
                    var id = String.fromCharCode(h) + v;
                    var piece = Piece.getPiece(getIconValue(id));

                    if ((piece != null && piece.color != clr) || (passant.charCodeAt(0) == h && row == passant.substring(1))) // && !pinned()
                        movs.push(id);
                }
            }
        }
        var id = String.fromCharCode(col) + v;

        if (isNaN(getIconValue(id)))
            movs.push(id);
        else
            break;
    }
    return movs;
}

// displays rook movement options
function movRook(color, pos) {
    return [];
}

// displays knight movement options
function movKnight(color, pos) {
    return [];
}

// displays bishop movement options
function movBishop(color, pos) {
    return [];
}

// displays queen movement options
function movQueen(color, pos) {
    return [];
}

// displays king movement options
function movKing(color, pos) {
    return [];
}

function getIconValue(id) {
    return document.getElementById(id).innerHTML.charCodeAt(4);
}
