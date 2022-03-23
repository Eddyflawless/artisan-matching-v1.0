const artisan = require('./artisan');
const artisan_gang = require('./gang');
const job = require('./job');
const job_request = require('./job_request');
const cron_job = require('./cronjob');
const user = require('./user');
const api_client = require('./api_client');

//relationships
artisan.belongsTo(user,{ 
    foreignKey:  "user_id", 
    targetKey: "user_id"
 });

job.belongsTo(user, { 
    foreignKey:  "user_id", 
    targetKey: "user_id"
 });

job_request.belongsTo(artisan,{ 
    foreignKey:  "artisan_id", 
    targetKey: "artisan_id"
 } )

//exports
module.exports = {
    artisan,
    job,
    job_request,
    cron_job,
    user,
    artisan_gang,
    api_client
}