var Job = require("../db/models/main").job;

async function getJob(job_id){

    //var _m = moment().format('Y-M-d');

    return await Job.findOne({
        where: {
            id: job_id,
            status: 'pending',
            // requested_date:  {
            //     [Op.lte] : _m
            // }
            // requested date is equal or greater
            // incase of stale job in queue
            // where
        }
    });

}


module.exports = {
    getJob
}
