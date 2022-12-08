const socket = io();

let MyName = "";
//let Myopponant = "";
let MyMatch = [];
let Mycolor = -1; //0 is white; 1 is black; white goes first
let Myturn = false;

window.onload = function() {
    let url = new URL(window.location.href);
    MyName = url.searchParams.get("username");
    console.log(MyName);
    socket.emit('init-room', MyName);
}

socket.on('game-ready', k =>{
    let recieved_p1 = k[0];
    let recieved_p2 = k[1];
    //determine my match
    if(MyName === recieved_p1){
        MyMatch = k;
        Myturn = true;
        Mycolor = 0;
    } else if(MyName === recieved_p2){
        MyMatch = k;
        Myturn = false;
        Mycolor = 1;
    }
});

