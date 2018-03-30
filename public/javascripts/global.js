$(document).ready(function () {

    $('#signUpBtn').on('click', addUser);

    $('#logInBtn').on('click', logInUser);

});

function addUser(event) {

    var username = $("#username").val();
    var email = $("#email").val();

    var newUser = {
        'username': username,
        'email': email,
        'password': $("#password").val()
    }

    $.ajax({
        type: 'POST',
        data: newUser,
        url: '/adduser',
        dataType: 'JSON'
    }).done(function (response) {

    });

}

function logInUser(event) {

}