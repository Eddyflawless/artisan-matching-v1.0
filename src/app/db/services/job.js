const Job = require("../models/main").job;

const { Op } = require("sequelize");

const JobRequest = require("../models/main").job_request;

const { getJob } = require("../util");

const sendPushNotification = require("../../lib/firebase");

const { artisanCanceledJobRecordCache, isArtisanAvailable, artisanIsTheSameUser, fetchArtisan  } = require("./artisan");

const { getConsumerFbToken } = require("./user");

const  { fetchGang, isGangAvailable } = require("./gang");


const moment = require('moment');

async function createJobRequests (matched_artisans,job_id=null){

    var op_state = false;

    if(matched_artisans.length == 0) return op_state;

    console.log("matched artisans", matched_artisans);

    const job = await getJob(job_id);

    if(!job) return op_state;

    var valid_matched_artisans = [];

    for(let i = 0; i < matched_artisans.length; i++){

        let artisan = matched_artisans[i];

        if(await artisanIsTheSameUser(artisan[0],job_id)) continue;
    
        if(await artisanCanceledJobRecordCache(artisan[0],job_id)) continue;
    
        if(!isArtisanAvailable(artisan[0],10) ) continue;
    
        const _artisan = await fetchArtisan(artisan[0]);

        if(!_artisan) continue;
    
        valid_matched_artisans.push(_artisan);

        await createRequestJob(artisan[0],artisan[1],job_id);
        console.log("artisan is ", _artisan);

        //send notification to artisan
        await sendPushNotification(`You have been matched with a job. Check it out`,_artisan.fb_token);

    }

    if(valid_matched_artisans.length > 0){

        console.log("send message to user",job.user_id );

        var fb_token = getConsumerFbToken(job.user_id)
        //push optional notfication to consumer
        await sendPushNotification(`We matched your job with some artisans. Check it out`,fb_token);

        op_state = true;

    }

    return op_state;

}



async function  createGangJobRequests(matched_gang,job_id=null){

    if(matched_artisans.length == 0) return

    let job = await getJob(job_id);

    if(!job) return

    var valid_matched_gang = [];

    for(let i = 0; t < matched_gang.length; i++){

        let gang = matched_gang[i];

        if(!isGangAvailable(gang[0],10) ) continue;
    
        // if(await gangCanceledJobRecordCache(artisan)) return;
    
        if(await artisanCanceledJobRecordCache(gang[0])) continue;
    
        var gang_object = await fetchGang(gang[0]);

        if(!gang_object) continue;

        const gang_head_id = gang_object.gang_head_id;

        const _artisan = await fetchArtisan(gang_head_id);

        if(!_artisan) continue;

        await createGangRequestJob(gang_head_id,gang[1],job_id);

        valid_matched_gang.push(_artisan);

        //send notification to gang head
        await sendPushNotification(`Your group have been matched with a job. Check it out`,_artisan.fb_token);

    }

    if(valid_matched_gang.length > 0) {

        var fb_token = getConsumerFbToken(job.user_id);
    
        //push optional notfication to consumer
        await sendPushNotification(`We matched your job with some group of artisans. Check it out`,fb_token);

        return true;

    }

    return false;


}

async function doesJobRequestExist(artisan_id, job_id){

    return await JobRequest.findOne({ where: { artisan_id, job_id }})

}

async function createRequestJob(artisan_id,distance,job_id) {

    if(!artisan_id) throw new Error("Artisan id must be passed");

    if(!distance) throw new Error("Disance must be provided");

    if(!job_id) throw new Error("Job id must be passed");

    var create_data =  {
        artisan_id: artisan_id,
        job_id: job_id,
        distance: distance
    };

    let rs;

    if(!await doesJobRequestExist(artisan_id, job_id)) {
        rs = await JobRequest.create(create_data);
    }

    return rs;

}


async function createGangRequestJob(gang_head_id, distance,job_id){


    var create_data =  {
        artisan_id: gang_head_id,
        job_id: job_id,
        distance: distance
    };

    return await JobRequest.create(create_data);

}



module.exports = {
    createGangJobRequests, createJobRequests, createRequestJob, doesJobRequestExist
}