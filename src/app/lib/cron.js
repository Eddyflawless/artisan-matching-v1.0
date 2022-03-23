const Models = require('../db/models/main');

const CronJob = Models.cron_job;

module.exports.getCronJobSettings = async (name) => {

    return await CronJob.findOne({
        where: {
            name
        }
    })

}

module.exports.updateCronBgTask = async (name, skip, result_size) => {

    var cron_settings = await CronJob.findOne({
        where: {
            name
        }
    });

    if(!cron_settings) throw new Error(`cron settings for ${name} is not defined`);

    if(result_size == 0) {
        cron_settings.skip = 0;
    }else{
        cron_settings.skip = skip;
    }

    await cron_settings.save();

}
