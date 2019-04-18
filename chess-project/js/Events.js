var pos = "";

var backColors = [];
var movs = [];

function action(clicked_id) {

    if (pos == "") {
        if (piecePos.has(clicked_id) && isTurn(piecePos.get(clicked_id).color)) {
            pos = clicked_id;

            backColors.push(document.getElementById(pos).style.backgroundColor);
            document.getElementById(pos).style.backgroundColor = "#98FB98"; //98FB98

            movs = getMovementOptions(piecePos.get(pos), pos);
            highlightBackColors();
        }
    } else {
        if (movs.includes(clicked_id)) {
            document.getElementById(clicked_id).innerHTML = "<h1>" + String.fromCharCode(piecePos.get(pos).icon) + "</h1>";
            document.getElementById(pos).innerHTML = "";

            // Will eventually be moved into the check for castling
            if (piecePos.get(pos).abbr == "K")
                kings[turn] = clicked_id;

            var mov = piecePos.get(pos);
            var take = null;
            if (piecePos.has(clicked_id)) {
                take = piecePos.get(clicked_id);
                piecePos.delete(clicked_id);
            }
            piecePos.set(clicked_id, mov);
            piecePos.delete(pos);

            castle(mov, clicked_id, pos);
            var pass = enPassant(mov, pos, clicked_id);
            setCheckIfTrue(clicked_id);
            nextTurn();

            displayMoveNotation(mov, take, pos, clicked_id, pass);
        }
        document.getElementById(pos).style.backgroundColor = backColors.shift();
        pos = "";

        clearHighlights();
    }
}