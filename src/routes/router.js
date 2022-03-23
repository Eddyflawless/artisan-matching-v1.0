
const router = require('express').Router();

const { check, validationResult } = require('express-validator');

const Sentry = require('../app/lib/logger');


const { multi } = require('../app/lib/redis');

const redis_client = require('../app/lib/redis')

router.post("/availability/available",
    [   
        check("artisan_id").exists().trim(),
        check("service_category_id").exists().trim(),
        check("lat").exists().trim(),
        check("lng").exists().trim()   
    ],

    async function (req, res,next) {

    try{

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const multi = redis_client.multi();

        var { artisan_id, service_category_id, lat, lng } = req.body;

        multi.geoadd(`artisans:${service_category_id}`,lat, lng, artisan_id);

        var rs = await new Promise(async (resolve, reject) => {

            multi.exec(function(err, results){
                if(err)  reject(err);    
                resolve(results);
            })

        })

        console.log("results", rs);

        return res.status(200).json(rs);

    }catch(err){

        next(err);

    }

});

router.post("/availability/offline", 
    [   
        check("artisan_id").exists().trim(),
        check("service_category_id").exists().trim(),
    ],
async function (req, res,next) {
    try{


        const errors = validationResult(req);

        const multi = redis_client.multi();

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        var { artisan_id, service_category_id } = req.body;

        var key_hash = `artisans:${service_category_id}`;

        multi.zrem(key_hash, artisan_id)

        var rs = await new Promise(async (resolve, reject) => {

            multi.exec(function(err, results){
                if(err)  reject(err);    
                resolve(results);
            })

        })

        // var rs = redis_client.zrem(key_hash, artisan_id);

        console.log(rs);

        return res.status(200).json(rs);

    }catch(err){

        next(err);

    }


});

router.post("/invalidate/job", [   
    check("job_id").exists().trim(),
    check("service_category_id").exists().trim(),
], 
async (req, res, next) => {

    try{

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const multi = redis_client.multi();

        var { job_id, service_category_id } = req.body;

        var key_hash = `jobs:${service_category_id}`;

        multi.zrem(key_hash, job_id)

        var rs = await new Promise(async (resolve, reject) => {

            multi.exec(function(err, results){
                if(err)  reject(err);    
                resolve(results);
            })

        })

        return res.status(200).json(rs);

    }catch(err){

        next(err);

    }

})

router.post("/geo-search", 
[   
    check("lat").exists().withMessage("Lat is required").trim(),
    check("lng").exists().trim(),
    check("service_category_id").exists().trim(),

]
,async (req, res, next) => {


    try{


        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const multi = redis_client.multi();

        var { service_category_id, lat, lng } = req.body
        
        /**
         * The radius is specified using one of the following unit :- 
            m for meter ( default ).
    
            km for kilometer.
    
            mi for miles.
    
            ft for feet.
         */
    
    
        var radius = 7000;
    
        var match_limit = 10;
    
        const radius_metric = "m";
    
        var key_hash = `jobs:${service_category_id}`;
        
    
        var rs =  await new Promise(function(resolve, reject){

            //eg GEORADIUS artisans:3 -119.58152 37.7487473 4 km
            redis_client.georadius(key_hash, lat, lng, radius,radius_metric,"WITHDIST","ASC","COUNT",match_limit,function(err,r_status){
        
                if(err) reject(err);
        
                resolve(r_status)
        
            } )


        })

        res.status(200).json(rs);

    }catch(err){

        next(err);

        
    }


})



router.post("/geo-add", 
[   
    // check("lat").exists().withMessage("Lat is required").trim(),
    // check("lng").exists().trim(),
    // check("job_id").exists().trim(),
    // check("service_category_id").exists().trim(),

]
,async (req, res, next) => {


    try{

        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const multi = redis_client.multi();
            
        var data = {
            service_category_id: 3,
            job_id: 89,
            lat: 5.572638663469268,
            lng: -0.31366959548092627
        }
            
        multi.geoadd(`jobs:${data.service_category_id}`,data.lat, data.lng, data.job_id);

    
        var rs =  await new Promise(function(resolve, reject){

            multi.exec(function(err, results){
                if(err)  reject(err);    
                resolve(results);
            });
        })

        res.status(200).json(rs);

    }catch(err){

        next(err);

        
    }


})


// The error handler must be before any other error middleware and after all controllers
router.use(Sentry.Handlers.errorHandler());

let error =  Error("Path not found");

//handling errors
router.use((req ,res, next) => {
	error.status =  404;
	next(error);
});

//handle all kinds of errors
router.use((error ,req , res , next) => {

	console.log(error);

	if(!error.status) error.status = 500;

	res.status(error.status);

    if(error.status == 500) {
        error.message = "Something went wrong";
    } 
    
	res.json({
		error:   error.message 
	});
});


module.exports = router;  
  