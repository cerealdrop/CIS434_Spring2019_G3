var piece = "";
var pos = "";

var backColors = [];
var movs = [];

function move(clicked_id) {

    if (piece == "") {

        var icon = getIconValue(clicked_id);
        if (!isNaN(icon)) {
            piece = Piece.getPiece(icon);
            pos = clicked_id;

            backColors.push(document.getElementById(pos).style.backgroundColor);
            document.getElementById(pos).style.backgroundColor = "#98FB98"; //98FB98

            movs = getMovementOptions(piece, pos);
            highlightBackColors();
        }
    } else {

        if (movs.includes(clicked_id)) {
            document.getElementById(clicked_id).innerHTML = "<h1>" + String.fromCharCode(piece.icon) + "</h1>";
            document.getElementById(pos).innerHTML = "";
        }
        document.getElementById(pos).style.backgroundColor = backColors.shift();
        piece = "";
        pos = "";

        clearHighlights();
    }
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
