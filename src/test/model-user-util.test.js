const expect = require("chai").expect;

const { getConsumerFbToken } = require("../app/db/utils/user");

module.exports = describe("User util", function () {

    let user_id ;

    before(async function () {

        user_id = 'USR11001';

    });

    //runs at the end of the test suite
    after(function(){
        //do cleanup here

    });

    it('GET user firebase token -- should return null', async function(){

        let firebase_token = await getConsumerFbToken('xx343');

        expect(firebase_token).to.be.null;

    });

    it('GET user firebase token -- should return a defined string', async function(){

        let firebase_token = await getConsumerFbToken(user_id);

        expect(firebase_token).to.be.a('string');

    });


})





