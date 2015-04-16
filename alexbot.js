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
	    url: 'http://146.148.78.8:3000/alex',
	    pattern: '(DavidF)', 
	    event: 'room_message',
	    name: 'alex',
	});	
    updateWebhook(room, {
	    url: 'http://146.148.78.8:3000/deploy',
	    pattern: '(deploy)(ment|ing|)', 
	    event: 'room_message',
	    name: 'deploy',
	}, true);	
    updateWebhook(room, {
	    url: 'http://146.148.78.8:3000/object',
	    pattern: '(objection|object)', 
	    event: 'room_message',
	    name: 'object',
	}, true);	
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
    res.status(204).end();
});


app.post('/alex', function(req, res) {
    if(req.body.item.message.from.id !== 2007583) {
        hipchatter.reply(req.body.item.room.id, {
            parentMessageId: req.body.item.message.id,
            message: messageGen(req.body.item.message.from.mention_name)
        }, function(err) {
            if(err) {
                console.log(err);
            }
        });
    }
    res.status(204).end();
});


app.post('/deploy', function(req, res) {
	var person = req.body.item.message.from.id,
        re = /object|objection/;

	if((person === 201533 || person === 814860) && !re.test(req.body.item.message.message)) {
        hipchatter.reply(req.body.item.room.id, {
            parentMessageId: req.body.item.message.id,
            message: "@AlexDillon did you say something about deploying? http://i.imgur.com/qDPGE2E.jpg", 
        }, function(err) {
            if(err) {
                console.log(err);
            }
        });
    }
    res.status(204).end();
});


app.post('/object', function(req, res) {
	var person = req.body.item.message.from.id;

	if(person === 201533 || person === 814860) {
        hipchatter.reply(req.body.item.room.id, {
            parentMessageId: req.body.item.message.id,
            message: "http://i.imgur.com/A5EMP5z.gif?1",
        }, function(err) {
            if(err) {
                console.log(err);
            }
        });
    }
    res.status(204).end();
});


app.post('/test', function(req, res) {
	var person = req.body.item.message.from.id;
	if(person === 201533 || person === 814860) {
        console.log(req.body.item);
	}
    res.status(204).end();
});


//Utils
function updateWebhook(roomName, options, overWriteHook) {
    var found = false;
	hipchatter.webhooks(roomName, function(err, hooks) {
	    if(!err) {
		    hooks.items.forEach(function(ele, ind, arr) {
				if(ele.name === options.name) {
                    found = true;
                    if(overWriteHook) {
                        hipchatter.delete_webhook(roomName, ele.id, function(err) {
                            if(!err) {
                                console.log('deleted duplicate webhook ' + ele.name + ' ' + ele.id);
                            }
                        });
                    }
				}
			});
		    if(overWriteHook || !found) {
				hipchatter.create_webhook(roomName, options, function(err, webhook) {
					if(!err) {
						console.log('registered webhook ' + options.name + ' ' + webhook.id + ' for room ' + roomName);
					} else {
						console.log(err);
					}
				});
			}
		}
	}); 
}

function messageGen(name) {
    var suffix = [
        'Bananalord Ecuadorus',
        'Emperor Clownicus I, Lord of the Circus',
        'Donkey Kong',
        '(banana)',
        '(alex)',
        'The Clocklord, Master of Time Zones'
    ]
    return "@" + name + " it appears you typed \'@AlexDillon.\' Perhaps you meant \'" + suffix[Math.floor(Math.random()*suffix.length)] + "?\'";
}


app.listen(3000, function() {
    console.log('running');
});
