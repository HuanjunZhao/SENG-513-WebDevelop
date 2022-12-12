const socket = io();

function checkUserid() {
    var str = document.getElementById("ID").value;
    if ((str.length == 0)) {
        alert("User ID can't be empty");
        return false;
    }

    return true;
}

function checkPassword() {
    var str = document.getElementById("pass").value;
    if ((str.length == 0)) {
        alert("Password can't be empty");
        return false;
    }
    if ((str.length < 4 && str.length > 0)) {
        alert("Password should be 4 digits or more");
        return false;
    }
    return true;
}

socket.on('signup', state => {
    console.log(state);
    if(parseInt(state) == 0){
        // if the user is exist, go to the index
        alert("User ID already exists, please login");
        window.location.href = "index.html";
    }else{
        // if the user is not exist, add user, go back to the index
        alert("User ID is created");
        window.location.href = "index.html";
    }
});

function getInput() {
    if (checkPassword() && checkUserid()) {
        var userid = document.getElementById("ID").value;
        var pass = document.getElementById("pass").value;
        // send information to server to check if the user is exist        
        socket.emit('signup', {userid,pass});
    } else
        return;
}

function getBack() {
    window.location.href = "index.html";
}