// gets pawn movement options
function movPawn(clr, pos) {

    var col = pos.charCodeAt(0);
    var row = parseInt(pos.substring(1));
    var v = row;

    var incV = getPawnDirection(clr);
    var dist = incV;

    if (row == (9 + 2 * dist) % 9)
        dist *= 2;

    var movs = [];
    while (v != (row + dist)) {
        v += incV;

        if (Math.abs(v - row) == 1) {
            for (var h = (col - 1); h <= (col + 1); h += 2) {

                if (h > 96 && h < 105) {
                    var id = String.fromCharCode(h) + v;

                    // Checks if move is legal
                    if ((piecePos.has(id) && piecePos.get(id).color != clr || canPassant(row, h)) && inCheck(pieceArr[turn][0], id) == "")
                        movs.push(id);
                }
            }
        }
        var id = String.fromCharCode(col) + v;

        // Checks if move is legal
        if (!piecePos.has(id)) {
            if (inCheck(pieceArr[turn][0], id) == "")
                movs.push(id);
        } else {
            break;
        }
    }
    // Checks if piece is pinned
    var pin = getPin(pos);
    if (pin != "")
        return pinnedPositions(movs, pos, pin);
    return movs;
}

// gets rook movement options
function movRook(clr, pos) {

    var dim = [parseInt(pos.substring(1)), pos.charCodeAt(0)];
    var bounds = [0, 96];

    var movs = [];

    // Outer 2 loops determine direction
    for (var i = 0; i <= 1; i++) {
        for (var inc = -1; inc <= 1; inc += 2) {
            var x = dim[i] + inc;

            // Inner loop determines distance
            while (x > bounds[i] && x < bounds[i] + 9) {
                var id = String.fromCharCode(Math.max(x, dim[(i + 1) % 2])) + Math.min(x, dim[(i + 1) % 2]);

                // Checks if move is legal
                if (!piecePos.has(id)) {
                    if (inCheck(pieceArr[turn][1], id) == "")
                        movs.push(id);
                } else {
                    if (piecePos.get(id).color != clr && inCheck(pieceArr[turn][1], id) == "")
                        movs.push(id);
                    break;
                }
                x += inc;
            }
        }
    }
    // Checks if piece is pinned
    var pin = getPin(pos);
    if (pin != "")
        return pinnedPositions(movs, pos, pin);
    return movs;
}

// gets knight movement options
function movKnight(clr, pos) {

    var col = pos.charCodeAt(0);
    var row = parseInt(pos.substring(1));

    var movs = [];

    // Outer loop determines vertical positions
    for (var x = -2; x <= 2; x += (x + 3) % 3) {
        v = row + x;

        if (v > 0 && v < 9) {
            var y = (Math.abs(x) % 2) + 1;

            // Inner loop determines horizontal positions
            for (var z = -1; z <= 1; z += 2) {
                var h = col + z*y;

                if (h > 96 && h < 105) {
                    var id = String.fromCharCode(h) + v;
                    var out = id + " " + piecePos.has(id);

                    // Checks if move is legal
                    if (inCheck(pieceArr[turn][2], id) == "" && (!piecePos.has(id) || piecePos.get(id).color != clr))
                        movs.push(id);
                }
            }
        }
    }
    // Checks if piece is pinned
    var pin = getPin(pos);
    if (pin != "")
        return pinnedPositions(movs, pos, pin);
    return movs;
}

// gets bishop movement options
function movBishop(clr, pos) {

    var col = pos.charCodeAt(0);
    var row = parseInt(pos.substring(1));

    var movs = [];

    // Outer 2 loops determine direction while inner loop determines distance
    for (var incV = -1; incV <= 1; incV += 2) {
        for (var incH = -1; incH <=1; incH += 2) {
            var v = row + incV;
            var h = col + incH;

            while (v > 0 && v < 9 && h > 96 && h < 105) {
                var id = String.fromCharCode(h) + v;

                // Checks if move is legal
                if (!piecePos.has(id)) {
                    if (inCheck(pieceArr[turn][3], id) == "")
                        movs.push(id);
                } else {
                    if (piecePos.has(id) && piecePos.get(id).color != clr && inCheck(pieceArr[turn][3], id) == "")
                        movs.push(id);
                    break;
                }
                v += incV;
                h += incH;
            }
        }
    }
    // Checks if piece is pinned
    var pin = getPin(pos);
    if (pin != "")
        return pinnedPositions(movs, pos, pin);
    return movs;
}

// gets queen movement options using relative movements for rook and bishop
function movQueen(color, pos) {
    return movRook(color, pos).concat(movBishop(color, pos));
}

// gets king movement options
function movKing(clr, pos) {

    var col = pos.charCodeAt(0);
    var row = parseInt(pos.substring(1));

    var movs = [];

    // Outer 2 loops determine direction while inner code determines distance
    for (var v = row - 1; v <= row + 1; v++) {

        if (v > 0 && v < 9) {
            for (var h = col - 1; h <= col + 1; h++) {

                if (h > 96 && h < 105) {
                    var id = String.fromCharCode(h) + v;

                    // Checks if move is legal
                    if (id != pos && (!piecePos.has(id) || piecePos.get(id).color != clr) && inCheck(pieceArr[turn][5], id) == "")
                        movs.push(id);
                }
            }
        }
    }
    // Gets castle movement if any
    var cstl = castleMovement();
    return movs.concat(cstl);
}