var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));

var io = require('socket.io')(server);

var messageHistory = [];

io.on('connection', function (socket) {
    for (let i = 0; i < messageHistory.length; i++) {
        io.emit('message', messageHistory[i]);
    }
    socket.on('message', function (msg) {
        messageHistory.push(msg);
        io.emit('message', msg);
    });
});

server.listen(8080, function() {
    console.log('Chat server running');
});