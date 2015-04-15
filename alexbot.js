var config = require('./config');
var Hipchatter = require('hipchatter');
var hipchatter = new Hipchatter(config.hipchatKey);

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); 

for(var room in config.rooms) {
    updateWebhook(room, {
	    url: 'http://146.148.78.8:3000/away',
	    pattern: '(stepping away)', 
	    event: 'room_message',
	    name: 'step_away',
	});	
    updateWebhook(room, {
	    url: 'http://146.148.78.8:3000/test',
	    pattern: '(test)', 
	    event: 'room_message',
	    name: 'test',
	});	
}

app.post('/away', function(req, res) {
	var person = req.body.item.message.from.id,
	roomKey = 000;
	if(person === 201533 || person === 814860) {
	    roomKey = 000 || config.rooms[req.body.item.room.id];
		   
	    console.log(new Date().toString() + ": notified in room " + req.body.item.room.id + " with key " + roomKey);

	    hipchatter.notify(req.body.item.room.id, {
		message: '<strong>Attention</strong><br>Alex is stepping away from his desk for a bit. Don\'t panic, he can\'t even outsmart a bot. Please sit calmly at your desk with your hands folded until he returns.',
		color: 'red',
		token: roomKey,
	    }, function(err) {
		if(!err) {
		    console.log(new Date().toString() + ": notified in room " + req.body.item.room.id + " with key " + roomKey);
		} else {
			console.log(err);
		}
	    });
	}
    res.send("ok");
});
app.post('/test', function(req, res) {
	var person = req.body.item.message.from.id,
	roomKey = 000;
	if(person === 201533 || person === 814860) {
        console.log(req.body);
	}
    res.send("ok");
});

function updateWebhook(roomName, options) {
	hipchatter.webhooks(roomName, function(err, hooks) {
		if(!err) {
			hooks.items.forEach(function(ele, ind, arr) {
				if(ele.name === options.name) {
					hipchatter.delete_webhook(roomName, ele.id, function(err) {
						if(!err) {
							console.log('deleted duplicate webhook ' + ele.name + ' ' + ele.id);
						}
					});
				}
			});
			hipchatter.create_webhook(roomName, options, function(err, webhook) {
		    	    if(!err) {
			        console.log('registered webhook ' + options.name + ' ' + webhook.id + ' for room ' + roomName);
		            } else {
			        console.log(err);
		            }
			});
		}
	}); 
}


app.listen(3000, function() {
    console.log('running');
});
