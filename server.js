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
// queue for random game matching
let matchingRoomQueue = [];
//dummy finised upon room function created
function roomData(roomId,playerIndices,gameId){
    this.roomId = roomId;
    this.playerIndicies = playerIndices;
    this.gameId = gameId;
}


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
        matchingRoomQueue = matchingRoomQueue.filter(room =>{
            if(!(room.playerIndicies.includes(playerIndex)))return true;
        })
    })


    //chating
    socket.on('chat',(roomId,userId,message)=>{
        console.log("receving chat form "+ roomId +"\n"+userId+":"+message );
        io.sockets.emit('chat',userId,message);
        io.to(roomId).emit('chat',userId,message);
    })

    //queue matching
    socket.on('random_matching',(userId) =>{
        if(matchingRoomQueue.length>=1){
            let matchingRoom = matchingRoomQueue[0];
            let roomId = matchingRoom.roomId;
            let anotherIndex = matchingRoom.playerIndicies[0];
            let player1Id = "player1Id"// To do: adding entry for reversing index to player Id
            let player2Id = "player2Id"// To do: adding entry for reversing index to player Id
            matchingRoom.playerIndicies[1]=playerIndex;
            socket.join(matchingRoom.roomId);
            //To do: create an active room game with room data above
            matchingRoomQueue = matchingRoomQueue.slice(1);//pop the first.
            io.to(roomId).emit('matching_found',roomId,player1Id,player2Id)
            console.log('matching found, remove the first matching room from matching roomList');
            console.log(matchingRoomQueue);

        }else{
            //To do :align with room design
            let roomId = userId;    //To do : I dont know what to set here.
            let gameId = userId;     //To do : I dont know what to set here.
            matchingRoomQueue.push(new roomData(roomId,[playerIndex,null],gameId));
            socket.join(roomId);
            socket.emit('waiting_for_matching');
            console.log('waiting for matching, current mathching roomList');
            console.log(matchingRoomQueue);
        }
    })

    socket.on('cancel_matching',(userId)=>{
        let room = matchingRoomQueue.find(item =>{return item.playerIndicies.includes(playerIndex)});
        let roomId = room.roomId;
        socket.leave(roomId);
        matchingRoomQueue = matchingRoomQueue.filter(room =>{
            if(!(room.playerIndicies.includes(playerIndex)))return true;
        })
        console.log('player '+userId+'cancel matching, current mathching roomList');
        console.log(matchingRoomQueue);
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



