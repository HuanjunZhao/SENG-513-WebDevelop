const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

let roomcounter = []; //count up to 2
let roomturn = []; //store turns, should be zero; maybe not needed
let RoomNumber = []; //store all room ids
let Rooms = [];//all rooms with player names //2d array

//set static folder
app.use(express.static(path.join(__dirname,"public")));

//start server
server.listen(PORT, () => console.log(`server running on port ${PORT}`));

// handle a socket connection request from web client
io.on('connection', socket => {


    
});