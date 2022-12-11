const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000; // use in Azure
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

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

    // Ignore player
    // if (playerIndex === -1) return;

    // // Tell everyone else what player number just connected
    // socket.broadcast.emit('player-connection', playerIndex);

    // // name check
    // io.emit('all-players-name', currentPeopleInRoom);

    // //Haldle room creation
    // socket.on('roomIDandName', para => {
    //     //check if the player is reconnecting
    //     for (let index = 0; index < roomIDs.length; index++) {
    //         if (roomIDs[index] == para[0]) {
    //             for (let j = 0; j < 3; j++) {
    //                 if (currentPeopleInRoom[index][j] == para[1]) {
    //                     return;
    //                 }
    //             }
    //         }
    //     }

    //     //sign room in server
    //     for (let i = 0; i < roomIDs.length; i++) {
    //         //create a new room
    //         if (roomIDs[i] === null) {
    //             roomIDs[i] = para[0];

    //             for (let index = 0; index < 3; index++) {
    //                 if (currentPeopleInRoom[i][index] === null) {
    //                     currentPeopleInRoom[i][index] = para[1];
    //                     break;
    //                 }
    //             }
    //             roomCounter++;
    //             cunrrntPlayerinRoom[i]++;
    //             roomIDs.push(null);
    //             currentPeopleInRoom.push([null, null, null]);
    //             turn.push(null);
    //             cunrrntPlayerinRoom.push(0);
    //             break;
    //         }
    //         //Add player to existed room
    //         if (para[0] == roomIDs[i]) {
    //             console.log("123:" + para[1]);
    //             cunrrntPlayerinRoom[i]++;
    //             for (let index = 0; index < 3; index++) {
    //                 if (currentPeopleInRoom[i][index] === null) {
    //                     currentPeopleInRoom[i][index] = para[1];
    //                     break;
    //                 }
    //             }

    //             io.emit('currentPeopleInRoom', [currentPeopleInRoom[i], roomIDs[i]]);
    //             //If the room is full, send the game start signal
    //             if (cunrrntPlayerinRoom[i] == parseInt(3)) {
    //                 turn[i] = currentPeopleInRoom[i][0];
    //                 io.emit('turn', [currentPeopleInRoom[i][0], roomIDs[i]]);
    //                 io.emit('allplayerReady', roomIDs[i]);
    //                 io.emit('currentPeopleInRoom', [currentPeopleInRoom[i], roomIDs[i]]);
    //             }
    //             break;
    //         }
    //     }
    // });

    // socket.emit('currentRoom', roomIDs);
    // socket.emit('roomCounter', roomCounter);

    // //Update the paly progress to others players: turn
    // socket.on('this-turn', para => {

    //     //Find the room first
    //     for (let index = 0; index < roomIDs.length; index++) {
    //         //If the room is found, update the turn and move to others
    //         if (para[2] == roomIDs[index]) {
    //             turn[index] = para[0];
    //             if (turn[index] == currentPeopleInRoom[index][0]) {


    //                 if (para[1]) {
    //                     io.emit('turn', [currentPeopleInRoom[index][0], para[2]]);
    //                     turn[index] = currentPeopleInRoom[index][0];
    //                     return;
    //                 } else {
    //                     io.emit('turn', [currentPeopleInRoom[index][1], para[2]]);
    //                     turn[index] = currentPeopleInRoom[index][1];

    //                     return;
    //                 }
    //             }
    //             if (turn[index] == currentPeopleInRoom[index][1]) {

    //                 if (para[1]) {
    //                     io.emit('turn', [currentPeopleInRoom[index][1], para[2]]);
    //                     turn[index] = currentPeopleInRoom[index][1];
    //                     return;
    //                 } else {
    //                     io.emit('turn', [currentPeopleInRoom[index][2], para[2]]);
    //                     turn[index] = currentPeopleInRoom[index][2];
    //                     return;
    //                 }
    //             }
    //             if (turn[index] == currentPeopleInRoom[index][2]) {
    //                 if (para[1]) {
    //                     io.emit('turn', [currentPeopleInRoom[index][2], para[2]]);
    //                     turn[index] = currentPeopleInRoom[index][2];
    //                     return;
    //                 } else {
    //                     io.emit('turn', [currentPeopleInRoom[index][0], para[2]]);
    //                     turn[index] = currentPeopleInRoom[index][0];
    //                     return;
    //                 }
    //             }
    //         }
    //     }
    // });

    // //Update the paly progress to others players: move
    // socket.on('update-lineID', data => {
    //     console.log("update-lineID: " + data);
    //     io.emit('line-id', data);
    // });

    //disconnect
    socket.on('disconnect', () => {
        connections[playerIndex] = null;
        socket.broadcast.emit('player-connection', playerIndex);
    });

    //make the name reuseable when game is over
    // socket.on('clearNames', para => {
    //     console.log("clearNames: " + para);
    //     for (let index = 0; index < roomIDs.length; index++) {
    //         if (para[1] == roomIDs[index]) {
    //             for (let i = 0; i < 3; i++) {
    //                 if (currentPeopleInRoom[index][i] == para[0]) {
    //                     currentPeopleInRoom[index][i] = "PlayerLeft";
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    // });
});

// toastr.options = {
//     'timeOut': 2000,
//     'showDuration': 200,
//     'hideDuration': 200,
//     'preventDuplicates': true,
//     'positionClass': 'toast-top-center',
//   };
//   const roomStatus = ['等待中', '進行中'];
//   const names = [
//     "AlphaGo", "Brynn", "Chrissy", "Delphine", "Esther", "Freddy", "Georgine",
//     "Hillary", "Ianthe", "Jaclyn", "Kimberlee", "Loise", "Michell", "Nancey",
//     "Octavia", "Patrice", "Queenie", "Raynell", "Sharl", "Tiffany", "Ulrica",
//     "Valene", "Wilone", "Xylina", "Ysabel", "Zorine",
//   ];

//   let app = new Vue({
//     el: '#app',
//     data: {
//       scenes: 'initial',
//       userName: '',
//       newRoomName: '',
//       color: '',
//       connection: new signalR.HubConnectionBuilder().withUrl("/gobangHub").build(),
//       pieceArray: (function() {
//         let arr = new Array(16);
//         for (let i = 0; i <= 15; i++) {
//           arr[i] = new Array(16);
//         }
//         return arr;
//       })(),
//       userCount: 1,
//       roomList: [],
//       roomId: '',
//       playerList: [],
//       playerColors: ['', ''],
//       isLoaded: false,
//       isReady: false,
//       isPlaying: false,
//       isGuest: null,
//       timeLeft: null,
//       turnIndex: null,
//       readyArray: [false, false],
//       latestPiece: null,
//       message: '',
//       messageQueue: [],
//       samples: ['安安', '快一點~~', '好了啦 !'],
//     },
//     methods: {
//       startSignalR() {
//         try {
//           this.connection.start();
//         } catch (err) {
//           console.log('三秒後重新連線');
//           console.log(err);
//           setTimeout(this.startSignalR, 3000);
//         }
//       },
//       randomName() {
//         this.userName = names[Math.floor(Math.random() * 26)];
//       },
//       randomRoomName() {
//         this.newRoomName = `Build School ${Math.floor(Math.random() * 999)}`;
//       },
//       joinHall() {
//         if (this.userName === '') {
//           toastr.error('請輸入ID');
//           return;
//         }
//         this.connection.invoke('CreateUser', app.userName);
//         this.scenes = 'hall';
//       },
//       createRoom(e) {
//         if (this.newRoomName === '') {
//           toastr.error('請輸入房間名稱');
//           e.preventDefault();
//           return;
//         }
//         this.connection.invoke('CreateRoom', app.newRoomName);
//         this.scenes = 'room';
//         this.$nextTick(() => {
//           this.setBoard();
//         });
//       },
//       joinRoom(roomId) {
//         this.connection.invoke('JoinRoom', roomId);
//         this.scenes = 'room';
//         this.roomId = roomId;
//         this.$nextTick(() => {
//           this.setBoard();
//           this.resumeLeaveBtn();
//         });
//       },
//       leaveRoom() {
//         this.connection.invoke('LeaveRoom', this.roomId);
//         this.scenes = 'hall';
//         this.color = '';
//         this.roomId = '';
//         this.isLoaded = false;
//         this.isReady = false;
//         this.isPlaying = false;
//         this.isGuest = null;
//         this.timeLeft = null;
//         this.turnIndex = null;
//         this.playerList = [];
//         this.message = '';
//         this.messageQueue = [];
//       },
//       becomePlayer() {
//         this.connection.invoke('BecomePlayer', this.roomId);
//       },
//       setBoard() {
//         //畫棋盤
//         let board = Snap('#board');
//         let lineGroup = board.g();
//         let dotGroup = board.g();
//         let pieceGroup = board.g();
//         for (let i = 1; i <= 15; i++) {
//           let line = board.line(39.5, i * 40, 600.5, i * 40);
//           lineGroup.add(line);
//         }
//         for (let i = 1; i <= 15; i++) {
//           let line = board.line(i * 40, 39.5, i * 40, 600.5);
//           lineGroup.add(line);
//         }
//         dotGroup.add(
//           board.circle(160, 160, 3.5),
//           board.circle(160, 480, 3.5),
//           board.circle(320, 320, 3.5),
//           board.circle(480, 160, 3.5),
//           board.circle(480, 480, 3.5),
//         );
//         dotGroup.attr('fill', 'rgb(117, 74, 45)');
//         //綁定XY座標
//         for (let y = 1; y <= 15; y++) {
//           for (let x = 1; x <= 15; x++) {
//             let piece = board.circle(x * 40, y * 40, 16.5);
//             piece.addClass('piece');
//             pieceGroup.add(piece);
//             this.pieceArray[y][x] = piece.node;
//             this.pieceArray[y][x].x = x;
//             this.pieceArray[y][x].y = y;
//             this.pieceArray[y][x].onclick = this.setPiece;
//           }
//         }
//         //更新雙方棋子
//         this.connection.on('UpdateBoard', function(x, y, color) {
//           let piece = app.pieceArray[y][x];
//           if (app.latestPiece) {
//             app.latestPiece.classList.remove('latest');
//           }
//           app.latestPiece = piece;
//           if (app.color) {
//             piece.classList.remove(app.color);
//           }
//           piece.classList.add('active', 'latest', color);
//           piece.onclick = null;
//         });
//       },
//       setPiece(e) {
//         this.disableBoard();
//         this.connection.invoke('SetPiece', this.roomId, e.target.x, e.target.y, this.color)
//           .catch(function(err) {
//             return console.error(err.toString());
//           });
//       },
//       ready() {
//         this.connection.invoke('Ready', this.roomId);
//         this.isReady = true;
//       },
//       unready() {
//         this.connection.invoke('Unready', this.roomId);
//         this.isReady = false;
//       },
//       disableBoard() {
//         app.$el.querySelector('#board').classList.remove('my-turn');
//       },
//       sendMessage() {
//         if (this.message == '') return;
//         this.connection.invoke('SendMessage', this.roomId, this.message);
//         this.message = '';
//       },
//       sendSample(msg) {
//         this.connection.invoke('SendMessage', this.roomId, msg);
//       },
//       focusInput() {
//         document.querySelector('#modal-room-name input').focus();
//       },
//       clearRoomName() {
//         this.newRoomName = '';
//       },
//       resumeLeaveBtn() {
//         document.querySelector('#room #leave-room').removeAttribute('disabled');
//       },
//       closeGameResult(e) {
//         e.target.closest('#end-game').classList.remove('show');
//       },
//     },
//     computed: {
//       isNotConnected() {
//         return this.connection.state != 'Connected';
//       },
//       getMyIndex() {
//         let myIndex = -1;
//         this.playerList.forEach((player, i) => {
//           if (player.ConnectionId == app.connection.connectionId) myIndex = i;
//         });
//         return myIndex;
//       },
//       readyBtnControl() {
//         return this.isPlaying ||
//           this.isGuest ||
//           this.playerList.length < 2;
//       },
//       leaveBtnControl() {
//         if (this.isGuest) return false;
//         if (this.isReady || this.isPlaying) return true;
//       },
//       warnTime() {
//         return this.timeLeft <= 5;
//       },
//     },
//     created: function() {
//       this.startSignalR();
//       this.connection.on('CancelReady', function() {
//         app.isReady = false;
//       });
//       this.connection.on('UpdateUserCount', function(count) {
//         app.userCount = count;
//       });
//       this.connection.on('UpdateRoomList', function(roomList) {
//         let list = JSON.parse(roomList);
//         list.forEach((room) => {
//           room.RoomStatus = roomStatus[room.RoomStatus];
//         });
//         app.roomList = list;
//       });
//       this.connection.on('UpdateReadyPlayer', function(data) {
//         app.readyArray = JSON.parse(data);
//       });
//       this.connection.on('MyColor', function(color) {
//         app.color = '';
//         app.color = color;
//       });
//       this.connection.on('ReturnRoomId', function(roomId) {
//         app.roomId = roomId;
//         app.resumeLeaveBtn();
//       });
//       this.connection.on('ReturnIsPlaying', function(isPlaying) {
//         app.isPlaying = isPlaying;
//       });
//       this.connection.on('ReturnIsGuest', function(isGuest) {
//         app.isGuest = isGuest;
//       });
//       this.connection.on('ReturnPlayers', function(playerList) {
//         app.playerList = JSON.parse(playerList);
//         app.isLoaded = true;
//       });
//       this.connection.on('ReturnPlayerColor', function(data) {
//         app.playerColors = JSON.parse(data);
//       });
//       this.connection.on('ReturnPieceData', function(pieceData) {
//         pieceData.forEach((data) => {
//           let piece = app.pieceArray[data[1]][data[0]];
//           piece.classList.add('active');
//           piece.classList.add(data[2] == 1 ? 'black' : 'white');
//         });
//       });
//       this.connection.on('UpdateTimeLeft', function(timeLeft) {
//         app.timeLeft = timeLeft;
//       });
//       this.connection.on('StartGame', function() {
//         app.isPlaying = true;
//         app.isReady = false;
//         app.readyArray = [false, false];
//         for (let y = 1; y <= 15; y++) {
//           for (let x = 1; x <= 15; x++) {
//             app.pieceArray[y][x].onclick = app.setPiece;
//             app.pieceArray[y][x].classList.remove('active', 'black', 'white');
//             if (app.color) app.pieceArray[y][x].classList.add(app.color);
//           }
//         }
//         if (app.latestPiece) app.latestPiece.classList.remove('latest');
//       });
//       this.connection.on('EndGame', function(winner) {
//         let winnerText = winner === 'black' ? '黑子' : '白子';
//         let endGame = app.$el.querySelector('#end-game');

//         endGame.classList.add('show');
//         endGame.querySelector('.winner').textContent = winnerText;
//         setTimeout(() => {
//           endGame.classList.remove('show');
//         }, 5000);

//         app.isPlaying = false;
//         app.timeLeft = null;
//         app.turnIndex = null;
//         app.playerColors = ['', ''];
//         app.disableBoard();
//       });
//       this.connection.on('ReturnTurnIndex', function(turnIndex) {
//         app.turnIndex = turnIndex;
//       });
//       this.connection.on('ControlBoard', function(isMyTurn) {
//         if (isMyTurn)
//           app.$el.querySelector('#board').classList.add('my-turn');
//       });
//       this.connection.on('UpdateMessage', function(data) {
//         app.messageQueue.push({
//           id: data.connectionId,
//           user: data.userName,
//           message: data.message,
//         });
//         if (app.messageQueue.length > 40) {
//           app.messageQueue.shift();
//         }
//         app.$nextTick(() => {
//           let output = app.$el.querySelector('#panel .output');
//           output.scrollTop = output.scrollHeight;
//         });
//       });
//       this.$nextTick(() => {
//         this.$el.querySelector('#initial input').focus();
//       });
//     },
//   });