var elem = "";
var id = "";
var backColor = "";
function go(clicked_id) {
    if (elem == "") {
        if (document.getElementById(clicked_id).innerHTML != "") {
            elem = document.getElementById(clicked_id).innerHTML;
            id = clicked_id;
            backColor = document.getElementById(id).style.backgroundColor;
            document.getElementById(id).style.backgroundColor = "#98FB98";
        }
    } else {
        if (id != clicked_id) {
            document.getElementById(clicked_id).innerHTML = elem;
            document.getElementById(id).innerHTML = "";
        }
        document.getElementById(id).style.backgroundColor = backColor;
        elem = "";
    }
}