var express = require('express');
var http = require('http');

var twitter = require('./twitter.js');

// Twitter stream listeners
var streamListeners = {
	listeners: []
};

// Start the twitter streaming
twitter.streamTweets(function(obama, romney) {
	var listeners = streamListeners.listeners;

	for (var i = 0; i < listeners.length; i++) {
		streamListeners[listeners[i]](obama, romney);
	}
});

// Start web server
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.engine('jade', require('jade').__express);
app.set('views engine', 'jade');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index.jade');
});

io.sockets.on('connection', function(socket) {
	streamListeners.listeners.push(socket.id);
	streamListeners[socket.id] = function(obama, romney) {
		if (obama) {
			socket.emit('candidate', { name: 'obama' });
		}

		if (romney) {
			socket.emit('candidate', { name: 'romney' });
		}
	};

	socket.on('disconnect', function() {
		for (var i = 0; i < streamListeners.listeners.length; i++) {
			if (streamListeners.listeners[i] == socket.id) {
				streamListeners.listeners.splice(i, 1);
			}
		}

		delete streamListeners[socket.id];
	});
});

server.listen(3000);

console.log("Listening on port 3000...");