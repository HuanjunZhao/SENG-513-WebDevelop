const X_CLASS = 'x'
const O_CLASS =  'o'
const gridElements = document.querySelectorAll('[data-grid]')
const board = document.getElementById('grid')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')  
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
let iii = 0
let xTurn


start()

restartButton.addEventListener('click', start)

function start(){

    xTurn = true
    gridElements.forEach((grid, i) => {
        grid.classList.remove(X_CLASS)
        grid.classList.remove(O_CLASS)
        grid.removeEventListener('click', handleClick)
        grid.addEventListener('click', handleClick, {once: true})
    })
    setHover()

    winningMessageElement.classList.remove('show')
    
}


function handleClick(e){
    const grid = e.target
    getIndex(grid)
    const currentClass = xTurn ? X_CLASS : O_CLASS
    placeStone(grid, currentClass)

    //winning
    if(winCheck(currentClass)){
        endGame(false)

    //draw
    }else if(isDraw()){
        endGame(true)

    //continue
    }else{
        swapTurns()
        setHover()
    }
    
}

function getIndex(grid){
    for(let i = 0; i < gridElements.length; i++){
        if(gridElements[i] == grid){
            iii = i
            break
        }
    }
}

function placeStone(grid, currentClass){
    grid.classList.add(currentClass)
}

function winCheck(currentClass){
    let ret = false
    //vertical
    let count = 1
    let i = iii
    while(i < 210 && gridElements[i+15].classList[1] == currentClass){
        count = count + 1
        i = i + 15
        //console.log("down")
    }
    i = iii
    while(i > 14 && gridElements[i-15].classList[1] == currentClass){
        count = count + 1
        i = i - 15
        //console.log("up")
    }
    if(count>=5){
        ret = true
    }

    //horizontal
    count = 1
    i = iii
    while(i < 224 && i%15<(i+1)%15 && gridElements[i+1].classList[1] == currentClass){
        count = count + 1
        i = i + 1
        //console.log("right")
    }
    i = iii
    while(i > 0 && i%15>(i-1)%15 && gridElements[i-1].classList[1] == currentClass){
        count = count + 1
        i = i - 1
        //console.log("left")
    }
    if(count>=5){
        ret = true
    }
    
    //diagonal 1
    count = 1
    i = iii
    while(i%15 != 0 && i < 210 && gridElements[i+14].classList[1] == currentClass){
        count = count + 1
        i = i + 14
        //console.log("diagonal 1 down")
    }
    i = iii
    while(i%15 != 14 && i > 14 && gridElements[i-14].classList[1] == currentClass){
        count = count + 1
        i = i - 14
        //console.log("diagonal 1 up")
    }
    if(count>=5){
        ret = true
    }
    //diagonal 2
    count = 1
    i = iii
    while(i%15 != 14 && i < 210 && gridElements[i+16].classList[1] == currentClass){
        count = count + 1
        i = i + 16
        //console.log("diagonal 2 down")
    }
    i = iii
    while(i%15 != 0 && i > 14 && gridElements[i-16].classList[1] == currentClass){
        count = count + 1
        i = i - 16
        //console.log("diagonal 2 up")
    }
    if(count>=5){
        ret = true
    }

    return ret
}

function isDraw(){
    return [...gridElements].every(grid => {
        return grid.classList.contains(X_CLASS) || grid.classList.contains(O_CLASS)
    })
}

function endGame(draw){
    if(draw){
        winningMessageTextElement.innerText = "Draw!"
    }else{
        winningMessageTextElement.innerText = `${xTurn ? "Black" : "White"} Wins!`
    }
    winningMessageElement.classList.add('show')
}

function swapTurns(){
    xTurn = !xTurn
}

function setHover(){
    board.classList.remove(X_CLASS)
    board.classList.remove(O_CLASS)
    if(xTurn){
        board.classList.add(X_CLASS)
    }else{
        board.classList.add(O_CLASS)
    }
}