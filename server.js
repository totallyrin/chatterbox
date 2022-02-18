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
        console.log("Received Message: ", msg);
        messageHistory.push(msg);
        io.emit('message', msg);
    });
});

let port = process.env.PORT;
if (port == null || port === "") {
    port = 8080;
}

server.listen(port, function() {
    console.log('Chat server running');

});