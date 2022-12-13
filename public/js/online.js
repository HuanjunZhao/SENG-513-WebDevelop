const X_CLASS = 'x'
const O_CLASS = 'o'
const gridElements = document.querySelectorAll('[data-grid]')
const board = document.getElementById('grid')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const winningMessageElement = document.getElementById('winningMessage')
const quitButton = document.getElementById('quitButton')
const curtain = document.getElementById('curtain')
const skill1 = document.getElementById('skill1')
const skill2 = document.getElementById('skill2')
const skill3 = document.getElementById('skill3')
let curtainColor = 1
let xSkill1 = 0
let oSkill1 = 0
let xSkill2 = 0
let oSkill2 = 0
let xSkill3 = 0
let oSkill3 = 0
let iii = 0
let xTurn;
let yourturn;
let roomid;
let userid;

let readyToPlay = false;
const socket = io();


//onload detect the local storage to restore the game
window.onload = function() {
    let url = new URL(window.location.href);
    roomid = url.searchParams.get("roomid");
    userid = url.searchParams.get("userid");
    yourturn = parseInt(url.searchParams.get("player"));
    console.log(roomid);
    if(yourturn == 1){
        console.log('you are player 1');
    }
    if(yourturn == 2){
        console.log('you are player 2');
    }
    socket.emit('canIstart', {roomid, userid, yourturn});
};

socket.on('gamestart', data => {
    if (data == roomid) {
        console.log('gamestart','ready');
        readyToPlay = true;
        start();
    } else {
        console.log('gamestart','not ready');
    }
});

socket.on('placeStone', data => {
    if (data.roomid == roomid){
        placeStone(data.index, data.currentClass);
    }
})

socket.on('swapTurns', data => {
    if (data.roomid == roomid){
        swapTurns();
        //show 3 skill buttons if it is your turn
        if (xTurn && yourturn == 1) {
            if(xSkill1 > 0) skill1.classList.add('show');
            if(xSkill2 > 0) skill2.classList.add('show');
            if(xSkill3 > 0) skill3.classList.add('show');
        }else if (!xTurn && yourturn == 2) {
            if(oSkill1 > 0) skill1.classList.add('show');
            if(oSkill2 > 0) skill2.classList.add('show');
            if(oSkill3 > 0) skill3.classList.add('show');
        }
        //remove 3 skill buttons if it is not your turn
        if (xTurn && yourturn == 2) {
            skill1.classList.remove('show');
            skill2.classList.remove('show');
            skill3.classList.remove('show');
            curtain.classList.remove('show')
        }else if (!xTurn && yourturn == 1) {
            skill1.classList.remove('show');
            skill2.classList.remove('show');
            skill3.classList.remove('show');
            curtain.classList.remove('show')
        }
    }
})

socket.on('win', data => {
    if (data.roomid == roomid){
        endGame(false);
    }
})

socket.on('draw', data => {
    if (data.roomid == roomid){
        endGame(true);
    }
})


socket.on('randAdd', data => {
    if (data.roomid == roomid){
        //place stone
        gridElements[data.index].removeEventListener('click', handleClick)
        gridElements[data.index].classList.add(data.currentClass)
    }
})


socket.on('randRem', data => {
    if (data.roomid == roomid){
        //clear and add event listener
        gridElements[data.index].classList.remove(data.opponentClass)
        gridElements[data.index].removeEventListener('click', handleClick)
        gridElements[data.index].addEventListener('click', handleClick, { once: true })
    }
})

socket.on('invisible', data => {
    if (data.roomid == roomid){
        if(data.opponentClass == O_CLASS && yourturn == 2){
            curtain.style.backgroundColor = data.color
            curtain.classList.add('show')
        }
        if(data.opponentClass == X_CLASS && yourturn == 1){
            curtain.style.backgroundColor = data.color
            curtain.classList.add('show')
        }
    }
})

socket.on('start', data => {

    if (data.roomid == roomid){
        //initialize x
        if(yourturn == 1 && yourturn == data.isPlaying){


            skill1.addEventListener('click', randAdd)
            skill2.addEventListener('click', randRem)
            skill3.addEventListener('click', invisible)
            quitButton.addEventListener('click', quitGame)
            gridElements.forEach(grid => {
                grid.classList.remove(X_CLASS)
                grid.classList.remove(O_CLASS)
                grid.removeEventListener('click', handleClick)
                grid.addEventListener('click', handleClick, { once: true })
            })

            xSkill1 = data.s1;
            xSkill2 = data.s2;
            xSkill3 = data.s3;
            if(data.myturn){
                xTurn = true;
                skill1.classList.remove('show')
                skill2.classList.remove('show')
                skill3.classList.remove('show')
                if(xSkill1 > 0) skill1.classList.add('show');
                if(xSkill2 > 0) skill2.classList.add('show');
                if(xSkill3 > 0) skill3.classList.add('show');
                
            }else{
                xTurn = false;
                skill1.classList.remove('show')
                skill2.classList.remove('show')
                skill3.classList.remove('show')
                
            }
            for( let i = 0; i < data.x.length; i++){
                gridElements[data.x[i]].removeEventListener('click', handleClick)
                gridElements[data.x[i]].classList.add(X_CLASS)
            }
            for( let i = 0; i < data.o.length; i++){
                gridElements[data.o[i]].removeEventListener('click', handleClick)
                gridElements[data.o[i]].classList.add(O_CLASS)
            }      
        }
        //initialize o
        if(yourturn == 2 && yourturn == data.isPlaying){


            skill1.addEventListener('click', randAdd)
            skill2.addEventListener('click', randRem)
            skill3.addEventListener('click', invisible)
            gridElements.forEach(grid => {
                grid.classList.remove(X_CLASS)
                grid.classList.remove(O_CLASS)
                grid.removeEventListener('click', handleClick)
                grid.addEventListener('click', handleClick, { once: true })
            })
            oSkill1 = data.s1;
            oSkill2 = data.s2;
            oSkill3 = data.s3;
            if(data.myturn){
                xTurn = false;
                skill1.classList.remove('show')
                skill2.classList.remove('show')
                skill3.classList.remove('show')
                if(oSkill1 > 0) skill1.classList.add('show');
                if(oSkill2 > 0) skill2.classList.add('show');
                if(oSkill3 > 0) skill3.classList.add('show');
                
            }else{
                xTurn = true;
                skill1.classList.remove('show')
                skill2.classList.remove('show')
                skill3.classList.remove('show')
                
            }
            
            for( let i = 0; i < data.x.length; i++){
                gridElements[data.x[i]].removeEventListener('click', handleClick)
                gridElements[data.x[i]].classList.add(X_CLASS)
            }
            for( let i = 0; i < data.o.length; i++){
                gridElements[data.o[i]].removeEventListener('click', handleClick)
                gridElements[data.o[i]].classList.add(O_CLASS)
            }      
        }
        //hover
        setHover()
        //winning message disappear
        winningMessageElement.classList.remove('show')
    }
})


function start() {
    socket.emit('start', {roomid, userid});
}


function randAdd() {
    //one skill per turn
    skill1.classList.remove('show')
    skill2.classList.remove('show')
    skill3.classList.remove('show')
    if (xTurn && xSkill1 > 0) {
        //consume sill counter
        xSkill1 = xSkill1 - 1;
        var placeable = []
            //find available grid
        for (let i = 0; i < gridElements.length; i++) {
            if (gridElements[i].classList.length == 1) {
                placeable.push(i)
            }
        }
        //random
        var ran = placeable[Math.floor((Math.random() * placeable.length))];
        socket.emit("randAdd", {
            roomid: roomid,
            index: ran,
            currentClass: X_CLASS
        })
    } else if (!xTurn && oSkill1 > 0) {
        //consume sill counter
        oSkill1 = oSkill1 - 1;
        var placeable = []
            //find available grid
        for (let i = 0; i < gridElements.length; i++) {
            if (gridElements[i].classList.length == 1) {
                placeable.push(i)
            }
        }
        //random
        var ran = placeable[Math.floor((Math.random() * placeable.length))];
        socket.emit("randAdd", {
            roomid: roomid,
            index: ran,
            currentClass: O_CLASS
        })
    }

}

function randRem() {
    //one skill per turn
    skill1.classList.remove('show')
    skill2.classList.remove('show')
    skill3.classList.remove('show')
    if (xTurn && xSkill2 > 0) {
        //consume sill counter
        xSkill2 = xSkill2 - 1;
        var placeable = []
            //find exist white stone
        for (let i = 0; i < gridElements.length; i++) {
            if (gridElements[i].classList[1] == O_CLASS) {
                placeable.push(i)
            }
        }
        //random
        var ran = placeable[Math.floor((Math.random() * placeable.length))];
        socket.emit("randRem", {
            roomid: roomid,
            index: ran,
            opponentClass: O_CLASS
        })
    } else if (!xTurn && oSkill2 > 0) {
        //consume skill counter
        oSkill2 = oSkill2 - 1;
        var placeable = []
            //find exist blackk stone
        for (let i = 0; i < gridElements.length; i++) {
            if (gridElements[i].classList[1] == X_CLASS) {
                placeable.push(i)
            }
        }
        //random
        var ran = placeable[Math.floor((Math.random() * placeable.length))];
        socket.emit("randRem", {
            roomid: roomid,
            index: ran,
            opponentClass: X_CLASS
        })
    }
}

//invisible skill
function invisible() {
    //one skill per turn
    skill1.classList.remove('show')
    skill2.classList.remove('show')
    skill3.classList.remove('show')

    //black use black curtain
    if (xTurn && xSkill3 > 0) {
        curtainColor = 0
            //consume sill counter
        xSkill3 = xSkill3 - 1;
        socket.emit("invisible", {
            roomid: roomid,
            color: "black",
            opponentClass: O_CLASS
        })

        //white use white curtain
    } else if (!xTurn && oSkill3 > 0) {
        curtainColor = 1
            //consume sill counter
        oSkill3 = oSkill3 -1;
        socket.emit("invisible", {
            roomid: roomid,
            color: "white",
            opponentClass: X_CLASS
        })

    }

}

//handle click
function handleClick(e) {
    const grid = e.target
    if (!readyToPlay) {
        alert("Please wait for other player to join");
        grid.removeEventListener('click', handleClick)
        grid.addEventListener('click', handleClick, { once: true })
        return;
    }
    if (yourturn == 1 && xTurn == false) {
        alert("Please wait for your turn");
        grid.removeEventListener('click', handleClick)
        grid.addEventListener('click', handleClick, { once: true })
        return;
    }
    if (yourturn == 2 && xTurn == true) {
        alert("Please wait for your turn");
        grid.removeEventListener('click', handleClick)
        grid.addEventListener('click', handleClick, { once: true })
        return;
    }


    //get index of the grid
    getIndex(grid)
        //black or white turn
    const currentClass = xTurn ? X_CLASS : O_CLASS
    socket.emit('placeStone', { index: iii, currentClass: currentClass, roomid: roomid });
        //check apperance of the curtain
    if (curtain.classList.length == 2) {
        if (xTurn && curtainColor == 0) {

        } else if (!xTurn && curtainColor == 1) {

        } else {
            curtain.classList.remove('show')
        }
    }

    //winning
    if (winCheck(currentClass)) {
        socket.emit('win', { roomid: roomid });

        //draw
    } else if (isDraw()) {
        socket.emit('draw', { roomid: roomid });

        //continue
    } else {
        socket.emit('swapTurns', { roomid: roomid });
        setHover()
    }

}
//get index of current grid
function getIndex(grid) {
    for (let i = 0; i < gridElements.length; i++) {
        if (gridElements[i] == grid) {
            iii = i
            break
        }
    }
}

//place a stone
function placeStone(index, currentClass) {
    gridElements[index].classList.add(currentClass)
}

//win check
function winCheck(currentClass) {
    let ret = false
    //vertical
    let count = 1
    let i = iii
    while (i < 210 && gridElements[i + 15].classList[1] == currentClass) {
        count = count + 1
        i = i + 15
 
    }
    i = iii
    while (i > 14 && gridElements[i - 15].classList[1] == currentClass) {
        count = count + 1
        i = i - 15

    }
    if (count >= 5) {
        ret = true
    }

    //horizontal
    count = 1
    i = iii
    while (i < 224 && i % 15 < (i + 1) % 15 && gridElements[i + 1].classList[1] == currentClass) {
        count = count + 1
        i = i + 1

    }
    i = iii
    while (i > 0 && i % 15 > (i - 1) % 15 && gridElements[i - 1].classList[1] == currentClass) {
        count = count + 1
        i = i - 1

    }
    if (count >= 5) {
        ret = true
    }

    //diagonal 1
    count = 1
    i = iii
    while (i % 15 != 0 && i < 210 && gridElements[i + 14].classList[1] == currentClass) {
        count = count + 1
        i = i + 14

    }
    i = iii
    while (i % 15 != 14 && i > 14 && gridElements[i - 14].classList[1] == currentClass) {
        count = count + 1
        i = i - 14

    }
    if (count >= 5) {
        ret = true
    }
    //diagonal 2
    count = 1
    i = iii
    while (i % 15 != 14 && i < 210 && gridElements[i + 16].classList[1] == currentClass) {
        count = count + 1
        i = i + 16

    }
    i = iii
    while (i % 15 != 0 && i > 14 && gridElements[i - 16].classList[1] == currentClass) {
        count = count + 1
        i = i - 16

    }
    if (count >= 5) {
        ret = true
    }

    return ret
}

function isDraw() {
    return [...gridElements].every(grid => {
        return grid.classList.contains(X_CLASS) || grid.classList.contains(O_CLASS)
    })
}

function quitGame() {
    socket.emit('draw', { roomid: roomid });
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = "Draw!"
        socket.emit('drawPoint', {userid: userid, roomid: roomid});
    } else {
        if(yourturn == 1 && xTurn == true){
            socket.emit('winPoint', {userid: userid, roomid: roomid});
        }
        if(yourturn == 2 && xTurn == false){
            socket.emit('winPoint', {userid: userid, roomid: roomid});
        }
        winningMessageTextElement.innerText = `${xTurn ? "Black" : "White"} Wins!`
    }
    winningMessageElement.classList.add('show')
}

function swapTurns() {
    xTurn = !xTurn
}

function setHover() {
    if ( xTurn == true && yourturn == 1) {
        board.classList.add(X_CLASS)
    } 
    if ( xTurn == false && yourturn == 2){
        board.classList.add(O_CLASS)
    }
}

function getBack() {
    window.location.href = "homepage.html?userid=" + userid;
}

//***chating


socket.on('chat',(userId,message)=>{
    //console.log("receving chat form "+userId+":"+message );
    let msg = document.createElement("div");
    msg.className="chat_msg";
    msg.innerHTML = "<b>"+ userId +"</b>" +": "+message;
    document.querySelector('.chat_log').appendChild(msg);
})
function sendChatMsgListeners(){
    document.querySelector('[type=button][value=send]').addEventListener("click",function (){
        const message =  document.querySelector('.chat_box').value;
        if(message != null && message.length > 0)socket.emit('chat',roomid,userid,message);
        document.querySelector('.chat_box').value = "";
        //console.log('chat',roomid,userid,message);
    })
};

sendChatMsgListeners();

//***************
// non game-logic functions
//***************

function getUrlParam(name, url) {
    let u = arguments[1] || window.location.href,
        reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
        r = u.substr(u.indexOf("?") + 1).match(reg);
    return r != null ? decodeURI(r[2]) : "";
};
