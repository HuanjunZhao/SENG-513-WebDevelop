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
        // send information to server to check if the user is exist
        // if the user is exist, go back to the landing page
        // if the user is not exist, add the user to the database and go to the homepage
        
        // socket.emit('signup', {userid: userid, pass: pass});
        // socket.on('signup', function(data){
        //     if(data == 'exist'){
        //         alert("User ID already exists, please login");
        //         window.location.href = "landing.html";
        //     }
        //     else{
        //         alert("User ID is created");
                   window.location.href = "homepage.html?userid=" + userid;
        //     }
        // });
    }
    else
        return;
}

function getBack() {
    window.location.href = "landing.html";
}