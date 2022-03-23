
require('dotenv').config({ path: '.dev.env' });

var AWS = require('aws-sdk');

const { config } = require("../config");

var credentials = config.sqs;

// Set credentials
AWS.config.update(credentials);

let queueUrl;

// const queueUrl =  `https://sqs.${process.env.SQS_REGION}.amazonaws.com/${process.env.SQS_ACCOUNT_ID}/${queue_name}` ;

const sqs_client = new AWS.SQS({apiVersion: '2012-11-05'});


module.exports.init = (queue_url) => {

    if(!queue_url) throw new Error("queueUrl is required");

    queueUrl = queue_url;

    return {
        send_sqs_message,
        receive_sqs_message,
        deleteSqsMessage
    }

}

const send_sqs_message = (MessageAttributes, MessageBody) => {

    const params = {
        DelaySeconds: 10,
        QueueUrl: queueUrl,
        MessageAttributes,
        MessageBody
    };

    try{

        sqs_client.sendMessage(params, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data.MessageId);
            }
          });

    }catch (error) {

        console.log(error);
    }


};

const receive_sqs_message = async () => {
    
    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,//number of messages to pull
        VisibilityTimeout: 10,
        WaitTimeSeconds: 0
    };

    try {
        
        const data = sqs_client.receiveMessage(params).promise();
        
        return data.Messages;

    } catch (error) {
        console.log(error,error.stack);
        //send to sentry
        return null
    }


};

const deleteSqsMessage = async function (message) {

    const delete_params = {
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle
    }
    //delete messafe so we wont have to handle it again
    await sqs.deleteMessage(delete_params).promise();

}
