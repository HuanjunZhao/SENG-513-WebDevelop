// const socket = io();
var thisURL = document.URL;
var getval = thisURL.split('?')[1];
var userid = getval.split('=')[1];

var wins = 0;
var winrate = 0;
var rank = 0;

// get user profile from server
// socket.on("profile", functino(wins, winrate, rank) => {
//     document.getElementById("wins").innerHTML = wins;
//     document.getElementById("winrate").innerHTML = winrate;
//     document.getElementById("rank").innerHTML = rank;
// })

function logOut(){
    window.location.href = "landing.html";
}

function getBack(){
    window.location.href = "homepage.html?userid="+userid;
}

