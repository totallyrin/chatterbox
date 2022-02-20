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

io.on('connection', function (socket) {
    for (let i = 0; i < messageHistory.length; i++) {
        socket.emit('message', messageHistory[i]);
    }
    socket.on('message', function (msg) {
        msg = timeStamp() + msg;
        console.log("Received Message: ", msg);
        messageHistory.push(msg);
        io.emit('message', msg);
        if (askingTime(msg) && isQuestion(msg)) {
            let text = timeStamp() + " <b>| BIXBY says: </b>The current date and time is " + new Date + ".";
            console.log("Sent message: ", text);
            messageHistory.push(text);
            io.emit('message', text);
        }
        if (askingWeather(msg) && isQuestion(msg)) {
            getWeather(function(weather, place, date) {
                let text = timeStamp() + " <b>| BIXBY says: </b>The weather in " + place + " on " + date + " is " + weather + ".";
                console.log("Sent message: ", text);
                messageHistory.push(text);
                io.emit('message', text);
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