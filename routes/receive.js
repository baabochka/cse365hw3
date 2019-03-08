var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/', function(req, res, next) {

    var amqp = require('amqplib/callback_api');

    // var args = process.argv.slice(2);
    var my_keys = req.body.keys;

    if (req.body.keys.length == 0) {
        console.log("Please pass an array of keys");
        process.exit(1);
    }

    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var ex = 'hw3';

            ch.assertExchange(ex, 'direct', {durable: false});

            ch.assertQueue('', {exclusive: true}, function(err, q) {
                console.log(' [*] Waiting for logs. To exit press CTRL+C');

                my_keys.forEach(function(key) {
                    ch.bindQueue(q.queue, ex, key);
                });

                ch.consume(q.queue, function(got_msg) {
                    // console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                    res.json({msg: got_msg.content.toString()});
                    conn.close();
                }, {noAck: true});
            });
        });
    });
});
module.exports = router;
