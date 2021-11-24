var socket = io();

const button = document.querySelector(".darkmode");

button.addEventListener('click', updateButton);

function updateButton() {

    document.body.classList.toggle('dark');

    var main = document.querySelector('main');
    main.classList.toggle('dark');

    var li = document.querySelectorAll('li:nth-child(odd)');
    for (var i = 0; i < li.length; i++) {
        li[i].classList.toggle('dark');
    }

    var form = document.querySelector('form');
    form.classList.toggle('dark');

    var input = document.querySelector('#initials');
    input.classList.toggle('dark');
    var input2 = document.querySelector('#message');
    input2.classList.toggle('dark');
    
    if (button.value === 'DARK MODE') {
        button.value = 'LIGHT MODE'; 
    } else {
        button.value = 'DARK MODE';
    }
}

$('form').on('submit', function () {
    var initials = $('#initials').val();
    var msg = $('#message').val();
    // check that fields are not empty
    if (!(msg.length > 0) || !(initials.length > 0) || msg.trim().length === 0 || initials.trim().length === 0) {
        return false;
    }
    // emit message if valid
    else {
        var text = "<b>" + initials + " says: </b>" + msg;
        socket.emit('message', text);
        $('#message').val(' ');
        return false;
    }
});

//$('button').on('click', function() {
//    var text = $('#message').val();
//    var who = $('#initials').val();
//    
//    socket.emit('message', who + ": " + text);
//    $('#message').val('');
//    
//    return false;
//});

socket.on('message', function (msg) {
    $('<li>').html(msg).appendTo('#history');
    var main = document.querySelector('main');
    main.scrollTo(0, main.scrollHeight);
});
