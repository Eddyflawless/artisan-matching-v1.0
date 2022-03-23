const Gang = require("../models/main").artisan_gang;

async function fetchGang(gang_id) {

    return  await Gang.findOne({      
        where: {
            id: gang_id
        },
        attributes: ["id", "gang_head_id"]
    });

}

async function isGangAvailable(gang_id, allowed_job_count=3){

    var active_gang = await Gang.findOne({
        attributes: {
            include: [
                [
                    sequelize.literal(`
                    (
                        select count(*) from jobs WHERE
                        artisan_gang_id = artisan_gangs.id AND
                        status = "ongoing"
                    ) as job_count
                    `)
                ]
            ]
        },
        where: {
            id: gang_id,
            availability: 1,
            is_active: 1
        }
    });

    if(!active_gang) false;

    if(active_gang.job_count <= allowed_job_count)  return true;
    
    return false;
}

async function match_job_to_gangs(parameters, callback){

    const { service_category_id } = parameters;
    const key_hash = `gang:${service_category_id}`;

    return await callback(parameters, key_hash);    
	
}

module.exports =  {
    fetchGang, isGangAvailable, match_job_to_gangs
}