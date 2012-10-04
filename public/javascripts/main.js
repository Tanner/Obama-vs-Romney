console.log("Hello");

var socket = io.connect('http://localhost');

socket.on('candidate', function(data) {
	console.log(data);
});

socket.on('stats', function(data) {
	$("#obama .count").text(data.obama);
	$("#obama .percentage").text(data.obama_percentage.toFixed(2));

	$("#romney .count").text(data.romney);
	$("#romney .percentage").text(data.romney_percentage.toFixed(2));
});