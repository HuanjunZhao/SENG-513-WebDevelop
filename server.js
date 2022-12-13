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
let cunrrntPlayerinRoom = [];
// how many rooms we have
let roomCounter = 0;
//log three room id
let roomIDs = [];
//log who is in which room
let currentPeopleInRoom = [];
// turn for each room
let turn = [];
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

    //-------------------HANDLE_LOGIN-------------------
    //new user sign up
    socket.on('signup', (data) => {
        const fs = require('fs');

        //check if file exist
        if (!fs.existsSync('users.json')) {
            //create new file if not exist
            console.log("User file not exist, please contact admin");
            return;
        }
        // read file
        const file = fs.readFileSync('users.json');
        //create new user
        const newUser = {
            id: data.userid,
            password: data.pass,
            point: 0
        }
        const users = JSON.parse(file.toString());
        //check if user already exist
        for (let i = 0; i < users.user.length; i++) {
            if (users.user[i].id === newUser.id) {
                console.log("User already exist");
                //send feedback 0 to client
                socket.emit('signup', 0);
                return;
            }
        }
        //append data to json file
        //add json element to json object
        users.user.push(newUser);
        fs.writeFileSync("users.json", JSON.stringify(users));
        //send feedback 1 to client
        socket.emit('signup', 1);
        return;
    });

    //user login
    socket.on('login', (data) => {
        const fs = require('fs');

        //check if file exist
        if (!fs.existsSync('users.json')) {
            //create new file if not exist
            console.log("User file not exist, please contact admin");
            return;
        }
        // read file
        const file = fs.readFileSync('users.json');
        //create new user
        const users = JSON.parse(file.toString());
        //check if user already exist
        for (let i = 0; i < users.user.length; i++) {
            if (users.user[i].id === data.userid && users.user[i].password === data.pass) {
                console.log("login success");
                //send feedback 1 to client
                socket.emit('login', { state: 1, id: data.userid });
                return;
            }
        }
        //send feedback 0 to client
        socket.emit('login', { state: 0, id: data.userid });
        return;
    })


    //-------------------MATCH_FRIEND-------------------


    socket.on('currentRoom', (data) => {
        console.log(data);
        //check if room null
        if (data[0] == '') {
            socket.emit('status', '404');
            return;
        }
        let gameIndex = roomIDs.indexOf(data[0]);
        //check if room not exist
        if (gameIndex == -1) {
            roomIDs.push(data[0]);
            roomCounter++;
            cunrrntPlayerinRoom.push(1);
            currentPeopleInRoom.push([data[1], null]);
            turn.push(data[1]);
            socket.emit('status', '200');
            return;
        }
        //room already have one player
        if (gameIndex > -1 && cunrrntPlayerinRoom[gameIndex] == 1) {
            cunrrntPlayerinRoom[gameIndex]++;
            currentPeopleInRoom[gameIndex][1] = data[1];
            socket.emit('status', '201');
            //gamestart(gameIndex);
            return;
        }
        //room already have two player
        if (gameIndex > -1 && cunrrntPlayerinRoom[gameIndex] == 2) {
            socket.emit('status', '400');
            return;
        }
    });

    socket.on('canIstart', (data) => {
        if (cunrrntPlayerinRoom[roomIDs.indexOf(data)] == 2) {
            console.log("send data to all client");
            gamestart(data);
        }
    });


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

    //-----------------------------------GAME_PLAY--------------------------------------------------
    socket.on('placeStone', (data) => {
        console.log(data);
        io.emit('placeStone', data);
    });

    socket.on('swapTurns', (data) => {
        io.emit('swapTurns', data);
    });

    socket.on('win', (data) => {
        io.emit('win', data);
    });

    socket.on('draw', (data) => {
        io.emit('draw', data);
    });

    socket.on('randAdd', (data) => {
        io.emit('randAdd', data);
    });

    socket.on('randRem', (data) => {
        io.emit('randRem', data);
    });

    socket.on('invisible', (data) => {
        io.emit('invisible', data);
    });

    socket.on('drawPoint', (data) => {
        clearRoomData(data.roomid);
        const fs = require('fs');

        //check if file exist
        if (!fs.existsSync('users.json')) {
            //create new file if not exist
            console.log("User file not exist, please contact admin");
            return;
        }
        // read file
        const file = fs.readFileSync('users.json');
        const users = JSON.parse(file.toString());
        //check if user already exist
        for (let i = 0; i < users.user.length; i++) {
            if (users.user[i].id === data.userid) {
                //send feedback
                users.user[i].point += 1;
                fs.writeFileSync("users.json", JSON.stringify(users));
                console.log("Point updated");
                return;
            }
        }
        //send feedback
        console.log("User not exist");
        return;
    });

    socket.on('winPoint', (data) => {
        clearRoomData(data.roomid);
        const fs = require('fs');

        //check if file exist
        if (!fs.existsSync('users.json')) {
            //create new file if not exist
            console.log("User file not exist, please contact admin");
            return;
        }
        // read file
        const file = fs.readFileSync('users.json');
        const users = JSON.parse(file.toString());
        //check if user already exist
        for (let i = 0; i < users.user.length; i++) {
            if (users.user[i].id === data.userid) {
                //send feedback
                users.user[i].point += 2;
                fs.writeFileSync("users.json", JSON.stringify(users));
                console.log("Point updated");
                return;
            }
        }
        //send feedback
        console.log("User not exist");
        return;
    });


});








//-----------------------------------FUNCTION--------------------------------------------------
function gamestart(room) {
    io.emit('gamestart', room);
}

function clearRoomData(room) {
    let index = roomIDs.indexOf(room);
    roomIDs.splice(index, 1);
    cunrrntPlayerinRoom.splice(index, 1);
    currentPeopleInRoom.splice(index, 1);
    turn.splice(index, 1);
    roomCounter--;
}