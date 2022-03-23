const express = require('express');

const app = express();

const router = require('./routes/router');

const port  = process.env.PORT || 3005;

app.use(require("./app/middleware/cors"));

app.use(require("./app/middleware/body-parser"));

app.use('/',router);

require("./app/cron");

app.listen(port, function() {
    console.log(`app is listening on port ${port}`)
})

module.exports = app;