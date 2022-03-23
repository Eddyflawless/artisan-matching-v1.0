module.exports.config = {
    jwt: {
        options: {
            algorithm: 'HS256',
            expiresIn: "7d"
        },
        rounds: 10
    },
    grpc : {
        keepCase: true,
        longs: String,
        enums: String,
        array: true,
        defaults: true,
        oneofs: true
    },
    sqs: { 
        "accessKeyId": process.env.SQS_ACCESS_KEY_ID, 
        "secretAccessKey": process.env.SQS_SECRET_ACCESS_KEY, 
        "region": process.env.SQS_REGION 
    }

}