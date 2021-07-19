import AWS = require('aws-sdk');
import { Logger } from '@nestjs/common';

const run = async () => {
  const S3 = new AWS.S3({ endpoint: process.env.AWS_BUCKET_ENDPOINT });
  const params: any = {
    Bucket: `${process.env.AWS_BUCKET_PREFIX}gpc-set`,
  };

  const objects: any = await S3.listObjects(params).promise();
  if (!objects || !objects.Contents.length) {
    Logger.log(`No file found in S3 GPC bucket`);
    return;
  }

  Logger.log(`found ${objects.Contents.length} files in S3: [${objects.Contents.map(({ Key }) => Key).join(', ')}]`);
  for await (const { Key } of objects.Contents) {
    S3.deleteObject({ ...params, Key }).promise();
  }
};

run();
