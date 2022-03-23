const User = require("../models/main").user;

async function  getConsumerFbToken(user_id){

    var user = await User.findOne({
        where: {
                user_id,
                is_active: 1,
                is_flagged: 0
            } 
        }
    )

    return user && user.fb_token;
}


module.exports = {
    getConsumerFbToken
}