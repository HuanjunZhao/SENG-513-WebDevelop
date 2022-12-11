const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000; // use in Azure
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const names = ["Aiden", "Brianna", "Cameron", "Derek", "Emma", "Finn", "Gabriel", "Hannah", "Ian", "Jasmine", "Kaden", "Lena", "Maddox", "Nora", "Olivia", "Preston", "Quinn", "Riley", "Samantha", "Trevor", "Ursula", "Victoria", "William", "Xander", "Yara", "Zachary", "Ava", "Benjamin", "Charlie", "Daisy", "Eli", "Fiona", "Gemma", "Haley", "Isaac", "Julia", "Kaitlyn", "Logan", "Mia", "Nate", "Olive", "Parker", "Quincy", "Rylee", "Sophia", "Trenton", "Ubaldo", "Violet", "Wyatt", "Ximena", "Yvette", "Zane"]

const userDetail = {
        userName: '',
        password: '',
        email: '',
        userID: '',
        score: 0,
        win: 0,
        lose: 0,
        draw: 0,
        rank: 0,
        roomId: '',
        isReady: false,
        isPlaying: false,
        isGuest: null,
        timeLeft: null,
        myturn: false,
        message: '',
        messageQueue: [],
        roomStatus: ['Waiting', 'Waiting'],
    }
    // let index = 0;
    //EACH INDEX MEANS A ROOM WITH HOWMANY PLAYERS
let cunrrntPlayerinRoom = [0];
// how many rooms we have
let roomCounter = 0;
//log three room id
let roomIDs = [null];
//log who is in which room
let currentPeopleInRoom = [
    [null, null, null]
];
// turn for each room
let turn = [null];

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Handle socket connection requests from clients
const connections = [null];
io.on('connection', socket => {

    let playerIndex = -1;
    for (const i in connections) {

        if (connections[i] == null) {
            connections[i] = i;
            connections.push(null);
            playerIndex = i;
            break;
        }
    }

    // Tell the connecting client what player number they are
    socket.emit('player-number', playerIndex);


    socket.on('signup', (data) => {
        userDetail.userName = data[0];
        userDetail.password = data[1];
        console.log(userDetail);
        socket.emit('signupfeedback', '123');
    });


    // recieveNewUserData();

    //disconnect
    socket.on('disconnect', () => {
        connections[playerIndex] = null;
        socket.broadcast.emit('player-connection', playerIndex);
    });



    //chating
    socket.on('chat',(room,player,message)=>{
        console.log("receving chat form "+ room +"\n"+player+":"+message );
        io.sockets.emit('chat',player,message);
        // io.to(room).emit('chat',player,message); //should be change to code.
    })

});

//-----------------------------------------------------------------------------------------
//functions for sign up page
function recieveNewUserData() {
    //let unerdata = new userDetail();
    socket.on('signup', (data) => {
        userDetail.userName = data[0];
        userDetail.password = data[1];
    });
    console.log(userDetail);
    socket.emit('signupfeedback', '123');

}

//function to generate random name
function randomName() {
    userName = names[Math.floor(Math.random() * 50)];
}


function randomRoomName() {
    this.newRoomName
}



