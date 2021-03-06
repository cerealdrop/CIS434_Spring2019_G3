// Enum Class containing the predefined values for every piece
const Piece = {

    WHITE_PAWN: { name: "wPawn", icon: 9817, color: "White", abbr: "P", value: 1 },
    WHITE_ROOK: { name: "wRook", icon: 9814, color: "White", abbr: "R", value: 5 },
    WHITE_KNIGHT: { name: "wKnight", icon: 9816, color: "White", abbr: "N", value: 3 },
    WHITE_BISHOP: { name: "wBishop", icon: 9815, color: "White", abbr: "B", value: 3 },
    WHITE_QUEEN: { name: "wQueen", icon: 9813, color: "White", abbr: "Q", value: 9 },
    WHITE_KING: { name: "wKing", icon: 9812, color: "White", abbr: "K", value: 4 },

    BLACK_PAWN: { name: "bPawn", icon: 9823, color: "Black", abbr: "P", value: -1 },
    BLACK_ROOK: { name: "bRook", icon: 9820, color: "Black", abbr: "R", value: -5 },
    BLACK_KNIGHT: { name: "bKnight", icon: 9822, color: "Black", abbr: "N", value: -3 },
    BLACK_BISHOP: { name: "bBishop", icon: 9821, color: "Black", abbr: "B", value: -3 },
    BLACK_QUEEN: { name: "bQueen", icon: 9819, color: "Black", abbr: "Q", value: -9 },
    BLACK_KING: { name: "bKing", icon: 9818, color: "Black", abbr: "K", value: -4 },
}

const pieceArr = [[Piece.WHITE_PAWN, Piece.WHITE_ROOK, Piece.WHITE_KNIGHT, Piece.WHITE_BISHOP, Piece.WHITE_QUEEN, Piece.WHITE_KING],
                  [Piece.BLACK_PAWN, Piece.BLACK_ROOK, Piece.BLACK_KNIGHT, Piece.BLACK_BISHOP, Piece.BLACK_QUEEN, Piece.BLACK_KING]];

var kings = ["e1", "e8"];

const clrDir = {
    White: 1,
    Black: -1
}
// check along line that king is being checked by
// switch to enum values
var piecePos = new Map([["a1", Piece.WHITE_ROOK], ["b1", Piece.WHITE_KNIGHT], ["c1", Piece.WHITE_BISHOP], ["d1", Piece.WHITE_QUEEN],
                        ["e1", Piece.WHITE_KING], ["f1", Piece.WHITE_BISHOP], ["g1", Piece.WHITE_KNIGHT], ["h1", Piece.WHITE_ROOK],
                        ["a2", Piece.WHITE_PAWN], ["b2", Piece.WHITE_PAWN], ["c2", Piece.WHITE_PAWN], ["d2", Piece.WHITE_PAWN],
                        ["e2", Piece.WHITE_PAWN], ["f2", Piece.WHITE_PAWN], ["g2", Piece.WHITE_PAWN], ["h2", Piece.WHITE_PAWN],
                        ["a7", Piece.BLACK_PAWN], ["b7", Piece.BLACK_PAWN], ["c7", Piece.BLACK_PAWN], ["d7", Piece.BLACK_PAWN],
                        ["e7", Piece.BLACK_PAWN], ["f7", Piece.BLACK_PAWN], ["g7", Piece.BLACK_PAWN], ["h7", Piece.BLACK_PAWN],
                        ["a8", Piece.BLACK_ROOK], ["b8", Piece.BLACK_KNIGHT], ["c8", Piece.BLACK_BISHOP], ["d8", Piece.BLACK_QUEEN],
                        ["e8", Piece.BLACK_KING], ["f8", Piece.BLACK_BISHOP], ["g8", Piece.BLACK_KNIGHT], ["h8", Piece.BLACK_ROOK]]);

// Returns the piece associated with
// the given abbreviation and color.
function getPieceFromAbbr(abbr, color) {

    var name = color.toUpperCase() + "_";
    switch(abbr) {

        case "P": return Piece[name + "PAWN"];

        case "R": return Piece[name + "ROOK"];

        case "N": return Piece[name + "KNIGHT"];

        case "B": return Piece[name + "BISHOP"];

        case "Q": return Piece[name + "QUEEN"];

        case "K": return Piece[name + "KING"];

        // Return undefined if not found
        default: return undefined;
    }
}

// Calls functions to highlight valid and disable invalid moves
function getMovementOptions(chessPiece, pos) {

    switch(chessPiece.abbr) {

        case "P": return movPawn(chessPiece.color, pos);

        case "R": return movRook(chessPiece.color, pos);

        case "N": return movKnight(chessPiece.color, pos);

        case "B": return movBishop(chessPiece.color, pos);

        case "Q": return movQueen(chessPiece.color, pos);

        case "K": return movKing(chessPiece.color, pos);

        default: return new Array();
    }
}

// Gets direction of pawn movement
function getPawnDirection(color) {
    return clrDir[color];
}

// not fully implemented yet
function rankUp(piece, pos) {

    var row = 1 + (((turn + 1) % 2) * 7);
    if (piece.abbr == "P" && parseInt(pos.substring(1)) == row) {
        ps = pos;
        document.getElementById("Q").innerHTML = "<h1>" + String.fromCharCode(getPieceFromAbbr("Q", turnPlayer[turn]).icon) + "</h1>";
        document.getElementById("B").innerHTML = "<h1>" + String.fromCharCode(getPieceFromAbbr("B", turnPlayer[turn]).icon) + "</h1>";
        document.getElementById("R").innerHTML = "<h1>" + String.fromCharCode(getPieceFromAbbr("R", turnPlayer[turn]).icon) + "</h1>";
        document.getElementById("N").innerHTML = "<h1>" + String.fromCharCode(getPieceFromAbbr("N", turnPlayer[turn]).icon) + "</h1>";
        document.getElementById("overlay").style.display = "block";
        return true;
    }
    return false;
}