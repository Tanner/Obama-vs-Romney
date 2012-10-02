var twitter = require('ntwitter');
var credentials = require('./credentials.js');

var twit = new twitter({
	consumer_key: credentials.consumer_key,
	consumer_secret: credentials.consumer_secret,
	access_token_key: credentials.access_token_key,
	access_token_secret: credentials.access_token_secret
});

var obama_track_words = ['obama', 'barack'];
var romney_track_words = ['romney', 'mitt'];

twit.stream(
	'statuses/filter',
	{
		track: obama_track_words + romney_track_words
	},
	function(stream) {
		stream.on('data', function(tweet) {
			console.log(tweet.text);
		});
	}
);