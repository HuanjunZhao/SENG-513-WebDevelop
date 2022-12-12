// const socket = io();
var thisURL = document.URL;
var getval = thisURL.split('?')[1];
var userid = getval.split('=')[1];
const socket = io();
let isMatching = false;
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
    if (checkRoomid()) {var roomid = document.getElementById("roomid").value;
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

    if (isMatching === false){
        socket.emit('random_matching',userid);
        document.getElementById('join').innerHTML= "<span>Cancel Game Matching!</span>";
        isMatching = true
        console.log(userid + "request to match")
    }else{
        socket.emit('cancel_matching',userid);
        document.getElementById('join').innerHTML= "<span>Random Game Matching!</span>";
        isMatching = false;
        console.log(userid + "cancel to match")
    }
}
socket.on('waiting_for_matching',()=>{
    console.log("waiting for 2nd player to match");
})

socket.on('matching_found',(roomId,player1Id,player2Id)=>{
    let enemyId;
    player1Id === userid? enemyId = player2Id:enemyId=player1Id;
    window.location.href = "game.html?player1="+userid+"&player2=" + enemyId + "&roomid=" + roomId;
})

function logOut() {
    window.location.href = "index.html";
}

function getProfile() {
    window.location.href = "profile.html?userid=" + userid;
}

//***************
// non game-logic functions
//***************
