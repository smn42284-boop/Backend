const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

// Generate pre-signed URL for upload
const generatePresignedUrl = (fileName, fileType) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/${Date.now()}_${fileName}`,
    ContentType: fileType,
    ACL: 'public-read',
    Expires: 300 // 5 minutes
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          uploadUrl: url,
          fileUrl: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${params.Key}`
        });
      }
    });
  });
};

// Upload file directly from server
const uploadFile = (fileBuffer, fileName, mimetype) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/${Date.now()}_${fileName}`,
    Body: fileBuffer,
    ContentType: mimetype,
    ACL: 'public-read'
  };

  return s3.upload(params).promise();
};

// List files in bucket
const listFiles = () => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Prefix: 'uploads/'
  };

  return s3.listObjectsV2(params).promise();
};

// Delete file from bucket
const deleteFile = (fileKey) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileKey
  };

  return s3.deleteObject(params).promise();
};

module.exports = {
  s3,
  generatePresignedUrl,
  uploadFile,
  listFiles,
  deleteFile
};