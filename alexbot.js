var Hipchatter = require('hipchatter');
var hipchatter = new Hipchatter('4mtwWT7foXAyd2Z5rLdoNxWEQRFqITom2H76wura');

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
hipchatter.webhooks('FE Learning Center', function(err, hooks) {
	if(!err) {
	console.log(hooks);
}
}); 
/*hipchatter.delete_webhook('FE Learning Center', '887852', function(err) {
if(!err) {
	console.log('success');
}
});
*/
app.use(bodyParser.json()); 

/*hipchatter.create_webhook('FE Learning Center', {
    url: 'http://146.148.78.8:3000/',
    pattern: '(stepping away for a bit)', 
    event: 'room_message',
    name: 'step_away',
}, function(err, webhook) {
    if(!err) {
        console.log(webhook);
    } else {
	console.log(err);
}
});
*/
app.get('/', function(req, res) {
	res.send('ok');
});

app.post('/', function(req, res) {
    console.log(req);
    hipchatter.notify('FE Learning Center', {
        message: 'Test',
        color: 'red',
        token: '4bOsiwkvfPLHqU9qZ8bL7w724skGHTvGMLelUnqd',
    }, function(err) {
        if(!err) {
            console.log("notified");
        } else {
		console.log(err);
	}
    });
    res.json(req.body);
});

app.listen(3000, function() {
    console.log('running');
});
