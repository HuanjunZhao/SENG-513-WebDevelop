const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

let roomcounter = []; //count up to 2
let roomturn = []; //store turns, should be zero; (maybe not needed)
let Matches = []; //[2d arrays]
let Usernames = [];//all usernames **database
let Password = [];//all password **database
let rank = [];// **database

//set static folder
app.use(express.static(path.join(__dirname,"public")));

//start server
server.listen(PORT, () => console.log(`server running on port ${PORT}`));

// handle a socket connection request from web client
io.on('connection', socket => {

    //should be checking w/ database**
    socket.on('check-name', kname =>{
        let nameexit = false;
        for(let i = 0; i < Usernames.length; i++){
            if (Usernames[i] === kname){
                nameexit = true;
                break;
            }
        }
        console.log(nameexit);
        socket.emit('valid-name', nameexit); //true if invalid, false if validname
    });

     //when player enters the gameboard, k: room, name
    socket.on('init-room', Username =>{
        console.log(Username);
        socket.userID = Username;
        console.log("uerID:")
        console.log(socket.userID);
        //finding matches
        let matched = false;
        //find an existing one
        for(let i = 0; i < roomcounter.length; i++){
            if(roomcounter[i] = 1){
                roomcounter[i] = 2;
                Matches[i][1] = Username;
                io.emit("game-ready",Matches[i]);
                matched = false;
                break;
            }
        }

        //into a new match
        if (matched == false) {
            roomcounter.push(1);
            let newmatch = [null,null];
            newmatch[0] = Username;
            Matches.push(newmatch);
        }
    });
    
    

});