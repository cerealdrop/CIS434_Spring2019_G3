const Piece = {

    WHITE_PAWN: { name: "wPawn", icon: 9817, color: "White", abbr: "P" },
    WHITE_ROOK: { name: "wRook", icon: 9814, color: "White", abbr: "R" },
    WHITE_KNIGHT: { name: "wKnight", icon: 9816, color: "White", abbr: "N" },
    WHITE_BISHOP: { name: "wBishop", icon: 9815, color: "White", abbr: "B" },
    WHITE_QUEEN: { name: "wQueen", icon: 9813, color: "White", abbr: "Q" },
    WHITE_KING: { name: "wKing", icon: 9812, color: "White", abbr: "K" },

    BLACK_PAWN: { name: "bPawn", icon: 9823, color: "Black", abbr: "P" },
    BLACK_ROOK: { name: "bRook", icon: 9820, color: "Black", abbr: "R" },
    BLACK_KNIGHT: { name: "bKnight", icon: 9822, color: "Black", abbr: "N" },
    BLACK_BISHOP: { name: "bBishop", icon: 9821, color: "Black", abbr: "B" },
    BLACK_QUEEN: { name: "bQueen", icon: 9819, color: "Black", abbr: "Q" },
    BLACK_KING: { name: "bKing", icon: 9818, color: "Black", abbr: "K" },
    
    getPiece : function(icon) { return this[Object.keys(this).find(key => this[key].icon === icon)]; }
}

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

// Calls functions to highlight valid and disable invalid moves
function getMovementOptions(chessPiece, pos) {

    switch(chessPiece.name.substring(1)) {

        case "Pawn": return movPawn(chessPiece.color, pos);

        case "Rook": return movRook(chessPiece.color, pos);

        case "Knight": return movKnight(chessPiece.color, pos);

        case "Bishop": return movBishop(chessPiece.color, pos);

        case "Queen": return movQueen(chessPiece.color, pos);

        case "King": return movKing(chessPiece.color, pos);

        default: return new Array();
    }
}

function getDirection(color) {
    return clrDir[color];
}

function rankUp(pos) {
    
}
