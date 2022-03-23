    
    'use strict';
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const fs = require('fs');
    const path = require('path');

    const salt_rounds = 10;

    const jwtOptions = {
        algorithm: 'HS256',
        expiresIn: "7d"
    };

    module.exports.signToken = (payload) => {
        //get privatekey 
        let privatekey = getPrivateKey();

        let token = jwt.sign(payload,privatekey,jwtOptions);

        return token;
    }

    module.exports.validateToken =  async (bearer) => {
        try{
            var token = bearer.trim();

            let privatekey = getPrivateKey();

            var decoded = await jwt.verify(token,privatekey,jwtOptions);

            return decoded;

        }catch(error){
            throw error;
        }
    }

    module.exports.comparePassword = async (raw_password, hashed_password) => await bcrypt.compare(raw_password,hashed_password);
    

    module.exports.hashPassword = async (temp_password) => {

        var salt = await bcrypt.genSalt(salt_rounds);

        let hash = await bcrypt.hashSync(temp_password, salt);

        return hash;
    }



    const getPrivateKey = () => {
        var pem_path = path.join(__dirname,'../private.pem');
        return  fs.readFileSync(pem_path,'utf8');
    }

