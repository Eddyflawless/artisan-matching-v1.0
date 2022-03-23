
const router = require('express').Router();
const { check } = require('express-validator');
const db  = require('../app/db/models/config');
const { Op } = require("sequelize");
const Models  = require('../app/db/models/main');
const moment = require('moment');
const redis_client = require('../bootstrap').redis_clien

router.get("/g", async function(req,res){

    // var user_id = req.params.user_id;

    const user_list = await db.query("select users.* from users ", {
        replacements: {  },
        type: db.QueryTypes.SELECT,
    });

    //pluck ids
    user_ids = user_list.map( (user) => user.user_id)
    res.json(user_ids);
	//res.send("hello world");
})

router.get("/g/:user_id", async function(req,res){

    var user_id = req.params.user_id;

    const user = await db.query("select users.* from users where user_id = :user_id", {
        replacements: { user_id },
        mapToModel: true,
        model: Models.user,
    });

    //pluck ids
    res.json(user[0].id);
	//res.send("hello world");
})

router.get("/p/match", async function(req, res){

    var job_id = 88;

    var _m = moment().format('Y-M-d')
    // res.json(_m);

    try{

        var data = await Models.job.findOne({
            where: {
                id: job_id,
                status: 'pending',
                requested_date:  {
                    [Op.lte] : _m
                }

            }
        });

        res.json(data);

    }catch(err){

        console.error(err);
        res.json(null);
    }

})


router.get("/geo-add", async function(req, res){

    var key_hash = `artisans:3`;
    var lat = "5.55907";
    var lng = "-0.183888";
 
    const artisan_id = 'ART11007';
    const multi = redis_client.multi();


    multi.geoadd(key_hash,lat, lng, artisan_id);
    multi.exec(function(err, results){
        if(err) throw err;

        console.log(results);

    })

    res.json(null);

})

router.get("/geo", async function(req, res){

    var key_hash = `artisans:3`;
    var lat = "5.55907";
    var lng = "-0.183888";
    var radius = 40;
    var match_limit = 3;
    var radius_metric = "m";

    redis_client.georadius(key_hash, lat, lng, radius,radius_metric,"WITHDIST","ASC","COUNT",match_limit,function(err,r_status){
    
        if(err) console.log(err);
 
        console.log(r_status[0][0])
 
    } );

    res.json(null);

})

// router.get("/artisan/:artisan_id", async function(req,res){

//     var artisan_id = req.params.artisan_id;

//     var artisan = await db.query("select artisans.*,(select count(id) from jobs where jobs.artisan_id = artisans.artisan_id) as jobs from artisans where artisan_id = :artisan_id", {
//         replacements: { artisan_id },
//         include: [ Models.user],
//         mapToModel: true,
//         model: Models.artisan,
//     });
    
//     artisan = artisan;
//     res.json(artisan);
// })



module.exports = router;  
  