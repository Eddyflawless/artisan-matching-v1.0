const expect = require("chai").expect;

const { createGangJobRequests, createJobRequests, createRequestJob, doesJobRequestExist } = require("../app/db/utils/job");

var { expectThrowsAsync } = require("./helpers/common");

module.exports = describe("User util", function () {

    let artisan_id ;
    let job_id;
    let distance = "23";
    let matched_artisans =  [ ]


    before(async function () {

        artisan_id = "ART11007";
        job_id = 89;
        matched_artisans.push([ artisan_id,"20"] )

        //create a job

    });

    //runs at the end of the test suite
    after(function(){
        //do cleanup here

        //delte

    });

    describe("CreateRequestJob function ", function () {

        it("Create job request -- should return error of distance is required", async function(){
    
            await expectThrowsAsync(createRequestJob,[artisan_id,null,null],"Disance must be provided");
    
        });
    
        it("Create job request -- should return artisan_id required error", async function(){
    
            await expectThrowsAsync(createRequestJob,[null,null,null],"Artisan id must be passed")
    
        });
    
        it("Create job request -- should return job id required error", async function(){
    
            await expectThrowsAsync(createRequestJob,[artisan_id,distance,null],"Job id must be passed");
    
        });


        // it('Create job request -- should return null on job existing on artisan', async function(){

        //     var rs = await createRequestJob(artisan_id, distance, job_id);

        //     expect(rs).to.be.null;
    
        // });

   

        
    })

    describe("doesJobRequestExist", function() {

        it('Check job request -- should return defined object', async function(){

            var rs  = await doesJobRequestExist(artisan_id, job_id);

            expect(rs).to.have.property("artisan_id", artisan_id);

            expect(rs).to.have.property("job_id", job_id);

            expect(rs).to.have.property("distance");

            expect(rs).to.have.property("id");
    
        });

        it('Check job request -- should return a null object', async function(){

            var rs  = await doesJobRequestExist("xv9202", 10);

            expect(rs).to.be.null;
    
        });

    })

    describe("createJobRequests", function() {

        it('Create job request by passing empty matched artisan list -- should return false', async function(){

            let matched_artisans = [];

            var rs  = await createJobRequests(matched_artisans,job_id)

            expect(rs).to.be.false;
    
        });

        it('Create job request by a wrong job ID and unempty artisan list -- should return false', async function(){

            let job_id = 1000000;

            var rs  = await createJobRequests(matched_artisans,job_id)

            expect(rs).to.be.false;
    
        });

        it('Check job request -- should return true', async function(){

            var rs  = await createJobRequests(matched_artisans,job_id)

            expect(rs).to.be.true;
    
        });


    });





})





