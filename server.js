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
        for(let i = 0; i < users.user.length; i++){
            if(users.user[i].id === newUser.id){
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
        for(let i = 0; i < users.user.length; i++){
            if(users.user[i].id === data.userid && users.user[i].password === data.pass){
                console.log("login success");
                //send feedback 1 to client
                socket.emit('login', {state: 1, id: data.userid});
                return;
            }
        }
        //send feedback 0 to client
        socket.emit('login', {state: 0, id: data.userid});
        return;
    })

//-------------------AFTER_LOGIN-------------------
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
    });

});

//-----------------------------------------------------------------------------------------

//function to generate random name
function randomName() {
    userName = names[Math.floor(Math.random() * 50)];
}


function randomRoomName() {
    this.newRoomName
}