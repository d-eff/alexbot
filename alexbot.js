var config = require('./config');
var Hipchatter = require('hipchatter');
var hipchatter = new Hipchatter(config.hipchatKey);

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); 

updateWebhook('FE Learning Center', {
    url: 'http://146.148.78.8:3000/alex',
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

app.get('/', function(req, res) {
	res.send('ok');
});

app.post('/alex', function(req, res) {
	var person = req.body.item.message.from.id,
	roomKey = 000;
	if(person === 201533 || person === 814860) {
	switch(req.body.item.room.id) {
		//fe learning center for testing
		case 1170122:
			roomKey = config.FERoom;	
		break;
		//NEXT
		case 214295:
			roomKey = config.NEXTRoom;
		break;
		//hcw
		case 215089:
			roomKey = config.HCWRoom;
		break;
		//qa
		case 364003:
			roomKey = config.QARoom;
		break;
	}
    hipchatter.notify(req.body.item.room.id, {
        message: '<strong>Attention</strong><br>Alex is stepping away from his desk for a bit. Don\'t panic. Please sit calmly at your desk with your hands folded until he returns.',
        color: 'red',
        token: roomKey,
    }, function(err) {
        if(!err) {
            console.log("notified");
        } else {
		console.log(err);
	}
    });
}
    res.send("ok");
});

function updateWebhook(roomName, options, callback) {
	hipchatter.webhooks('FE Learning Center', function(err, hooks) {
		if(!err) {
			console.log(hooks);
			hooks.items.forEach(function(ele, ind, arr) {
				if(ele.name === options.name) {
					hipchatter.delete_webhook(roomName, ele.id, function(err) {
						if(!err) {
							console.log('deleted duplicate webhook with id' + ele.id);
						}
					});
				}
			});
			hipchatter.create_webhook(roomName, options, callback);
		}
	}); 
}


app.listen(3000, function() {
    console.log('running');
});
