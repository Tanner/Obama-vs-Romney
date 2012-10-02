var twitter = require('ntwitter');

var credentials = require('./credentials.js');

const OBAMA_TRACK_WORDS = ['obama', 'barack'];
const ROMNEY_TRACK_WORDS = ['romney', 'mitt'];

function streamTweets(obama_callback, romney_callback) {
	// Prepare Twitter
	var twit = new twitter({
		consumer_key: credentials.consumer_key,
		consumer_secret: credentials.consumer_secret,
		access_token_key: credentials.access_token_key,
		access_token_secret: credentials.access_token_secret
	});

	// Stream away!
	twit.stream(
		'statuses/filter',
		{
			track: OBAMA_TRACK_WORDS + ROMNEY_TRACK_WORDS
		},
		function(stream) {
			stream.on('data', function(tweet) {
				if (stringContains(tweet.text, OBAMA_TRACK_WORDS)) {
					obama_callback();
				}

				if (stringContains(tweet.text, ROMNEY_TRACK_WORDS)) {
					romney_callback();
				}
			});
		}
	);
}

function stringContains(string, array) {
	for (var i = 0; i < array.length; i++) {
		if (string.match(new RegExp(array[i], 'gi'))) {
			return true;
		}
	}

	return false;
}

exports.streamTweets = streamTweets;