// const socket = io();
var thisURL = document.URL;
var getval = thisURL.split('?')[1];
var userid = getval.split('=')[1];

document.getElementById("user").innerHTML = "Hello, User "+userid;

function checkFriendid() {
    var friend = document.getElementById("friendid").value;
    if ((friend.length == 0)) {
        alert("Friend ID can't be empty");
        return false;
    }
    // send id to server to check if the user is exist
    // if not exist, alert "User not found"
    
    // socket.emit("friend", friend)
    // socket.on("checkexist", message => {
    //     if (message == "not found") {
    //         alert("User not found");
    //         return false;
    //     }
    // })
    return true;
}

function getForm(){
    document.getElementById('findid').style.display = 'block';
    document.getElementById('join').style.display = 'none';
    let form = document.querySelector('form');
    form.style.top = '55%';
    document.getElementById('').style.display = 'block';
}

function getFriend(){
    if(checkFriendid()){
        var friend = document.getElementById("friendid").value;
        // send friend id to server to check if the user has a game or not
        // if has, check the game status
        // if two players are ready, game is full, wait
        // if one player is ready, game is ready, join
    
        // socket.emit("friendgame", friend)
        // socket.on("checkfriend", message => {
        //     if (message == "full") {
        //         alert("Game is full, please wait");
        //         return;
        //     }
        //     if (message == "ready") {
                window.location.href = "game.html?player1="+userid+"&player2="+friend;
        //     }
        // })
    }
    else
        return;
}


function getBack(){
    document.getElementById('findid').style.display = 'none';
    document.getElementById('join').style.display = 'inline';
}

function getRandom(){
    // soket.emit("random", userid);
    // socket.on("random", enemyid => {
    //    window.location.href = "game.html?player1="+userid+"&player2="+enemyid;
    // })
}

function logOut(){
    window.location.href = "login.html";
}