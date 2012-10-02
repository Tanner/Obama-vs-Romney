var twitter = require('ntwitter');
var redis = require('redis');

var credentials = require('./credentials.js');

const OBAMA_KEY = 'obama';
const ROMNEY_KEY = 'romney';

const OBAMA_TRACK_WORDS = ['obama', 'barack'];
const ROMNEY_TRACK_WORDS = ['romney', 'mitt'];

console.log("Connecting to Redis...");

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

console.log("Connecting to Twitter...");

// Prepare Twitter
var twit = new twitter({
	consumer_key: credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token_key: credentials.access_token_key,
	access_token_secret: credentials.access_token_secret
});

console.log("Streaming...");

// Stream away!
twit.stream(
	'statuses/filter',
	{
		track: OBAMA_TRACK_WORDS + ROMNEY_TRACK_WORDS
	},
	function(stream) {
		stream.on('data', function(tweet) {
			if (stringContains(tweet.text, OBAMA_TRACK_WORDS)) {
				client.incr(OBAMA_KEY);
			}

			if (stringContains(tweet.text, ROMNEY_TRACK_WORDS)) {
				client.incr(ROMNEY_KEY);
			}
		});
	}
);

setTimeout(printStats, 500);

function printStats() {
	multi = client.multi();
	multi.get(OBAMA_KEY);
	multi.get(ROMNEY_KEY);

	multi.exec(function(error, replies) {
		var obama = parseInt(replies[0]);
		var romney = parseInt(replies[1]);
		var total = obama + romney;

		var obama_percentage = ((obama / total) * 100);
		var romney_percentage = ((romney / total) * 100);

		console.log("Obama: " + obama_percentage.toFixed(2) + "% vs Romney: " + romney_percentage.toFixed(2) + "%");
	});

	setTimeout(printStats, 500);
}

function stringContains(string, array) {
	for (var i = 0; i < array.length; i++) {
		if (string.match(new RegExp(array[i], 'gi'))) {
			return true;
		}
	}

	return false;
}