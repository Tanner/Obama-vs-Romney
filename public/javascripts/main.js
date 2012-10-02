console.log("Hello");

var socket = io.connect('http://localhost');
socket.on('candidate', function (data) {
	console.log(data);
});