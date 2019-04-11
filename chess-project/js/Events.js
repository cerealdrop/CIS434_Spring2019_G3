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

            if (piecePos.has(clicked_id))
                piecePos.delete(clicked_id);
            piecePos.set(clicked_id, piecePos.get(pos));
            piecePos.delete(pos);
            enPassant(piecePos.get(clicked_id), pos, clicked_id);
            nextTurn();
        }
        document.getElementById(pos).style.backgroundColor = backColors.shift();
        piece = "";
        pos = "";

        clearHighlights();
    }
}