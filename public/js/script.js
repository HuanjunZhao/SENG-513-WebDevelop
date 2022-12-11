const X_CLASS = 'x'
const O_CLASS = 'o'
const gridElements = document.querySelectorAll('[data-grid]')
const board = document.getElementById('grid')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
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
let xTurn
const socket = io();
const roomId =  getUrlParam("roomid");
const playerId = getUrlParam("player1");
//all magic happened here
start()

restartButton.addEventListener('click', start)

function start() {
    //initialize
    xTurn = true
    xSkill1 = 0
    oSkill1 = 0
    xSkill2 = 0
    oSkill2 = 0
    xSkill3 = 0
    oSkill3 = 0
    skill1.classList.add('show')
    skill2.classList.add('show')
    skill3.classList.add('show')
    gridElements.forEach(grid => {
            grid.classList.remove(X_CLASS)
            grid.classList.remove(O_CLASS)
            grid.removeEventListener('click', handleClick)
            skill1.addEventListener('click', randAdd)
            skill2.addEventListener('click', randRem)
            skill3.addEventListener('click', invisible)
            grid.addEventListener('click', handleClick, { once: true })
        })
        //hover
    setHover()
        //winning message disappear
    winningMessageElement.classList.remove('show')

}


function randAdd() {
    //one skill per turn
    skill1.classList.remove('show')
    skill2.classList.remove('show')
    skill3.classList.remove('show')
    if (xTurn && xSkill1 < 3) {
        //consume sill counter
        xSkill1 = xSkill1 + 1
        var placeable = []
            //find available grid
        for (let i = 0; i < gridElements.length; i++) {
            if (gridElements[i].classList.length == 1) {
                placeable.push(i)
            }
        }
        //random
        var ran = placeable[Math.floor((Math.random() * placeable.length))];
        //place stone
        gridElements[ran].classList.add(X_CLASS)
    } else if (!xTurn && oSkill1 < 3) {
        //consume sill counter
        oSkill1 = oSkill1 + 1
        var placeable = []
            //find available grid
        for (let i = 0; i < gridElements.length; i++) {
            if (gridElements[i].classList.length == 1) {
                placeable.push(i)
            }
        }
        //random
        var ran = placeable[Math.floor((Math.random() * placeable.length))];
        //place stone
        gridElements[ran].classList.add(O_CLASS)
    }

}

function randRem() {
    //one skill per turn
    skill1.classList.remove('show')
    skill2.classList.remove('show')
    skill3.classList.remove('show')
    if (xTurn && xSkill2 < 3) {
        //consume sill counter
        xSkill2 = xSkill2 + 1
        var placeable = []
            //find exist white stone
        for (let i = 0; i < gridElements.length; i++) {
            if (gridElements[i].classList[1] == O_CLASS) {
                placeable.push(i)
            }
        }
        //random
        var ran = placeable[Math.floor((Math.random() * placeable.length))];
        //clear and add event listener
        gridElements[ran].classList.remove(O_CLASS)
        gridElements[ran].removeEventListener('click', handleClick)
        gridElements[ran].addEventListener('click', handleClick, { once: true })
    } else if (!xTurn && oSkill2 < 3) {
        //consume skill counter
        oSkill2 = oSkill2 + 1
        var placeable = []
            //find exist blackk stone
        for (let i = 0; i < gridElements.length; i++) {
            if (gridElements[i].classList[1] == X_CLASS) {
                placeable.push(i)
            }
        }
        //random
        var ran = placeable[Math.floor((Math.random() * placeable.length))];
        //clear and add event listener
        gridElements[ran].classList.remove(X_CLASS)
        gridElements[ran].removeEventListener('click', handleClick)
        gridElements[ran].addEventListener('click', handleClick, { once: true })
    }
}

//invisible skill
function invisible() {
    //one skill per turn
    skill1.classList.remove('show')
    skill2.classList.remove('show')
    skill3.classList.remove('show')

    //black use black curtain
    if (xTurn && xSkill3 < 3) {
        curtainColor = 0
            //consume sill counter
        xSkill3 = xSkill3 + 1
        curtain.style.backgroundColor = "black"
        curtain.classList.add('show')

        //white use white curtain
    } else if (!xTurn && oSkill3 < 3) {
        curtainColor = 1
            //consume sill counter
        oSkill3 = oSkill3 + 1
        curtain.style.backgroundColor = "white"
        curtain.classList.add('show')

    }

}

function handleClick(e) {
    const grid = e.target
    getIndex(grid)
        //black or white turn
    const currentClass = xTurn ? X_CLASS : O_CLASS
    placeStone(grid, currentClass)
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
        endGame(false)

        //draw
    } else if (isDraw()) {
        endGame(true)

        //continue
    } else {
        swapTurns()
            //show 3 skill buttons 
        if (currentClass == X_CLASS && oSkill1 < 3) {
            skill1.classList.add('show')
        } else if (currentClass == O_CLASS && xSkill1 < 3) {
            skill1.classList.add('show')
        }

        if (currentClass == X_CLASS && oSkill2 < 3) {
            skill2.classList.add('show')
        } else if (currentClass == O_CLASS && xSkill2 < 3) {
            skill2.classList.add('show')
        }
        if (currentClass == X_CLASS && oSkill3 < 3) {
            skill3.classList.add('show')
        } else if (currentClass == O_CLASS && xSkill3 < 3) {
            skill3.classList.add('show')
        }
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
function placeStone(grid, currentClass) {
    grid.classList.add(currentClass)
}

function winCheck(currentClass) {
    let ret = false
        //vertical
    let count = 1
    let i = iii
    while (i < 210 && gridElements[i + 15].classList[1] == currentClass) {
        count = count + 1
        i = i + 15
            //console.log("down")
    }
    i = iii
    while (i > 14 && gridElements[i - 15].classList[1] == currentClass) {
        count = count + 1
        i = i - 15
            //console.log("up")
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
            //console.log("right")
    }
    i = iii
    while (i > 0 && i % 15 > (i - 1) % 15 && gridElements[i - 1].classList[1] == currentClass) {
        count = count + 1
        i = i - 1
            //console.log("left")
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
            //console.log("diagonal 1 down")
    }
    i = iii
    while (i % 15 != 14 && i > 14 && gridElements[i - 14].classList[1] == currentClass) {
        count = count + 1
        i = i - 14
            //console.log("diagonal 1 up")
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
            //console.log("diagonal 2 down")
    }
    i = iii
    while (i % 15 != 0 && i > 14 && gridElements[i - 16].classList[1] == currentClass) {
        count = count + 1
        i = i - 16
            //console.log("diagonal 2 up")
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

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = "Draw!"
    } else {
        winningMessageTextElement.innerText = `${xTurn ? "Black" : "White"} Wins!`
    }
    winningMessageElement.classList.add('show')
}

function swapTurns() {
    xTurn = !xTurn
}

function setHover() {
    board.classList.remove(X_CLASS)
    board.classList.remove(O_CLASS)
    if (xTurn) {
        board.classList.add(X_CLASS)
    } else {
        board.classList.add(O_CLASS)
    }
}

function getBack() {
    window.location.href = "index.html";
}


//***chating


socket.on('chat',(player,message)=>{
    console.log("receving chat form "+player+":"+message );
    let msg = document.createElement("div");
    msg.className="chat_msg";
    msg.innerHTML = "<b>"+ player +"</b>" +": "+message;
    document.querySelector('.chat_log').appendChild(msg);
})
function sendChatMsgListeners(){
    document.querySelector('[type=button][value=send]').addEventListener("click",function (){
        const message =  document.querySelector('.chat_box').value;
        if(message != null && message.length > 0)socket.emit('chat',roomId,playerId,message);
        document.querySelector('.chat_box').value = "";
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
