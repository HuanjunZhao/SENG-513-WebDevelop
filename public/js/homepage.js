const socket = io();
var thisURL = document.URL;
var getval = thisURL.split('?')[1];
var userid = getval.split('=')[1];
let status1 = 0;
let roomid = 0;

document.getElementById("user").innerHTML = "Hello, " + userid;

//get the room list
socket.on('status', para => {
    //convert the para to int
    status1 = parseInt(para);
    checkRoomid();
});

function checkRoomid() {
    if (status1 == 400) {
        alert("Room is full");
        return false;
    } else if (status1 == 200) {
        alert("Room is ready");
        roomid = document.getElementById("roomid").value;
        window.location.href = "online.html?userid=" + userid + "&roomid=" + roomid + "&player=1";
        return true;
    } else if (status1 == 201) {
        alert("Room is ready");
        roomid = document.getElementById("roomid").value;
        window.location.href = "online.html?userid=" + userid + "&roomid=" + roomid + "&player=2";
        return true;
    } else if (status1 == 404) {
        alert("Room is not exist");
        return false;
    }
    alert("Server error, please try again later.");
    return false;
}

function getForm() {
    document.getElementById('findid').style.display = 'block';
    document.getElementById('join').style.display = 'none';
    let form = document.querySelector('form');
}

function getRoom() {
    //send the signal to server to get the room list
    roomid = document.getElementById("roomid").value;
    console.log(roomid);
    socket.emit('currentRoom', [roomid, userid]);
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