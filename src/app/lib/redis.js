
require('dotenv').config({ path: '.dev.env' });

const { createClient} = require('redis');

const client = createClient(process.env.REDIS_PORT,process.env.REDIS_HOST);

client.auth(process.env.REDIS_AUTH_PASS, function (err) {
    if (err) throw err;
});

client.on('connect', function() {
    console.log('Redis Connected! ==');
});

client.on("error", function(error) {
    console.error("Redis error ==",error);
});

client.on("ready", function() {
    console.error("Redis ready ==");
});


module.exports = client;