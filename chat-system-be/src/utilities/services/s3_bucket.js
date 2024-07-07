
const AWS = require('aws-sdk');
const { ObjectId } = require("mongodb");
const { getMimeType, ERROR_MESSAGES } = require('../constants');

exports.uploadToS3=async(file)=>{
    try{
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });

    let temp = file.originalname.split('.');
    let fileExtension = temp[temp.length - 1];
    let fileName = `${new ObjectId()}` + '.' + fileExtension;

    const mimeType = getMimeType(fileExtension)
    if (!mimeType) {
        throw new Error(ERROR_MESSAGES.INVALID_FILE_TYPE);
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME ,
        Key:  fileName,
        Body: file.buffer,
        ACL:  'public-read',
        ContentType:`image/${fileExtension}`,
    };

    return await new Promise((resolve, reject) => {
        s3.upload(params, (s3Err, data) => {
            if (s3Err) {
                reject(s3Err);
            }else{
                resolve(data.Location);
            }
        });
    });
    }catch(err){
        throw new Error(err.message)
    } 
};
