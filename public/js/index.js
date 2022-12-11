// const socket = io();
var thisURL = document.URL;
var getval = thisURL.split('?')[1];
var userid = getval.split('=')[1];

document.getElementById("user").innerHTML = "Hello, User " + userid;

function checkRoomid() {
    var roomid = document.getElementById("roomid").value;
    if ((roomid.length == 0)) {
        alert("Friend ID can't be empty");
        return false;
    }
    // send id to server to check if the room is exist
    // if not exist, alert "Room not found"

    // socket.emit("room", room)
    // socket.on("checkexist", message => {
    //     if (message == "not found") {
    //         alert("Room not found");
    //         return false;
    //     }
    // })
    return true;
}

function getForm() {
    document.getElementById('findid').style.display = 'block';
    document.getElementById('join').style.display = 'none';
    let form = document.querySelector('form');
    form.style.top = '55%';
}

function getRoom() {
    if (checkRoomid()) {
        var roomid = document.getElementById("roomid").value;
        // send room id to server to check if the room is exist
        // if has, check the room status
        // if two players are ready, room is full
        // if one player is ready, game is ready, join

        // socket.emit("roomgame", room)
        // socket.on("checkroom", message => {
        //     if (message == "full") {
        //         alert("Game is full");
        //         return;
        //     }
        //     if (message == "ready") {
        window.location.href = "game.html?player1=" + userid + "&roomid=" + roomid;
        //     }
        // })
    } else
        return;
}


function getBack() {
    document.getElementById('findid').style.display = 'none';
    document.getElementById('join').style.display = 'inline';
}

function getRandom() {
    // soket.emit("random", userid);
    // socket.on("random", enemyid => {
    //    window.location.href = "game.html?player1="+userid+"&player2="+enemyid;
    // })
}

function logOut() {
    window.location.href = "index.html";
}

function getProfile() {
    window.location.href = "profile.html?userid=" + userid;
}