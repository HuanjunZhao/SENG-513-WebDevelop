function getLocalPage(){
    window.location.href = "game.html?local=true";
}

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

function getInput() {
    if (checkPassword() && checkUserid()) {
        var userid = document.getElementById("ID").value;
        var pass = document.getElementById("pass").value;
        // send information to server to check if the user is valid
        window.location.href = "homepage.html?userid=" + userid;
    }
    else
        return;
}

function getBack() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('local').style.display = 'inline';
    document.getElementById('signup').style.display = 'none';

}

function getForm(){
    document.getElementById('login').style.display = 'block';
    document.getElementById('local').style.display = 'none';
    document.getElementById('signup').style.display = 'inline';
    let form = document.querySelector('form');
    form.style.top = '55%';
}