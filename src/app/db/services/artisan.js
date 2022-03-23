const Artisan = require("../models/artisan");

var sequelize = require("sequelize");

var getJob = require("../util").getJob;

async function isArtisanAvailable (artisan_id, allowed_job_count=10){

    var active_artisan = await Artisan.findOne({
        attributes: {
            include: [
                [
                    sequelize.literal(`
                    (
                        select count(*) from jobs WHERE
                        artisan_id = artisans.artisan_id AND
                        status = "ongoing"
                    ) as job_count
                    `)
                ]
            ]
        },
        where: {
            artisan_id: artisan_id,
            availability: 1,
            is_active: 1
        }
    });

    if(!active_artisan) false;

    if(active_artisan.job_count <= allowed_job_count)  return true;
    
    return false;

}

async function artisanCanceledJobRecordCache (artisan_id,job_id){

    var redis_promise = new Promise((resolve,reject) => {

        redis_client.get(`canceled-jobs:${artisan_id}:${job_id}`, function(err,r_status){
            resolve(r_status);
            if(err) reject(err);
        } )

    });

    try {
        
        var is_cached = await redis_promise;
        if(is_cached) return true;

    } catch (error) {
     
        //send error to sentry
        return false

    }

  
}

/**
 * 
 * @param {
 *  lat,lng, radius, distance-metric, count
 * } parameters 
 */
async function match_job_to_artisans(parameters, callback){

        
    const { service_category_id } = parameters;
    const key_hash = `artisans:${service_category_id}`;

    return  await callback(parameters, key_hash);

}



async function artisanIsTheSameUser (artisan_id,job_id){

    console.log("get job object", getJob)

    const job = await getJob(job_id); 

    var _artisan = await fetchArtisan(artisan_id);

    if(job &&  (job.user_id == _artisan.user_id)) return true;

    return false;

}

/**
 * checks to see if artisan
 * 1. doesnot have more than 2-3 active jobs
 * 2. Is active 
 * 3. Has availability ON
 * 4. If artisan didnot previously cancel this request (valid after 1-2 days)
 * 
 * @param {*} artisan 
 */

async function fetchArtisan(artisan_id){

    return  await Artisan.findOne({      
        where: {
            artisan_id: artisan_id
        }
    });

}

module.exports = {
    fetchArtisan, artisanIsTheSameUser, artisanCanceledJobRecordCache , isArtisanAvailable , match_job_to_artisans
}


