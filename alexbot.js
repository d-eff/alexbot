var Hipchatter = require('hipchatter');
var hipchatter = new Hipchatter('4mtwWT7foXAyd2Z5rLdoNxWEQRFqITom2H76wura');

var http = require('http');
var express = require('express');
var app = express();

hipchatter.create_webhook('FE Learning Center', {
    url: '146.148.78.8/alex',
    pattern: '/stepping away for a bit/',
    event: 'room_message',
    name: 'step_away',
}, function(err, webhook) {
    if(!err) {
        console.log(webhook);
    }
});

app.post('/alex', function(req, res) {
    console.log(req);
    hipcahtter.notify('FE Learning Center', {
        message: 'Test',
        color: 'red',
        token: '4bOsiwkvfPLHqU9qZ8bL7w724skGHTvGMLelUnqd',
    }, function(err) {
        if(!err) {
            console.log("notified");
        };
    });
    res.send('ok');
});

app.listen(3000, function() {
    console.log('running');
});
