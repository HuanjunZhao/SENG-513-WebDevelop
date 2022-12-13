const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000; // use in Azure
const socketIO = require('socket.io');
const e = require('express');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

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
            point: 0,
            room: 0,
            isPlaying: 0,
            myturn: false,
            x: [],
            o: [],
            s1: 3,
            s2: 3,
            s3: 3
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
                if(users.user[i].isPlaying > 0){
                    //send feedback 2 to client
                    socket.emit('login', { state: 2, id: data.userid, room: users.user[i].room, isPlaying: users.user[i].isPlaying });
                    return;
                }else{
                    //send feedback 1 to client
                    socket.emit('login', { state: 1, id: data.userid });
                    return;
                }
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
            return;
        }
        //room already have two player
        if (gameIndex > -1 && cunrrntPlayerinRoom[gameIndex] == 2) {
            socket.emit('status', '400');
            return;
        }
    });

    socket.on('canIstart', (data) => {
        let update = getUser(data.userid);
        update.isPlaying = data.yourturn;
        update.room = data.roomid;
        updateUser(update);
        if (cunrrntPlayerinRoom[roomIDs.indexOf(data.roomid)] == 2) {
            gamestart(data.roomid);
        }else{
            update.myturn = true;
            updateUser(update);
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
    });


    //-----------------------------------GAME_PLAY--------------------------------------------------
    
    socket.on('start', (data) => {
        let update = getUser(data.userid);
        console.log("cnm nirenne",update);
        if(update.isPlaying == 1){
            io.emit('start', {
                isPlaying: update.isPlaying,
                roomid: update.room,
                myturn: update.myturn,
                x: update.x,
                o: update.o,
                s1: update.s1,
                s2: update.s2,
                s3: update.s3
            });
        }
        if(update.isPlaying == 2){
            io.emit('start', {
                isPlaying: update.isPlaying,
                roomid: update.room,
                myturn: update.myturn,
                x: update.x,
                o: update.o,
                s1: update.s1,
                s2: update.s2,
                s3: update.s3
            });
        }
    })
    
    socket.on('placeStone', (data) => {
        console.log(data);
        let update = getUserRoom(data.roomid);
        for (let i = 0; i < update.length; i++) {
            if(data.currentClass == 'x'){
                update[i].x.push(data.index);
                updateUser(update[i]);
            }

            if(data.currentClass == 'o'){
                update[i].o.push(data.index);
                updateUser(update[i]);
            }
        }
        io.emit('placeStone', data);
    });

    socket.on('swapTurns', (data) => {
        let update = getUserRoom(data.roomid);
        for (let i = 0; i < update.length; i++) {
            if(update[i].myturn == true){
                update[i].myturn = false;
                updateUser(update[i]);
            }else{
                update[i].myturn = true;
                updateUser(update[i]);
            }
        }
        io.emit('swapTurns', data);
    });

    socket.on('win', (data) => {
        io.emit('win', data);
    });

    socket.on('draw', (data) => {
        io.emit('draw', data);
    });

    socket.on('randAdd', (data) => {
        let update = getUserRoom(data.roomid);
        for (let i = 0; i < update.length; i++) {
            if(data.currentClass == 'x'){
                update[i].x.push(data.index);
                if(update[i].isPlaying == 1){
                    update[i].s1 -= 1;
                }

            }else if(data.currentClass == 'o'){
                update[i].o.push(data.index);
                if(update[i].isPlaying == 2){
                    update[i].s1 -= 1;
                }
            }
            updateUser(update[i]);
        }
        io.emit('randAdd', data);
    });

    socket.on('randRem', (data) => {
        let update = getUserRoom(data.roomid);
        for (let i = 0; i < update.length; i++) {
            if(data.opponentClass == 'x' ){
                for (let j = 0; j < update[i].x.length; j++) {
                    if(update[i].x[j] == data.index){
                        update[i].x.splice(j, 1);
                    }
                }
                if(update[i].isPlaying == 2){
                    update[i].s2 -= 1;
                }
            }else if(data.opponentClass == 'o'){
                for (let j = 0; j < update[i].o.length; j++) {
                    if(update[i].o[j] == data.index){
                        update[i].o.splice(j, 1);
                    }
                }
                if(update[i].isPlaying == 1){
                    update[i].s2 -= 1;
                }
            }
            updateUser(update[i]);

            
        }
        io.emit('randRem', data);
    });

    //someone use invisible
    socket.on('invisible', (data) => {
        let update = getUserRoom(data.roomid);
        for (let i = 0; i < update.length; i++) {
            if(data.color == "black" && update[i].isPlaying == 1){
                update[i].s3 -= 1;
                updateUser(update[i]);
            }

            if(data.color == "white" && update[i].isPlaying == 2){
                update[i].s3 -= 1;
                updateUser(update[i]);
            }
        }
        io.emit('invisible', data);
    });

    //draw and update status for both player
    socket.on('drawPoint', (data) => {
        clearRoomData(data.roomid);
        let update = getUserRoom(data.roomid);
        for (let i = 0; i < update.length; i++) {
            update[i].point += 1;
            update[i].room = "";
            update[i].isPlaying = 0;
            update[i].myturn = false;
            update[i].x = [];
            update[i].o = [];
            update[i].s1 = 3;
            update[i].s2 = 3;
            update[i].s3 = 3;
            update[i].total += 1;
            updateUser(update[i]);
        }
        return;
    });

    //someone win and update status for both player
    socket.on('winPoint', (data) => {
        clearRoomData(data.roomid);
        let update = getUserRoom(data.roomid);
        for (let i = 0; i < update.length; i++) {
            if(data.userid == update[i].id){
                update[i].point += 2;
                update[i].wins += 1;
            }
            update[i].room = "";
            update[i].isPlaying = 0;
            update[i].myturn = false;
            update[i].x = [];
            update[i].o = [];
            update[i].s1 = 3;
            update[i].s2 = 3;
            update[i].s3 = 3;
            update[i].total += 1;
            updateUser(update[i]);
        }
        return;
    });

    //get user data by id
    function getUser(id) {
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
            if (users.user[i].id === id) {
                //send feedback
                return users.user[i];
            }
        }
        //send feedback
        console.log("User not exist");
        return;
    }

    //update user data
    function updateUser(user) {
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
            if (users.user[i].id === user.id) {
                //send feedback
                users.user[i] = user;
                fs.writeFileSync("users.json", JSON.stringify(users));
                console.log(user.id + " updated");
                return;
            }
        }
        //send feedback
        console.log("User not exist");
        return;
    }

    //get user data by room
    function getUserRoom(room) {
        let user = [];
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
            if (users.user[i].room === room) {
                //send feedback
                user.push(users.user[i]);
            }
        }
        //send feedback
        if(user.length == 0){
            console.log("User not exist");
            return;
        }
        return user;
    }
//-------------------------------PROFILE----------------------------------------------------------
    socket.on('profile', (data) => {
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
        let rank = 1;
        //check if user already exist
        for (let i = 0; i < users.user.length; i++) {
            if (users.user[i].id === data) {
                //send feedback
                for (let j = 0; j < users.user.length; j++) {
                    if(users.user[i].point < users.user[j].point){
                        rank += 1;
                    }
                }
                let winrate = users.user[i].wins / users.user[i].total;
                io.emit('profile', {userid: users.user[i].id, wins: users.user[i].wins, rate: winrate, ranking: rank});
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

