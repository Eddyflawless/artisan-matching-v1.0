    
'use strict';

const Models = require('../db/models/main');

module.exports.guard =  async function(req,res,next){

    try{

        if(!req.headers.authorization || req.headers.authorization.indexOf('Basic ') == -1){

            return res.status(401).json({ message: 'Missing Authorization Header' });
        }

        const basicCredentials = req.headers.authorization.split(" ")[1];

        const credentials = Buffer.from(basicCredentials, 'base64').toString('ascii');

        const [username, password] = credentials.split(':');

        var userData = await Models.api_client.findOne({
            where: {
                client_id: username,
                client_secret: password,
                is_active: true
            }
        })

        if(!userData) return res.status(401).json({ error: "Client not authenticated. E01"});

        req.auth = {};

        next();

    }catch(error){

        next(error);

    }
} 

