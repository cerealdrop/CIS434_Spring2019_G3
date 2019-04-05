const Piece = {

    WHITE_PAWN: {name: "wPawn", icon: "&#9817", abbr: "P"},
    WHITE_ROOK: {name: "wRook", icon: "&#9814", abbr: "R"},
    WHITE_KNIGHT: {name: "wKnight", icon: "&#9816", abbr: "N"},
    WHITE_BISHOP: {name: "wBishop", icon: "&#9815", abbr: "B"},
    WHITE_QUEEN: {name: "wQueen", icon: "&#9813", abbr: "Q"},
    WHITE_KING: {name: "wKing", icon: "&#9812", abbr: "K"},

    BLACK_PAWN: {name: "bPawn", icon: "&#9823", abbr: "P"},
    BLACK_ROOK: {name: "bRook", icon: "&#9820", abbr: "R"},
    BLACK_KNIGHT: {name: "bKnight", icon: "&#9822", abbr: "N"},
    BLACK_BISHOP: {name: "bBishop", icon: "&#9821", abbr: "B"},
    BLACK_QUEEN: {name: "bQueen", icon: "&#9819", abbr: "Q"},
    BLACK_KING: {name: "bKing", icon: "&#9818", abbr: "K"},
    
    getPiece : function(icon) {
        return this[Object.keys(this).find(key => this[key].icon === icon)];
    }
}

function getMovementOptions(chessPiece) {

    switch(chessPiece.name) {
        case "wPawn": movPawn("white"); break;
        case "bPawn": movPawn("black"); break;

        case "wRook": movRook("white"); break;
        case "bRook": movRook("black"); break;

        case "wKnight": movKnight("white"); break;
        case "bKnight": movKnight("black"); break;

        case "wBishop": movBishop("white"); break;
        case "bBishop": movBishop("black"); break;

        case "wQueen": movQueen("white"); break;
        case "bQueen": movQueen("black"); break;

        case "wKing": movKing("white"); break;
        case "bKing": movKing("black");
    }
}

// displays pawn movement options
function movPawn(color) {

}

// displays rook movement options
function movRook(color) {

}

// displays knight movement options
function movKnight(color) {

}

// displays bishop movement options
function movBishop(color) {

}

// displays queen movement options
function movQueen(color) {

}

// displays king movement options
function movKing(color) {

}