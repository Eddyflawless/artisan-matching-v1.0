

require('dotenv').config({ path: '.dev.env' });

const sqs_helper = require("../lib/sqs");

const queueName = 'match-job-demo-queue'; //staging

const queueUrl = `https://sqs.${process.env.SQS_REGION}.amazonaws.com/${process.env.SQS_ACCOUNT_ID}/${queueName}`;

var { deleteSqsMessage,  receive_sqs_message } = sqs_helper.init(queueUrl);

const { getJob } = require("../db/util");

const { match_job_to_artisans  } = require("../db/services/artisan");

const { match_job_to_gangs } = require("../db/services/gang");

const { createGangJobRequests, createJobRequests  } = require("../db/services/job");

const redis_client = require('../lib/redis');

let job_id; 


async function getRecord(parameters, key_hash){

    console.log("get record", parameters, key_hash);

    //unique key yosemite:attration:ID for ref

    /**
     * The radius is specified using one of the following unit :- 
        m for meter ( default ).

        km for kilometer.

        mi for miles.

        ft for feet.
     */

        /**
         * 
         * WITHDIST :- It returns the distance of the returned elements from the center of the circle. The unit of distance is same as the unit of the radius argument.
         * 
            WITHCOORD :- It returns the longitude, latitude coordinates of all the returned elements.

            WITHHASH :- It returns the raw Geohash string ( 52 bit unsigned integer ) of all the returned elements. This Geohash string is the score of the an element in the sorted set.

            ASC :- It returns the elements from nearest to farthest sorting order, relative to the center. By default elements are returned in unsorted order.

            DESC :- It returns the elements from farthest to nearest sorting order, relative to the center.

            COUNT <count> :- It returns the elements limited to first count matching elements. By default all the matching elements are returned.
         */

   var {lat,lng,radius, radius_metric,match_limit} = parameters;

   if(!radius_metric) radius_metric = "m";

   return new Promise(function(resolve, reject){

       //eg GEORADIUS artisans:3 -119.58152 37.7487473 4 km
       redis_client.georadius(key_hash, lat, lng, radius,radius_metric,"WITHDIST","ASC","COUNT",match_limit,function(err,r_status){
    
           if(err) reject(err);
    
           resolve(r_status)
    
       } )
   })

   //[artisan_id, distance_in_metrcic]


}

async function computeArtisanMatching(parameters, step=1){

    parameters.step = step; 
    parameters.radius = parameters.radius * parameters.step;

    return await match_job_to_artisans(parameters, getRecord)


}

async function handleQuickJob(parameters){

    var step_limit = 3;

    console.log("hit");

    var result = [];

    for(var i = 0; i < step_limit; i++){

        var step = i + 1;

        result = await computeArtisanMatching(parameters, step);

        console.log("computed result", result);

        if(result.length != 0) break;
    }

    //[artisan_id, distance_in_metrcic]
    result = [ ["ART11007","20"] ];

    if(result.length > 0)  await createJobRequests(result, job_id);


}

async function handleGangJob(parameters){

    var result = await match_job_to_gangs(parameters,getRecord);

    await createGangJobRequests(result, job_id);    
}

const handleMessages = async (Messages) => {

    if(!Messages)  return;

    for(var i = 0; i < Messages.length; i++) {

        console.log("times", i);

        var message = Messages[i];

        const payload =  JSON.parse(message.Body);

        var  { radius ,retry_count, service_category_id } = payload;

        job_id = payload.job_id;
    
        // look up payload data from data storage 
        const job_data = await getJob(job_id);

    
        if(!job_data){
            await deleteSqsMessage(message);
            continue;
        }

        console.log("payload", payload);

        console.log("job", job_data.job_type);

        const {job_type} = job_data;
        
        const parameters = {
            lat: job_data.lat,
            lng: job_data.lng,
            radius,
            service_category_id: service_category_id,
            match_limit: 3 //default
        }

        if(job_type == 'quick') {
            await handleQuickJob(parameters);
        }else if(job_type == 'gang') {
            await handleGangJob(parameters);
        }

        job_data.retry_count = job_data.retry_count + 1;
    
        await job_data.save();
    
        if(job_data.retry_count >= 3) {
    
            
           // const multi = redis_client.multi();
    
            // var key_hash = `jobs:${job_data.service_category_id}`;
            
            // multi.geoadd(key_hash,lat, lng, job_id);
    
    
            // var r1 = await new Promise(function(resolve, reject){
    
            //     multi.exec(function(err, results){
            //         if(err) reject(err);
    
            //         resolve(results);
                                        
            //     })
                
            // })
            
            await deleteSqsMessage(message);
    
            //send notification to client
            //stating the job matching has reached a timeout 
    
            
        }
            
    }
          

}


module.exports.worker = async function (){


    try {

        console.log("run 1");
        
        // const Messages = await receive_sqs_message();

        Messages = [ { Body: '{"radius":10,"retry_count":1,"service_category_id":3, "job_id": 89 }' }];

        await handleMessages(Messages);

    } catch (error) {

        console.log("error",error);

        errorHandler.captureException(error);
        //send error to sentry
    }finally{
        job_id = null;
    }



}





