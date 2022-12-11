const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000; // use in Azure
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);


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

    // Ignore player
    if (playerIndex === -1) return;

    // Tell everyone else what player number just connected
    socket.broadcast.emit('player-connection', playerIndex);

    // name check
    io.emit('all-players-name', currentPeopleInRoom);

    //Haldle room creation
    socket.on('roomIDandName', para => {
        //check if the player is reconnecting
        for (let index = 0; index < roomIDs.length; index++) {
            if (roomIDs[index] == para[0]) {
                for (let j = 0; j < 3; j++) {
                    if (currentPeopleInRoom[index][j] == para[1]) {
                        return;
                    }
                }
            }
        }

        //sign room in server
        for (let i = 0; i < roomIDs.length; i++) {
            //create a new room
            if (roomIDs[i] === null) {
                roomIDs[i] = para[0];

                for (let index = 0; index < 3; index++) {
                    if (currentPeopleInRoom[i][index] === null) {
                        currentPeopleInRoom[i][index] = para[1];
                        break;
                    }
                }
                roomCounter++;
                cunrrntPlayerinRoom[i]++;
                roomIDs.push(null);
                currentPeopleInRoom.push([null, null, null]);
                turn.push(null);
                cunrrntPlayerinRoom.push(0);
                break;
            }
            //Add player to existed room
            if (para[0] == roomIDs[i]) {
                console.log("123:" + para[1]);
                cunrrntPlayerinRoom[i]++;
                for (let index = 0; index < 3; index++) {
                    if (currentPeopleInRoom[i][index] === null) {
                        currentPeopleInRoom[i][index] = para[1];
                        break;
                    }
                }

                io.emit('currentPeopleInRoom', [currentPeopleInRoom[i], roomIDs[i]]);
                //If the room is full, send the game start signal
                if (cunrrntPlayerinRoom[i] == parseInt(3)) {
                    turn[i] = currentPeopleInRoom[i][0];
                    io.emit('turn', [currentPeopleInRoom[i][0], roomIDs[i]]);
                    io.emit('allplayerReady', roomIDs[i]);
                    io.emit('currentPeopleInRoom', [currentPeopleInRoom[i], roomIDs[i]]);
                }
                break;
            }
        }
    });

    socket.emit('currentRoom', roomIDs);
    socket.emit('roomCounter', roomCounter);

    //Update the paly progress to others players: turn
    socket.on('this-turn', para => {

        //Find the room first
        for (let index = 0; index < roomIDs.length; index++) {
            //If the room is found, update the turn and move to others
            if (para[2] == roomIDs[index]) {
                turn[index] = para[0];
                if (turn[index] == currentPeopleInRoom[index][0]) {


                    if (para[1]) {
                        io.emit('turn', [currentPeopleInRoom[index][0], para[2]]);
                        turn[index] = currentPeopleInRoom[index][0];
                        return;
                    } else {
                        io.emit('turn', [currentPeopleInRoom[index][1], para[2]]);
                        turn[index] = currentPeopleInRoom[index][1];

                        return;
                    }
                }
                if (turn[index] == currentPeopleInRoom[index][1]) {

                    if (para[1]) {
                        io.emit('turn', [currentPeopleInRoom[index][1], para[2]]);
                        turn[index] = currentPeopleInRoom[index][1];
                        return;
                    } else {
                        io.emit('turn', [currentPeopleInRoom[index][2], para[2]]);
                        turn[index] = currentPeopleInRoom[index][2];
                        return;
                    }
                }
                if (turn[index] == currentPeopleInRoom[index][2]) {
                    if (para[1]) {
                        io.emit('turn', [currentPeopleInRoom[index][2], para[2]]);
                        turn[index] = currentPeopleInRoom[index][2];
                        return;
                    } else {
                        io.emit('turn', [currentPeopleInRoom[index][0], para[2]]);
                        turn[index] = currentPeopleInRoom[index][0];
                        return;
                    }
                }
            }
        }
    });

    //Update the paly progress to others players: move
    socket.on('update-lineID', data => {
        console.log("update-lineID: " + data);
        io.emit('line-id', data);
    });

    //disconnect
    socket.on('disconnect', () => {
        connections[playerIndex] = null;
        socket.broadcast.emit('player-connection', playerIndex);
    });

    //make the name reuseable when game is over
    socket.on('clearNames', para => {
        console.log("clearNames: " + para);
        for (let index = 0; index < roomIDs.length; index++) {
            if (para[1] == roomIDs[index]) {
                for (let i = 0; i < 3; i++) {
                    if (currentPeopleInRoom[index][i] == para[0]) {
                        currentPeopleInRoom[index][i] = "PlayerLeft";
                        break;
                    }
                }
            }
        }
    });
});