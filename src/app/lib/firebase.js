
var admin = require("firebase-admin");

var serviceAccount = require("../../handwerker-3acf2-firebase-adminsdk-tjt9z-c358603977.json");

const firebase_client = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

/**
 * 
 * @param {*} message 
 * @param {*} firebase_token 
 */
 async function sendPushNotification(message,registration_token,data=[],topic=null){


    console.log("firebase notification ",...arguments);

    return;

    const notication_options = {
        priority: "high", //  high priority gets delivered immediately .
        timeToLive: 60 * 60 * 24 // time the message takes to expire
    }

    //this format allows notification not to be shown as a silent notification
    //but an actual push notification
    const message_payload = {
        notification: {
            title: "",
            body: message
        },
        topic,
        data
    }

    try {
        
        return await firebase_client.messaging().sendToDevice(registration_token, message_payload, notication_options);

    } catch (error) {
        
        console.error(error,error.stack);
        //send error to sentry
        return null
    }

}

module.exports = sendPushNotification;