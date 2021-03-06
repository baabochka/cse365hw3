var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {


    var amqp = require('amqplib/callback_api');

    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            var ex = 'hw3';
            var my_key = req.body.key;
            var my_msg = req.body.msg;

            ch.assertExchange(ex, 'direct', {durable: false});
            ch.publish(ex, my_key, new Buffer(my_msg));
            console.log(" [x] Sent %s: '%s'", my_key, my_msg);
            res.json({ key: my_key, msg: my_msg});
        });

        setTimeout(function() { conn.close(); }, 500);
    });



});

module.exports = router;