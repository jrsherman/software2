
function signUp(){//send json object with possible email and password
    var username = $("#username").val();
    var password =$("#password").val();

    $.ajax({
        url: './api/user/signup',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email:username,password:password
        }),
        dataType: 'json',
        success: function (response){
            alert("success");
            sendLoginData()
        },
        error: function (data, status, error) {
            console.log(data, status, error);
            var modal = document.getElementById('myModal');
            $(".modal-content").html(data.responseJSON.message);
            modal.style.display = "block";
        }
    });
}

function sendLoginData(){
    var username = $("#username").val();
    var inputPassword =$("#password").val();
    $.ajax({
        url: './api/user/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email:username,password:inputPassword
        }),
        dataType: 'json',
        success: function (response) {
            document.cookie = "name="+username+"";
            document.cookie = "token="+response.token+"";
            c = parseCookie();
            $(location).attr('href', './assetManager.html')
        },
        error: function (data, status, error) {
            console.log(data, status, error);
            alert(data.responseJSON.message);
            var modal = document.getElementById('myModal');
            $(".modal-content").html(data.responseJSON.message);
            modal.style.display = "block";
        }
    });
}




document.addEventListener('keydown', function(event) {
    if (13 == event.keyCode) {
        sendLoginData();
    }
}, false);