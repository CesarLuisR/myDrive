import AWS from "aws-sdk"
import config from ".";

AWS.config.update({
  accessKeyId: config.aws.public_key,
  secretAccessKey: config.aws.secret_key,
  region: config.aws.bucket_region,
});

export const s3 = new AWS.S3();