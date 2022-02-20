let express = require('express');
let app = express();

let http = require('http');
let server = http.Server(app);

app.use(express.static('client'));

let io = require('socket.io')(server);

let messageHistory = [];

function isQuestion(msg) {
    return msg.match(/\?$/);
}

function askingTime(msg) {
    return msg.match(/time/i) || msg.match(/date/i);
}

function askingWeather(msg) {
    return msg.match(/weather/i);
}

function sayHello(msg) {
    return msg.match(/bixby/i);
}

function getWeather(callback) {
    let request = require('request');
    request.get('https://www.metaweather.com/api/location/4118', function (error, response) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(response.body);
            callback(data.consolidated_weather[0].weather_state_name, data.title + ', ' + data.parent.title, data.consolidated_weather[0].applicable_date);
        }
    })
}

function timeStamp() {
    let date = new Date;
    let hours = date.getHours();
    if (hours.toString().length < 2)
       hours = '0' + hours;
    let mins = date.getMinutes();
    if (mins.toString().length < 2)
        mins = '0' + mins
    return hours + ':' + mins
}

function receiveMsg(msg) {
    let received = timeStamp() + msg;
    console.log("Received Message: ", received);
    messageHistory.push(msg);
    io.emit('message', received);
}

function sendMsg(msg) {
    let text = " <b>| BIXBY says: </b>" + msg;
    console.log("Sent message: ", timeStamp() + text);
    messageHistory.push(text);
    io.emit('message', timeStamp() + text);
}

io.on('connection', function (socket) {
    for (let i = 0; i < messageHistory.length; i++) {
        socket.emit('message', timeStamp() + messageHistory[i]);
    }
    socket.on('message', function (msg) {
        receiveMsg(msg)
        if (sayHello(msg) && !askingTime(msg) && !askingWeather(msg)) {
            sendMsg("Hi! I'm BIXBY! Try asking me about the weather or the time!")
        }
        if (askingTime(msg) && isQuestion(msg)) {
            sendMsg("The current date and time is " + new Date + ".");
        }
        if (askingWeather(msg) && isQuestion(msg)) {
            getWeather(function(weather, place, date) {
                sendMsg("The weather in " + place + " on " + date + " is " + weather + ".");
            })
        }
    });
});

let port = process.env.PORT;
if (port == null || port === "") {
    port = 8080;
}

server.listen(port, function() {
    console.log('Chat server running');

});