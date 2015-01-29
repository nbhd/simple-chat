/**
 * simple chat
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var http = require('http');

app.set('port', 3000);
// app.set('s', __dirname + '/s');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'client')));

// router
app.get('/', function (req, res) {
    res.writeHead(200, {'Content-type': 'text/html'});
    var output = fs.readFileSync('./index.html', 'utf-8');
    res.end(output);
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// socketio
var io = require('socket.io')(server);

var userHashs = {};

console.log('start chat server');

io.on('connection', function (socket) {

    console.log('connect: ' + socket.id);

    socket.on('connected', function (name) {
        var msg = 'join: ' + name;
        userHashs[socket.id] = name;
        io.sockets.emit('publish', {value: msg});
    });

    socket.on('publish', function (data) {
        io.sockets.emit('publish', {value: data.value});
    });

    socket.on('disconnect', function () {
        if (userHashs[socket.id]) {
            var msg = 'leave: ' + userHashs[socket.id];
            delete userHashs[socket.id];
            io.sockets.emit('publish', {value: msg});
        }
    });
});
