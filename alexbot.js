var config = require('./config');
var Hipchatter = require('hipchatter');
var hipchatter = new Hipchatter(config.hipchatKey);

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); 

var PORT = 3000;
var EXT_IP = 146.148.78.8;
var URL = 'http://' + EXT_IP + ':' + PORT;

for(var room in config.rooms) {
    updateWebhook(room, {
	    url: URL + '/away',
	    pattern: '(stepping away)', 
	    event: 'room_message',
	    name: 'step_away',
	});	
    updateWebhook(room, {
	    url: URL + '/alex',
	    pattern: '(AlexDillon)', 
	    event: 'room_message',
	    name: 'alex',
	});	
    updateWebhook(room, {
	    url: URL + '/deploy',
	    pattern: '(deploy)(ment|ing|)', 
	    event: 'room_message',
	    name: 'deploy',
	});	
    updateWebhook(room, {
	    url: URL + '/object',
	    pattern: '(objection|object)', 
	    event: 'room_message',
	    name: 'object',
	});	
    updateWebhook(room, {
	    url: URL + '/test',
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
    //ignore when the bot says it, or we'll be in an infinite loop
    if(req.body.item.message.from.id !== 2007583 && Math.random() < 0.2) {
        hipchatter.reply(req.body.item.room.id, {
            parentMessageId: req.body.item.message.id,
            message: getNameMessage(req.body.item.message.from.mention_name)
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
            message: getDeployMessage(), 
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

function getDeployMessage() {
    var gifs = [
        "http://i.imgur.com/qDPGE2E.jpg", //hold on 
        "http://i.giphy.com/QdgaN60imgrF6.gif", //elephants
        "http://i.giphy.com/ZsyQWaKusYlgI.gif", //truck
        "http://i.giphy.com/AWQyGGt1cOFt6.gif", //cat beanbag 
        "http://i.giphy.com/6zvDSUtuMqp3O.gif", //umbrella
        "http://buzzworthy.mtv.com//wp-content/uploads/buzz/2013/10/tumblr_mitvsiEBON1s6sejso1_400.gif" //pizza cat
    ];
    
    return "@AlexDillon did you say something about deploying? " + gifs[Math.floor(Math.random()*gifs.length)], 

}

function getNameMessage(name) {
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


app.listen(PORT, function() {
    console.log('Alexbot running on port ' + PORT);
});
