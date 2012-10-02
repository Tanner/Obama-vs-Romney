var express = require('express');

// Start web server
var app = express();

app.engine('jade', require('jade').__express);
app.set('views engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
	res.render('index.jade');
});

app.listen(3000);
console.log("Listening on port 3000...");