let socket = io();

const button = document.querySelector("#darkmode");
let darkmode = false;
button.addEventListener('click', updateButton);

// dark mode code
function updateButton() {
    darkmode = !darkmode
    document.body.classList.toggle('dark');

    let main = document.querySelector('main');
    main.classList.toggle('dark');

    let li = document.querySelectorAll('li:nth-child(even)');
    for (let i = 0; i < li.length; i++) {
        li[i].classList.toggle('dark');
    }

    let li_n = document.querySelectorAll('li:nth-child(odd)');
    for (let j = 0; j < li_n.length; j++) {
        li_n[j].classList.toggle('dark');
    }

    let form = document.querySelector('form');
    form.classList.toggle('dark');

    let input = document.querySelector('#initials');
    input.classList.toggle('dark');
    let input2 = document.querySelector('#message');
    input2.classList.toggle('dark');
    
    if (button.value === 'DARK MODE') {
        button.value = 'LIGHT MODE'; 
    } else {
        button.value = 'DARK MODE';
    }
}

// call function to make dark mode default
updateButton();

// code to send messages
$('form').on('submit', function () {
    let initials = $('#initials').val();
    let msg = $('#message').val();
    // check that fields are not empty
    if (!(msg.length > 0) || !(initials.length > 0) || msg.trim().length === 0 || initials.trim().length === 0) {
        return false;
    }
    // emit message if valid
    else {
        let text = " <b>| " + initials + " says: </b>" + msg;
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
    let main = document.querySelector('main');
    main.scrollTo(0, main.scrollHeight);
});
