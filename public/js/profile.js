const socket = io();
var thisURL = document.URL;
var getval = thisURL.split('?')[1];
var userid = getval.split('=')[1];

var wins = 0;
var winrate = 0;
var rank = 0;

//get user profile from server
function getProfile() {
    //console.log(userid);
    socket.emit("profile", userid);
}

getProfile();

socket.on("profile", data => {
    if (data.userid == userid) {
        document.getElementById("wins").innerHTML = data.wins;
        document.getElementById("winrate").innerHTML = data.rate;
        document.getElementById("rank").innerHTML = data.ranking;
    }
    return;
})

function logOut() {
    window.location.href = "index.html";
}

function getBack() {
    window.location.href = "homepage.html?userid=" + userid;
}