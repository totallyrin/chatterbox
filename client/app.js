var socket = io();

const button = document.querySelector(".darkmode");

button.addEventListener('click', updateButton);

function updateButton() {
    
    var main = document.querySelector('main');
    var li = document.querySelector('#history li:nth-child(1)');
    var form = document.querySelector('form');
    var input = document.querySelector('#initials');
    var input2 = document.querySelector('#message');
    
    document.body.classList.toggle('dark');
    main.classList.toggle('dark');
    li.classList.toggle('dark');
    form.classList.toggle('dark');
    input.classList.toggle('dark');
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
        var text = initials + " says: " + msg;
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
   $('<li>').text(msg).appendTo('#history');
});
