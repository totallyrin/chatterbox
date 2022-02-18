var socket = io();

const button = document.querySelector(".darkmode");
var darkmode = false;
button.addEventListener('click', updateButton);

// dark mode code
function updateButton() {
    darkmode = !darkmode
    document.body.classList.toggle('dark');

    var main = document.querySelector('main');
    main.classList.toggle('dark');

    var li = document.querySelectorAll('li:nth-child(even)');
    for (var i = 0; i < li.length; i++) {
        li[i].classList.toggle('dark');
    }

    var li_n = document.querySelectorAll('li:nth-child(odd)');
    for (var j = 0; j < li_n.length; j++) {
        li_n[j].classList.toggle('dark');
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

// code to send messages
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
        $('#message').val('');
        return false;
    }
});

// code to display incoming message(s)
socket.on('message', function (msg) {
    // if dark mode is enabled, incoming messages should be in dark theme
    if (darkmode)
        $('<li class="dark">').html(msg).appendTo('#history');
    else
        $('<li>').html(msg).appendTo('#history');
    var main = document.querySelector('main');
    main.scrollTo(0, main.scrollHeight);
});
