const cron = require('node-cron');

const matchArtisansWorker = require("./workers/match-jobs");

//every 30 minutes
/**
 * queries redis instance more (on Produdtion)
 * but hits db (on development)
 */
cron.schedule('* * * * *', async () => {
	//call worker file    

    await matchArtisansWorker.worker();
    
	
});

