var express = require('express');
var http = require('http');
var redis = require('redis');

var twitter = require('./twitter.js');

const OBAMA_KEY = 'obama';
const ROMNEY_KEY = 'romney';

// Prepare Redis
var client = redis.createClient();

// Check to see if our keys exist, if not, create them please
client.exists(OBAMA_KEY, function(error, exists) {
	if (!exists) {
		client.set(OBAMA_KEY, 0);
	};
});

client.exists(ROMNEY_KEY, function(error, exists) {
	if (!exists) {
		client.set(ROMNEY_KEY, 0);
	};
});

// Start the twitter streaming
twitter.streamTweets(function() {
	client.incr(OBAMA_KEY);
}, function() {
	client.incr(ROMNEY_KEY);
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
	socket.emit('candidate', { name: 'obama' });
});

server.listen(3000);

console.log("Listening on port 3000...");